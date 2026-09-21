"use client";

import { useCallback, useEffect, useRef, useState, type FocusEvent, type RefObject } from "react";

/** How long a track holds still after someone has dragged or swiped it themselves. */
const HOLD_AFTER_INPUT = 5000;

/**
 * Whether a section's own animation should be running right now.
 *
 * It runs as soon as the section is on screen. It is deliberately *not* gated on hover, which is
 * what used to make the leadership ribbon and the quote row look frozen: a reader's pointer is
 * almost always sitting inside the section they are reading, so pause-on-hover meant the motion
 * only ever happened once they had moved away from it — you could not watch the thing you had
 * just scrolled to. The page-wide pause control (`html[data-motion-paused]`, checked by each
 * caller on the tick) is the deliberate stop, and `prefers-reduced-motion` stops it for good.
 *
 * Two cases still hold the motion, because moving content out from under someone there is simply
 * wrong: the keyboard is inside the section, and they have just moved the track by hand. Spread
 * `sectionProps` onto the section for the first; call `bump()` from the track's own pointer, touch
 * and key handlers for the second.
 */
export function useAutoplay(root: RefObject<HTMLElement | null>) {
  const [allowed, setAllowed] = useState(false);
  const [onscreen, setOnscreen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const idle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setAllowed(!reduced.matches);
    apply();
    reduced.addEventListener("change", apply);

    const element = root.current;
    const observer = new IntersectionObserver(([entry]) => setOnscreen(entry.isIntersecting));
    if (element) observer.observe(element);

    return () => {
      reduced.removeEventListener("change", apply);
      observer.disconnect();
    };
  }, [root]);

  useEffect(() => () => clearTimeout(idle.current), []);

  const bump = useCallback(() => {
    setTouched(true);
    clearTimeout(idle.current);
    idle.current = setTimeout(() => setTouched(false), HOLD_AFTER_INPUT);
  }, []);

  return {
    running: allowed && onscreen && !focused && !touched,
    bump,
    sectionProps: {
      onFocusCapture: () => setFocused(true),
      onBlurCapture: (event: FocusEvent<HTMLElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false);
      },
    },
  };
}
