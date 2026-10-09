"use client";

import { useActionState, useState } from "react";
import { ArrowRight, CircleAlert, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { signIn, type LoginState } from "./actions";
import { input, label } from "@/components/admin/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});
  const [show, setShow] = useState(false);
  const invalid = Boolean(state.error);
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
          aria-invalid={invalid || undefined}
        />
        <Mail className="login-icon" strokeWidth={1.9} aria-hidden />
      </label>
      <label className={`${label} login-field`}>
        Password
        <input
          name="password"
          type={show ? "text" : "password"}
          required
          autoComplete="current-password"
          placeholder="••••••••••"
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
            Signing in
          </>
        ) : (
          <>
            Sign in
            <ArrowRight size={20} strokeWidth={2.2} aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}
