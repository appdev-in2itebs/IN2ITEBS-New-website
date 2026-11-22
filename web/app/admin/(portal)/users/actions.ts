"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { audit } from "@/lib/admin/session";
import { ROLES } from "@/lib/admin/permissions";
import { isUuid } from "@/lib/admin/query";
import {
  finishPasswordCode,
  notifyAccountCreated,
  requireOwner,
  startPasswordCode,
  unusablePassword,
} from "@/lib/admin/password";
import type { CodeFormState } from "@/components/admin/password-code-form";

/**
 * Only the website owner (ADMIN_OWNER_EMAIL) manages people and passwords. Nobody types a
 * password for someone else without a one-time code: a new person gets a login with a password
 * nobody knows, then the owner sets the first one through the code screen and shares it privately.
 */
const newUser = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  name: z.string().trim().max(120).optional().default(""),
  role: z.enum(ROLES),
});

const back = (msg: string, ok = false): never =>
  redirect(`/admin/users/?${ok ? "saved" : "error"}=${encodeURIComponent(msg)}`);

async function findUserId(email: string) {
  const db = supabaseAdmin();
  for (let page = 1; page <= 20; page++) {
    const { data } = await db.auth.admin.listUsers({ page, perPage: 200 });
    const hit = data?.users.find((u) => u.email?.toLowerCase() === email)?.id;
    if (hit) return hit;
    if (!data || data.users.length < 200) break;
  }
  return null;
}

/** Creates the login (or reuses an existing one), gives it a role, then opens the first-password screen. */
export async function addUser(form: FormData) {
  const admin = await requireOwner();
  const parsed = newUser.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) back(parsed.error.issues[0].message);
  const { email, name, role } = parsed.data!;
  const db = supabaseAdmin();
  const created = await db.auth.admin.createUser({
    email,
    password: unusablePassword(),
    email_confirm: true,
    user_metadata: { name },
  });
  const userId = created.data.user?.id ?? (await findUserId(email));
  if (!userId) back("Could not create that login.");
  const { error } = await db
    .from("admin_users")
    .upsert({ user_id: userId, email, name: name || null, role, active: true });
  if (error) back("Could not save the user.");
  await audit(admin, "create", "admin_user", userId!, { email, role });
  await notifyAccountCreated({ email, name: name || null, role });
  const started = await startPasswordCode({ targetEmail: email, purpose: "set", requestedBy: admin.email });
  if (!started.ok) return back(`Added ${email} as ${role}, but no code could be sent: ${started.error}`);
  redirect(`/admin/users/password/?ticket=${encodeURIComponent(started.ticket)}&email=${encodeURIComponent(email)}`);
}

export async function updateUser(form: FormData) {
  const admin = await requireOwner();
  const id = String(form.get("id") ?? "");
  const role = String(form.get("role") ?? "");
  const active = form.get("active") === "yes";
  if (!isUuid(id) || !ROLES.includes(role as never)) back("Invalid change.");
  if (id === admin.id && (role !== "admin" || !active)) back("You cannot remove your own admin access.");
  const { error } = await supabaseAdmin().from("admin_users").update({ role, active }).eq("user_id", id);
  if (error) back("Could not save.");
  await audit(admin, "update", "admin_user", id, { role, active });
  back("Saved.", true);
}

/** "Reset password" on a person's row: a code goes to the owner, then the owner sets the new password. */
export async function startUserPassword(form: FormData) {
  const admin = await requireOwner();
  const email = String(form.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email) back("Choose a person.");
  const started = await startPasswordCode({ targetEmail: email, purpose: "reset", requestedBy: admin.email });
  if (!started.ok) return back(started.error);
  redirect(`/admin/users/password/?ticket=${encodeURIComponent(started.ticket)}&email=${encodeURIComponent(email)}`);
}

export async function finishUserPassword(_: CodeFormState, form: FormData): Promise<CodeFormState> {
  const admin = await requireOwner();
  const password = String(form.get("password") ?? "");
  if (password !== String(form.get("confirm") ?? "")) return { error: "The two passwords do not match." };
  const email = String(form.get("email") ?? "");
  const done = await finishPasswordCode({
    ticket: String(form.get("ticket") ?? ""),
    code: String(form.get("code") ?? ""),
    newPassword: password,
    actorEmail: admin.email,
    expectEmail: email,
  });
  if (!done.ok) return { error: done.error };
  back(`The password for ${done.email} is set. Share it with them privately.`, true);
  return {};
}
