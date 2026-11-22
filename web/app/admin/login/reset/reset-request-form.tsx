"use client";

import { useActionState } from "react";
import { ArrowRight, CircleAlert, Mail } from "lucide-react";
import { input, label } from "@/components/admin/ui";
import { requestReset, type ResetRequestState } from "./actions";

export function ResetRequestForm() {
  const [state, action, pending] = useActionState<ResetRequestState, FormData>(requestReset, {});
  return (
    <form action={action} className="mt-7 space-y-4">
      <label className={`${label} login-field`}>
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          placeholder="you@in2itebs.com"
          className={input}
          aria-invalid={Boolean(state.error) || undefined}
        />
        <Mail className="login-icon" strokeWidth={1.9} aria-hidden />
      </label>
      {state.error ? (
        <p role="alert" className="login-error">
          <CircleAlert aria-hidden />
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className="aura-btn aura-btn--lg mt-2">
        {pending ? (
          <>
            <span className="login-spinner" aria-hidden />
            Sending the code
          </>
        ) : (
          <>
            Send me a code
            <ArrowRight size={20} strokeWidth={2.2} aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}
