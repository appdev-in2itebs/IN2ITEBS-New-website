import type { ReactNode } from "react";

/**
 * The page builder's full-screen editor, its preview and its canvas: inside /admin (signed in,
 * noindex) but without the portal's sidebar, so the page being built gets the whole window.
 */
export default function BuilderLayout({ children }: { children: ReactNode }) {
  return children;
}
