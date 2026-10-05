import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin, supabaseConfigured, supabaseProjectUrl } from "@/lib/supabase";
import { can, type Role, type Section } from "./permissions";

/**
 * Admin sign-in uses Supabase Auth (email and password) with the session in HTTP-only cookies.
 * Being signed in is not enough: the user must also have an active row in admin_users, whose role
 * decides what they may open. All data access then happens here on the server with the secret key.
 */
export type AdminUser = { id: string; email: string; name: string | null; role: Role };

export function authConfigured() {
  return supabaseConfigured() && Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export async function authClient() {
  const store = await cookies();
  return createServerClient(
    supabaseProjectUrl(process.env.SUPABASE_URL ?? ""),
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (list) => {
          try {
            for (const { name, value, options } of list) store.set(name, value, options);
          } catch {
            // Called from a server component, which may not set cookies; middleware refreshes them.
          }
        },
      },
    },
  );
}

export async function getAdmin(): Promise<AdminUser | null> {
  if (!authConfigured()) return null;
  const {
    data: { user },
  } = await (await authClient()).auth.getUser();
  if (!user) return null;
  const { data } = await supabaseAdmin()
    .from("admin_users")
    .select("user_id, email, name, role, active")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data?.active) return null;
  return { id: data.user_id, email: data.email, name: data.name, role: data.role as Role };
}

/** For pages and actions: the signed-in admin, or a redirect to the login (or the dashboard). */
export async function requireAdmin(section?: Section): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login/");
  if (section && !can(admin.role, section)) redirect("/admin/?denied=1");
  return admin;
}

export async function audit(admin: AdminUser, action: string, entity: string, entityId?: string, detail?: object) {
  await supabaseAdmin()
    .from("admin_audit")
    .insert({ user_email: admin.email, action, entity, entity_id: entityId ?? null, detail: detail ?? null })
    .then(
      () => undefined,
      () => undefined,
    );
}
