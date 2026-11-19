import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin/session";
import { GENERIC_SENT } from "@/lib/admin/password";
import { LoginBrandPanel } from "@/components/admin/login-brand";
import { PasswordCodeForm } from "@/components/admin/password-code-form";
import { ResetRequestForm } from "./reset-request-form";
import { completeReset } from "./actions";

/**
 * Forgot password, in two steps on one address: first the email, then (with ?ticket=) the one-time
 * code and the new password. The code goes to the admin's own inbox; unknown emails get the same
 * answer as known ones, so the page cannot be used to list admin accounts.
 */
export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ ticket?: string }> }) {
  if (await getAdmin()) redirect("/admin/account/");
  const { ticket } = await searchParams;
  return (
    <div className="login">
      <LoginBrandPanel />
      <section className="login-side">
        <div className="login-card aura-rise" style={{ "--i": 2 } as React.CSSProperties}>
          <Image src="/brand/in2it-ebs-navy.svg" alt="" width={150} height={36} className="h-7 w-auto" />
          <p className="aura-overline mt-6">Admin</p>
          {ticket ? (
            <>
              <h2>
                Enter the <em>code</em>
              </h2>
              <p>{GENERIC_SENT} Open the email, then choose your new password.</p>
              <PasswordCodeForm action={completeReset} ticket={ticket} />
            </>
          ) : (
            <>
              <h2>
                Reset your <em>password</em>
              </h2>
              <p>Enter your work email. A one-time code goes to that inbox; it works for ten minutes.</p>
              <ResetRequestForm />
            </>
          )}
          <div className="login-foot">
            <Link href="/admin/login/">Back to sign in</Link>
            {ticket ? <Link href="/admin/login/reset/">Ask for a new code</Link> : null}
          </div>
        </div>
      </section>
    </div>
  );
}
