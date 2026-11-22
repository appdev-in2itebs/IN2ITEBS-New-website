"use client";

import { useActionState, useState } from "react";
import { CircleAlert, Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import { input, label } from "@/components/admin/ui";

export type CodeFormState = { error?: string };
export type CodeFormAction = (state: CodeFormState, form: FormData) => Promise<CodeFormState>;

/**
 * Step two of every password change: the six-digit code (from the website owner's email) and the
 * new password, twice. Used by Forgot password, My account and the owner's Users page, which only
 * differ in the server action that receives it.
 */
export function PasswordCodeForm({
  action,
  ticket,
  email,
  submitLabel = "Set the new password",
  compact = false,
}: {
  action: CodeFormAction;
  ticket: string;
  email?: string;
  submitLabel?: string;
  compact?: boolean;
}) {
  const [state, submit, pending] = useActionState<CodeFormState, FormData>(action, {});
  const [show, setShow] = useState(false);
  const invalid = Boolean(state.error);
  return (
    <form action={submit} className={compact ? "space-y-4" : "mt-7 space-y-4"}>
      <input type="hidden" name="ticket" value={ticket} />
      {email ? <input type="hidden" name="email" value={email} /> : null}
      <label className={`${label} login-field`}>
        One-time code
        <input
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          required
          placeholder="123456"
          className={`${input} text-center font-mono text-lg tracking-[0.45em]`}
          aria-invalid={invalid || undefined}
        />
        <KeyRound className="login-icon" strokeWidth={1.9} aria-hidden />
      </label>
      <label className={`${label} login-field`}>
        New password
        <input
          name="password"
          type={show ? "text" : "password"}
          autoComplete="new-password"
          minLength={10}
          maxLength={72}
          required
          placeholder="At least 10 characters, with a number"
          className={input}
          aria-invalid={invalid || undefined}
        />
        <Lock className="login-icon" strokeWidth={1.9} aria-hidden />
        <button
          type="button"
          className="login-eye"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
        >
          {show ? <EyeOff size={20} strokeWidth={1.9} aria-hidden /> : <Eye size={20} strokeWidth={1.9} aria-hidden />}
        </button>
      </label>
      <label className={`${label} login-field`}>
        Repeat the new password
        <input
          name="confirm"
          type={show ? "text" : "password"}
          autoComplete="new-password"
          minLength={10}
          maxLength={72}
          required
          placeholder="Same again"
          className={input}
          aria-invalid={invalid || undefined}
        />
        <Lock className="login-icon" strokeWidth={1.9} aria-hidden />
      </label>
      {state.error ? (
        <p role="alert" className="login-error">
          <CircleAlert aria-hidden />
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className={compact ? "aura-btn aura-press" : "aura-btn aura-btn--lg mt-2"}
      >
        {pending ? (
          <>
            <span className="login-spinner" aria-hidden />
            Saving
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
