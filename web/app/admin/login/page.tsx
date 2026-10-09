import Image from "next/image";
import { redirect } from "next/navigation";
import { Bot, ShieldCheck, Users } from "lucide-react";
import { getAdmin } from "@/lib/admin/session";
import { LoginForm } from "./login-form";

/**
 * The admin sign-in in the AURA language: a cinematic navy brand panel (official pale-blue logo,
 * Newsreader headline with the italic accent word, glass chips, the brand mark breathing faintly)
 * beside a white 28px card with 56px inputs and the one Accent Blue CTA. On phones the card rises
 * over the brand panel with rounded corners, like the AURA content panel over the header.
 */
export default async function AdminLoginPage() {
  if (await getAdmin()) redirect("/admin/");
  const year = new Date().getFullYear();
  return (
    <div className="login">
      <section className="login-brand" aria-label="In2IT EBS">
        <div className="login-mark" aria-hidden>
          <i />
          <i />
          <i />
          <i />
        </div>
        <div>
          <Image
            src="/brand/in2it-ebs-logo-pale.png"
            alt="In2IT EBS"
            width={1364}
            height={425}
            priority
            className="aura-rise"
          />
          <h1 className="aura-rise" style={{ "--i": 1 } as React.CSSProperties}>
            Converged <em>Intelligence</em>, one desk.
          </h1>
          <p className="aura-rise" style={{ "--i": 2 } as React.CSSProperties}>
            Leads, applications, conversations and the website itself: everything that comes in through in2itebs.com, in
            one signed-in place.
          </p>
          <div className="login-chips aura-rise" style={{ "--i": 3 } as React.CSSProperties}>
            <span>
              <Users aria-hidden /> Leads and applications
            </span>
            <span>
              <Bot aria-hidden /> AI assistant and chats
            </span>
            <span>
              <ShieldCheck aria-hidden /> Role-based access
            </span>
          </div>
        </div>
        <div className="login-legal aura-rise" style={{ "--i": 4 } as React.CSSProperties}>
          <span>In2IT EBS | Converged Intelligence</span>
          <span>Confidential · {year}</span>
        </div>
      </section>

      <section className="login-side">
        <div className="login-card aura-rise" style={{ "--i": 2 } as React.CSSProperties}>
          <Image src="/brand/in2it-ebs-navy.svg" alt="" width={150} height={36} className="h-7 w-auto" />
          <p className="aura-overline mt-6">Admin</p>
          <h2>
            Welcome <em>back</em>
          </h2>
          <p>Sign in with your work email to open the admin.</p>
          <LoginForm />
          <div className="login-foot">
            <span>Forgot your password? Ask an administrator.</span>
            <a href="/" target="_blank" rel="noreferrer">
              View the website
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
