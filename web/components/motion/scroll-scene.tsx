"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import "./scroll-scene.css";

/**
 * Scroll-linked choreography for the explanatory sections (the former SVG diagrams).
 *
 * The scene tracks two things on every frame the page scrolls:
 *
 *  - `--p` on the scene: how far the section has travelled into the viewport, 0 when its top is
 *    still below the fold and 1 once it has risen a comfortable distance. Rails, progress lines
 *    and anything that "draws" scrub against it as the reader scrolls down.
 *  - `--t` on every descendant with `data-sr`: that element's own reveal, 0..1, from the moment it
 *    enters the lower part of the viewport until it reaches the middle of the screen.
 *    `data-sr-delay` (0..1) holds it back a little so a row of cards arrives left to right. The CSS in scroll-scene.css turns `--t` into opacity
 *    and movement with a short transition for smoothness between frames.
 *
 * Because both values come from the scroll position rather than a timer, the motion is smooth at
 * any scroll speed and every screenful shows its own content as it arrives. Both values only ever
 * rise: once a rail has drawn or a card has landed it stays, so scrolling back up re-reads a
 * finished section instead of un-building it (owner's request, 23 November 2026). The sequence
 * plays once per page load. Under prefers-reduced-motion the stylesheet pins everything to its
 * finished state.
 */
export function ScrollScene({
  children,
  className,
  as: Tag = "div",
  style,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "figure";
  style?: CSSProperties;
} & Partial<Record<`data-${string}` | "id" | "aria-label", string | undefined>>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Until this runs, scroll-scene.css shows everything finished; from here the scroll drives it.
    root.classList.add("scene--live");
    let frame = 0;
    const items = () => Array.from(root.querySelectorAll<HTMLElement>("[data-sr]"));
    // High-water marks: the scene and each element remember the furthest they have played.
    let pMax = 0;
    const tMax = new WeakMap<HTMLElement, number>();

    const update = () => {
      frame = 0;
      const vh = window.innerHeight || 1;
      const r = root.getBoundingClientRect();
      // How much further the page can scroll. Near the foot of the page an element's top can never
      // reach the usual finishing line, so the line moves up to wherever that element will be at
      // the very bottom; otherwise the last section of a page would stay half-drawn for ever.
      const remaining = Math.max(
        0,
        document.documentElement.scrollHeight - vh - (window.scrollY || document.documentElement.scrollTop),
      );
      // Section progress: starts when the top crosses 90% of the viewport and completes once the
      // section has travelled 55% of the viewport or its own height, whichever is smaller, so a
      // rail has finished drawing while its heading is still in the upper half of the screen
      // (checked on a 768 px laptop screen, 24 November 2026). A scene may ask for a different run
      // with data-scene-travel (a fraction of the viewport): a one-sentence statement band is
      // short, but should still take a screen's scroll to read in.
      // Whatever is asked, the run is capped at 60% of the viewport: on a 768 px laptop screen a
      // longer run left the third stage of a three-stage band invisible until its heading had
      // nearly left the top of the screen.
      const asked = Number(root.dataset.sceneTravel || 0);
      const travel = Math.min(
        asked > 0 ? vh * asked : Math.max(160, Math.min(r.height, vh * 0.55)),
        vh * 0.6,
        Math.max(48, vh * 0.9 - (r.top - remaining)),
      );
      const p = Math.max(pMax, clamp((vh * 0.9 - r.top) / travel));
      pMax = p;
      root.style.setProperty("--p", p.toFixed(4));
      for (const el of items()) {
        const b = el.getBoundingClientRect();
        const delay = Number(el.dataset.srDelay || 0);
        // Each element starts to reveal as its top crosses 94% of the viewport and is fully in by
        // the time it reaches 58% of the screen, just above the middle, whatever its delay. The declared delay
        // (0..1) shifts the start down a little and the finish up a little, so a row of cards or a
        // list of bullets still arrives left to right, but nothing is ever faint or missing while
        // it sits in the middle of the reader's screen.
        const start = vh * (0.94 - 0.14 * delay);
        const end = Math.max(vh * (0.58 - 0.1 * delay), b.top - remaining);
        const t = Math.max(tMax.get(el) ?? 0, clamp((start - b.top) / Math.max(24, start - end)));
        tMax.set(el, t);
        el.style.setProperty("--t", t.toFixed(4));
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(root);
    return () => {
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <Tag ref={ref as never} className={cn("scene", className)} style={style} {...rest}>
      {children}
    </Tag>
  );
}

function clamp(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
