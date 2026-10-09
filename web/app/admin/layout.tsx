import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./admin.css";

export const metadata: Metadata = {
  title: { absolute: "Admin · In2IT EBS" },
  robots: { index: false, follow: false },
};

/** /admin is never indexed and never cached: every request reads the signed-in session. */
export const dynamic = "force-dynamic";

/**
 * Everything under /admin (login, portal, page builder) is designed in the AURA Premium UI language
 * locked to the In2IT EBS brand: the tokens and component styles live in admin.css and apply only
 * inside `.aura-admin`, so the public site is untouched.
 */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="aura-admin min-h-svh">{children}</div>;
}
