"use client";

import { useEffect, useState } from "react";

/**
 * A number that counts up from 0 over 600ms with an expo-out curve (AURA motion.md "Numbers").
 * Renders the final value on the server and under reduced motion, so nothing depends on it running.
 */
export function CountUp({ value, duration = 600 }: { value: number; duration?: number }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (value === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    // Wait for the tile's own entrance (and the splash, when it is playing) before counting.
    const root = document.querySelector<HTMLElement>(".aura-admin");
    const wait = root ? parseFloat(getComputedStyle(root).getPropertyValue("--splash-wait")) || 0 : 0;
    let frame = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(2, -10 * t);
      setShown(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
      else setShown(value);
    };
    setShown(0);
    const timer = window.setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, wait + 200);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);
  return <>{shown.toLocaleString("en-IN")}</>;
}
