"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { audit, requireAdmin } from "@/lib/admin/session";
import { ROLES } from "@/lib/admin/permissions";
import { isUuid } from "@/lib/admin/query";

const newUser = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  name: z.string().trim().max(120).optional().default(""),
  role: z.enum(ROLES),
  password: z.string().min(10, "The temporary password needs at least 10 characters.").max(72),
});

const back = (msg: string, ok = false) =>
  redirect(`/admin/users/?${ok ? "saved" : "error"}=${encodeURIComponent(msg)}`);

/** Creates the Supabase login (or reuses an existing one) and gives it a role in the admin. */
export async function addUser(form: FormData) {
  const admin = await requireAdmin("users");
  const parsed = newUser.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) back(parsed.error.issues[0].message);
  const { email, name, role, password } = parsed.data!;
  const db = supabaseAdmin();
  let userId: string | null = null;
  const created = await db.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { name } });
  if (created.data.user) userId = created.data.user.id;
  else {
    // Already has a Supabase login: find it and attach the role.
    for (let page = 1; page <= 20 && !userId; page++) {
      const { data } = await db.auth.admin.listUsers({ page, perPage: 200 });
      userId = data?.users.find((u) => u.email?.toLowerCase() === email)?.id ?? null;
      if (!data || data.users.length < 200) break;
    }
  }
  if (!userId) back("Could not create that login.");
  const { error } = await db
    .from("admin_users")
    .upsert({ user_id: userId, email, name: name || null, role, active: true });
  if (error) back("Could not save the user.");
  await audit(admin, "create", "admin_user", userId!, { email, role });
  back(`Added ${email} as ${role}. Share the temporary password with them privately.`, true);
}

export async function updateUser(form: FormData) {
  const admin = await requireAdmin("users");
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
