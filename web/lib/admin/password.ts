import { createHmac, randomBytes, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { mailConfigured, sendMail } from "@/lib/mail/send";
import { accountCreatedEmail, passwordChangedEmail, passwordCodeEmail, type CodePurpose } from "@/lib/mail/templates";
import { requireAdmin, type AdminUser } from "./session";

/**
 * Admin passwords change only through a one-time code. Whoever asks (a signed-in admin under
 * My account, someone on the Forgot-password page, or the owner setting a new person's first
 * password), the six-digit code is emailed to the website owner (ADMIN_OWNER_EMAIL), who hands it
 * over if the request is expected. The code is valid ten minutes, allows five guesses and works
 * once; only its HMAC is stored. Nothing here needs the VM: it replaces set-admin-password.sh.
 */
export const CODE_MINUTES = 10;
export const CODE_ATTEMPTS = 5;
const CODES_PER_WINDOW = 3;
const WINDOW_MINUTES = 15;
export const PASSWORD_MIN = 10;
export const PASSWORD_MAX = 72;
export const GENERIC_SENT = "If that email belongs to an admin, a one-time code is on its way to the website owners.";

/** The website owners (ADMIN_OWNER_EMAIL, comma-separated): every code goes to all of them. */
export function ownerEmails(): string[] {
  return Array.from(
    new Set(
      (process.env.ADMIN_OWNER_EMAIL ?? "")
        .split(/[,;\s]+/)
        .map((e) => e.trim().toLowerCase())
        .filter((e) => e.includes("@")),
    ),
  );
}

/** The owners as one readable string for screens and emails, or null when none is set. */
export function ownerEmail(): string | null {
  const list = ownerEmails();
  return list.length ? list.join(" and ") : null;
}

/** The owners manage users and passwords. Until ADMIN_OWNER_EMAIL is set, any admin may. */
export function isOwner(email: string) {
  const owners = ownerEmails();
  return owners.length ? owners.includes(email.toLowerCase()) : true;
}

export async function requireOwner(): Promise<AdminUser> {
  const admin = await requireAdmin("users");
  if (!isOwner(admin.email)) redirect("/admin/?denied=1");
  return admin;
}

export function newCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashCode(ticket: string, code: string) {
  const secret = process.env.OTP_SECRET || process.env.SUPABASE_SECRET_KEY || "";
  return createHmac("sha256", secret).update(`${ticket}:${code}`).digest("hex");
}

export function sameHash(a: string, b: string) {
  const x = Buffer.from(a, "utf8");
  const y = Buffer.from(b, "utf8");
  return x.length === y.length && timingSafeEqual(x, y);
}

export function validPassword(p: string): string | null {
  if (p.length < PASSWORD_MIN) return `The new password needs at least ${PASSWORD_MIN} characters.`;
  if (p.length > PASSWORD_MAX) return `The new password can have at most ${PASSWORD_MAX} characters.`;
  if (!/[a-z]/i.test(p) || !/\d/.test(p)) return "Use letters and at least one number.";
  return null;
}

/** A random password nobody knows, for a login that gets its real password through a code. */
export function unusablePassword() {
  return randomBytes(24).toString("base64url");
}

export type Started = { ok: true; ticket: string } | { ok: false; error: string };

async function activeAdmin(email: string) {
  const { data } = await supabaseAdmin()
    .from("admin_users")
    .select("user_id, email, name, role, active")
    .eq("email", email)
    .maybeSingle();
  return data?.active ? data : null;
}

/**
 * Starts a code for `targetEmail`. Unknown or inactive targets still "succeed" with a ticket that
 * matches nothing, so the public reset page cannot be used to list admin emails.
 */
export async function startPasswordCode(input: {
  targetEmail: string;
  purpose: CodePurpose;
  requestedBy: string | null;
}): Promise<Started> {
  const targetEmail = input.targetEmail.trim().toLowerCase();
  const owners = ownerEmails();
  if (!owners.length)
    return { ok: false, error: "ADMIN_OWNER_EMAIL is not set, so there is nobody to send the code to." };
  if (!mailConfigured()) return { ok: false, error: "Email is not configured on the server (SMTP settings)." };
  const target = await activeAdmin(targetEmail);
  if (!target) return { ok: true, ticket: randomUUID() };

  const db = supabaseAdmin();
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();
  const { count } = await db
    .from("admin_password_codes")
    .select("id", { count: "exact", head: true })
    .eq("target_email", targetEmail)
    .gte("created_at", since);
  if ((count ?? 0) >= CODES_PER_WINDOW)
    return {
      ok: false,
      error: `Too many codes were requested for this account. Try again in ${WINDOW_MINUTES} minutes.`,
    };

  const ticket = randomUUID();
  const code = newCode();
  const expires = new Date(Date.now() + CODE_MINUTES * 60_000).toISOString();
  const { error } = await db.from("admin_password_codes").insert({
    id: ticket,
    target_email: targetEmail,
    purpose: input.purpose,
    requested_by: input.requestedBy,
    code_hash: hashCode(ticket, code),
    expires_at: expires,
  });
  if (error) return { ok: false, error: "Could not create the code. Is migration 0006 applied?" };

  try {
    const mail = passwordCodeEmail({
      code,
      purpose: input.purpose,
      targetEmail,
      requestedBy: input.requestedBy,
      expiresMinutes: CODE_MINUTES,
    });
    await sendMail({ to: owners, ...mail });
  } catch (e) {
    await db.from("admin_password_codes").delete().eq("id", ticket);
    console.error("[admin password] mail failed:", e instanceof Error ? e.message : e);
    return { ok: false, error: "The code email could not be sent. Check the SMTP settings on the server." };
  }
  await db
    .from("admin_audit")
    .insert({
      user_email: input.requestedBy ?? targetEmail,
      action: "password_code",
      entity: "admin_user",
      entity_id: target.user_id,
      detail: { purpose: input.purpose, target: targetEmail },
    })
    .then(
      () => undefined,
      () => undefined,
    );
  return { ok: true, ticket };
}

export type Finished = { ok: true; email: string } | { ok: false; error: string };

const BAD_CODE = "That code is not valid or has expired. Ask for a new one.";

/** Checks the code against the ticket and, when it matches, sets the new password. */
export async function finishPasswordCode(input: {
  ticket: string;
  code: string;
  newPassword: string;
  actorEmail: string | null;
  /** When set, the ticket must be for this account (My account: your own; Users: the chosen person). */
  expectEmail?: string;
}): Promise<Finished> {
  const ticket = input.ticket.trim();
  const code = input.code.replace(/\D/g, "");
  if (!/^[0-9a-f-]{36}$/i.test(ticket) || code.length !== 6) return { ok: false, error: BAD_CODE };
  const bad = validPassword(input.newPassword);
  if (bad) return { ok: false, error: bad };

  const db = supabaseAdmin();
  const { data: row } = await db
    .from("admin_password_codes")
    .select("id, target_email, purpose, requested_by, code_hash, attempts, expires_at, used_at")
    .eq("id", ticket)
    .maybeSingle();
  if (!row || row.used_at || new Date(row.expires_at).getTime() < Date.now() || row.attempts >= CODE_ATTEMPTS)
    return { ok: false, error: BAD_CODE };
  if (input.expectEmail && row.target_email !== input.expectEmail.trim().toLowerCase())
    return { ok: false, error: BAD_CODE };

  if (!sameHash(row.code_hash, hashCode(ticket, code))) {
    await db
      .from("admin_password_codes")
      .update({ attempts: row.attempts + 1 })
      .eq("id", ticket);
    const left = CODE_ATTEMPTS - row.attempts - 1;
    return {
      ok: false,
      error: left > 0 ? `That code does not match. ${left} tr${left === 1 ? "y" : "ies"} left.` : BAD_CODE,
    };
  }

  const target = await activeAdmin(row.target_email);
  if (!target) return { ok: false, error: BAD_CODE };
  const { error } = await db.auth.admin.updateUserById(target.user_id, { password: input.newPassword });
  if (error) return { ok: false, error: "The password could not be saved. Try again." };
  await db.from("admin_password_codes").update({ used_at: new Date().toISOString() }).eq("id", ticket);

  const purpose = row.purpose as CodePurpose;
  const actor = input.actorEmail ?? row.requested_by ?? null;
  await db
    .from("admin_audit")
    .insert({
      user_email: actor ?? target.email,
      action: purpose === "set" ? "password_set" : "password_changed",
      entity: "admin_user",
      entity_id: target.user_id,
      detail: { purpose, target: target.email },
    })
    .then(
      () => undefined,
      () => undefined,
    );
  const to = Array.from(new Set([target.email, ...ownerEmails()]));
  sendMail({
    to,
    ...passwordChangedEmail({ targetEmail: target.email, purpose, changedBy: actor, at: new Date() }),
  }).catch((e) => console.error("[admin password] confirmation mail failed:", e instanceof Error ? e.message : e));
  return { ok: true, email: target.email };
}

/** Tells a new admin their account exists; the owner sets the first password through a code. */
export async function notifyAccountCreated(input: { email: string; name: string | null; role: string }) {
  const owner = ownerEmail();
  if (!owner || !mailConfigured()) return;
  await sendMail({
    to: input.email,
    ...accountCreatedEmail({ targetEmail: input.email, ...input, ownerEmail: owner }),
  }).catch((e) => console.error("[admin password] welcome mail failed:", e instanceof Error ? e.message : e));
}
