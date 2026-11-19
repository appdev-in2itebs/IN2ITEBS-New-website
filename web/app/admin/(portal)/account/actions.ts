"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/session";
import { finishPasswordCode, startPasswordCode } from "@/lib/admin/password";
import type { CodeFormState } from "@/components/admin/password-code-form";

/** Step one of changing your own password: a code goes to the website owner. */
export async function startMyPassword() {
  const admin = await requireAdmin("account");
  const started = await startPasswordCode({ targetEmail: admin.email, purpose: "change", requestedBy: admin.email });
  if (!started.ok) redirect(`/admin/account/?error=${encodeURIComponent(started.error)}`);
  redirect(`/admin/account/?ticket=${encodeURIComponent(started.ticket)}`);
}

/** Step two: the code plus the new password. */
export async function finishMyPassword(_: CodeFormState, form: FormData): Promise<CodeFormState> {
  const admin = await requireAdmin("account");
  const password = String(form.get("password") ?? "");
  if (password !== String(form.get("confirm") ?? "")) return { error: "The two passwords do not match." };
  const done = await finishPasswordCode({
    ticket: String(form.get("ticket") ?? ""),
    code: String(form.get("code") ?? ""),
    newPassword: password,
    actorEmail: admin.email,
    expectEmail: admin.email,
  });
  if (!done.ok) return { error: done.error };
  redirect("/admin/account/?saved=1");
}
