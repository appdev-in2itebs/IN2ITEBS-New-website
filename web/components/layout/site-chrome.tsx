"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Shows the public site's chrome (splash, header, footer, chat, announcement, scroll cue) everywhere
 * except the admin portal, which has its own layout. The root layout renders once for both, so the
 * split happens here rather than by moving every public page into a route group.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
