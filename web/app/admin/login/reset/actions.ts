"use server";

import { redirect } from "next/navigation";
import { finishPasswordCode, startPasswordCode } from "@/lib/admin/password";
import type { CodeFormState } from "@/components/admin/password-code-form";

export type ResetRequestState = { error?: string };

/** Step one of Forgot password: ask for a code. The answer is the same whether or not the email is an admin. */
export async function requestReset(_: ResetRequestState, form: FormData): Promise<ResetRequestState> {
  const email = String(form.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email || !email.includes("@")) return { error: "Enter your work email." };
  const started = await startPasswordCode({ targetEmail: email, purpose: "reset", requestedBy: null });
  if (!started.ok) return { error: started.error };
  redirect(`/admin/login/reset/?ticket=${encodeURIComponent(started.ticket)}`);
}

/** Step two: the code from the website owner plus the new password. */
export async function completeReset(_: CodeFormState, form: FormData): Promise<CodeFormState> {
  const password = String(form.get("password") ?? "");
  if (password !== String(form.get("confirm") ?? "")) return { error: "The two passwords do not match." };
  const done = await finishPasswordCode({
    ticket: String(form.get("ticket") ?? ""),
    code: String(form.get("code") ?? ""),
    newPassword: password,
    actorEmail: null,
  });
  if (!done.ok) return { error: done.error };
  redirect("/admin/login/?reset=1");
}
