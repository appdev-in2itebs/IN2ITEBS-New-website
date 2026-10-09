"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { authClient, authConfigured } from "@/lib/admin/session";

export type LoginState = { error?: string };

export async function signIn(_: LoginState, form: FormData): Promise<LoginState> {
  if (!authConfigured())
    return {
      error: "The admin is not connected to Supabase yet. Add the keys to web/.env.local (see the setup notes).",
    };
  const email = String(form.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };
  const auth = await authClient();
  const { data, error } = await auth.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "That email and password do not match." };
  const { data: row } = await supabaseAdmin()
    .from("admin_users")
    .select("active")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (!row?.active) {
    await auth.auth.signOut();
    return { error: "This account does not have access to the admin. Ask an administrator to add you." };
  }
  // ?welcome=1 plays the In2IT brand splash once over the dashboard (components/admin/splash.tsx).
  redirect("/admin/?welcome=1");
}

export async function signOut() {
  await (await authClient()).auth.signOut();
  redirect("/admin/login/");
}
