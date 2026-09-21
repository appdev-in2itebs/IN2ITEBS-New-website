"use client";
import { useEffect, useState } from "react";

/** The header's own threshold: it is "at the top" until the page has scrolled past 20px. */
const AT_TOP = 20;

/**
 * True while the window is scrolled to (or within 20px of) the top, updated on every scroll. The
 * floating scroll-down button restyles on this over the homepage hero, so it uses the same edge
 * the header slides in on. Starts `true`, which is the server-rendered state.
 */
export function useAtTop() {
  const [atTop, setAtTop] = useState(true);
  useEffect(() => {
    const update = () => setAtTop(window.scrollY <= AT_TOP);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return atTop;
}
