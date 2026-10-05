"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "./actions";
import { input, label, primaryBtn } from "@/components/admin/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <label className={label}>
        Email
        <input name="email" type="email" required autoComplete="username" className={input} />
      </label>
      <label className={label}>
        Password
        <input name="password" type="password" required autoComplete="current-password" className={input} />
      </label>
      {state.error ? (
        <p role="alert" className="text-sm font-medium text-foreground">
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className={`${primaryBtn} w-full`}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
