import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin/session";
import { ownerEmail, GENERIC_SENT } from "@/lib/admin/password";
import { LoginBrandPanel } from "@/components/admin/login-brand";
import { PasswordCodeForm } from "@/components/admin/password-code-form";
import { ResetRequestForm } from "./reset-request-form";
import { completeReset } from "./actions";

/**
 * Forgot password, in two steps on one address: first the email, then (with ?ticket=) the one-time
 * code and the new password. The code goes to the website owner, not to the person asking, so a
 * stolen mailbox is not enough to take over an admin login.
 */
export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ ticket?: string }> }) {
  if (await getAdmin()) redirect("/admin/account/");
  const { ticket } = await searchParams;
  const owner = ownerEmail();
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
              <p>{GENERIC_SENT} Ask them for the six digits, then choose your new password.</p>
              <PasswordCodeForm action={completeReset} ticket={ticket} />
            </>
          ) : (
            <>
              <h2>
                Reset your <em>password</em>
              </h2>
              <p>
                Enter your work email. A one-time code goes to the website owner
                {owner ? ` (${owner})` : ""}, who will pass it to you.
              </p>
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
