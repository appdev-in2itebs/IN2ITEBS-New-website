import Image from "next/image";
import { Bot, ShieldCheck, Users } from "lucide-react";

/**
 * The navy brand panel beside the sign-in and reset cards: official pale-blue logo, Newsreader
 * headline with the italic accent word, glass chips, the brand mark breathing faintly.
 */
export function LoginBrandPanel() {
  const year = new Date().getFullYear();
  return (
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
  );
}
