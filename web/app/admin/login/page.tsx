import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin/session";
import { LoginBrandPanel } from "@/components/admin/login-brand";
import { LoginForm } from "./login-form";

/**
 * The admin sign-in in the AURA language: a cinematic navy brand panel (official pale-blue logo,
 * Newsreader headline with the italic accent word, glass chips, the brand mark breathing faintly)
 * beside a white 28px card with 56px inputs and the one Accent Blue CTA. On phones the card rises
 * over the brand panel with rounded corners, like the AURA content panel over the header.
 */
export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ reset?: string }> }) {
  if (await getAdmin()) redirect("/admin/");
  const { reset } = await searchParams;
  return (
    <div className="login">
      <LoginBrandPanel />
      <section className="login-side">
        <div className="login-card aura-rise" style={{ "--i": 2 } as React.CSSProperties}>
          <Image src="/brand/in2it-ebs-navy.svg" alt="" width={150} height={36} className="h-7 w-auto" />
          <p className="aura-overline mt-6">Admin</p>
          <h2>
            Welcome <em>back</em>
          </h2>
          <p>
            {reset
              ? "Your password is changed. Sign in with the new one."
              : "Sign in with your work email to open the admin."}
          </p>
          <LoginForm />
          <div className="login-foot">
            <Link href="/admin/login/reset/">Forgot your password?</Link>
            <a href="/" target="_blank" rel="noreferrer">
              View the website
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
