import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "Admin · In2IT EBS" },
  robots: { index: false, follow: false },
};

/** /admin is never indexed and never cached: every request reads the signed-in session. */
export const dynamic = "force-dynamic";

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-svh bg-canvas text-foreground">{children}</div>;
}
