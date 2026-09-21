"use client";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { useAtTop } from "@/components/motion/use-at-top";
import { cn } from "@/lib/utils";

/**
 * The floating scroll-down cue in the bottom-right corner of every page (owner, 2026-09-21). It
 * replaced the quick-contact button there: a round glass button with a bobbing chevron that,
 * when pressed, carries the visitor to the next section and parks it right under the fixed header.
 * It hides while the footer is in view, since there is nothing further to scroll to, except while
 * it has keyboard focus so it never vanishes from under the keyboard. Over the homepage hero it
 * takes the hero's translucent white finish; everywhere else it sits on the site's glass.
 */
export function ScrollDown() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const atTop = useAtTop();
  const overHero = pathname === "/" && atTop;
  const [nearFooter, setNearFooter] = useState(false);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setNearFooter(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, [pathname]);

  const scrollDown = () => {
    const bar = document.querySelector<HTMLElement>(".site-header");
    const offset = bar?.offsetHeight ?? 0;
    // The next page block whose top is still below the header: the top-level blocks of <main>,
    // then the footer. Anything within 40px of where we are does not count, or a click could
    // stall on a block that merely overlaps the current one.
    const blocks = [
      ...Array.from(document.querySelectorAll<HTMLElement>("main > *")),
      ...Array.from(document.querySelectorAll<HTMLElement>("footer")),
    ].filter((el) => el.getClientRects().length > 0);
    const next = blocks.find((el) => el.getBoundingClientRect().top - offset > 40);
    const top = next
      ? next.getBoundingClientRect().top + window.scrollY - offset
      : window.scrollY + window.innerHeight * 0.85;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      data-scroll-down
      hidden={nearFooter && !focused}
      aria-label="Scroll down"
      onClick={scrollDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={cn(
        "group fixed bottom-5 right-5 z-30 h-12 w-12 items-center justify-center rounded-full border shadow-glass backdrop-blur-md transition-[background-color,border-color,color,transform,box-shadow] duration-300 ease-out hover:-translate-y-px hover:shadow-glass-hover motion-reduce:transition-none",
        // The display class must not override the `hidden` attribute, so it only applies while shown.
        nearFooter && !focused ? "hidden" : "inline-flex",
        overHero
          ? "border-on-brand/30 bg-on-brand/10 text-on-brand hover:bg-on-brand/20"
          : "border-glass-line/60 bg-glass/85 text-foreground hover:border-action/40 hover:text-action",
      )}
    >
      <ChevronDown size={22} aria-hidden className="scroll-down-arrow" />
    </button>
  );
}
