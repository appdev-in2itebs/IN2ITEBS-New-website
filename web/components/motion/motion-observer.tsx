"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Drives scroll-in reveals and owns the motion flags on every page: `data-motion-paused` follows
 *  `prefers-reduced-motion` and hidden tabs (the hero's visible pause control, the only other owner,
 *  went on 2026-09-15), and decorative loops such as the client ribbon pause while offscreen through
 *  `data-motion-offscreen`. Anything already inside the viewport is marked "in" synchronously so
 *  above-the-fold content never flashes from visible to hidden after hydration. */
export function MotionObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const flags = () => {
      root.dataset.motionReady = "true";
      root.dataset.motionPaused = String(reduced.matches || document.hidden);
    };
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const viewport = window.innerHeight;
    // Read every box first, then write: interleaving `getBoundingClientRect` with a `dataset`
    // write forces a layout per element instead of one for the batch.
    const onscreen = targets.map((el) => {
      const box = el.getBoundingClientRect();
      return box.top < viewport && box.bottom > 0;
    });
    targets.forEach((el, i) => {
      if (onscreen[i]) el.dataset.reveal = "in";
    });
    flags();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          // `data-reveal-repeat` keeps a reveal under observation and resets it on the way out, so
          // the copy over the video sections plays its entrance every time you come back to them
          // rather than once per page load. Everything else still reveals once and is dropped.
          const repeats = el.dataset.revealRepeat !== undefined;
          if (entry.isIntersecting) {
            el.dataset.reveal = "in";
            if (!repeats) observer.unobserve(el);
          } else if (repeats) {
            delete el.dataset.reveal;
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const el of targets)
      if (el.dataset.reveal !== "in" || el.dataset.revealRepeat !== undefined) observer.observe(el);
    // Decorative loops keep animating only while on screen (`[data-motion-offscreen="true"]` pauses
    // them in globals.css).
    const loops = Array.from(document.querySelectorAll<HTMLElement>(".client-ribbon"));
    const offscreen = new IntersectionObserver((entries) => {
      for (const entry of entries)
        (entry.target as HTMLElement).dataset.motionOffscreen = String(!entry.isIntersecting);
    });
    for (const el of loops) offscreen.observe(el);
    const safety = window.setTimeout(() => {
      const height = window.innerHeight;
      const visible = targets.map((el) => {
        const box = el.getBoundingClientRect();
        return box.top < height && box.bottom > 0;
      });
      targets.forEach((el, i) => {
        if (visible[i]) el.dataset.reveal = "in";
      });
    }, 1000);
    reduced.addEventListener("change", flags);
    document.addEventListener("visibilitychange", flags);
    return () => {
      observer.disconnect();
      offscreen.disconnect();
      for (const el of loops) delete el.dataset.motionOffscreen;
      window.clearTimeout(safety);
      reduced.removeEventListener("change", flags);
      document.removeEventListener("visibilitychange", flags);
      delete root.dataset.motionReady;
      delete root.dataset.motionPaused;
    };
  }, [pathname]);
  return null;
}
