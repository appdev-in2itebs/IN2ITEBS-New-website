"use client";

import { useEffect, useRef, useState } from "react";

/** Values render accurately in the initial HTML. Motion must never gate factual content. */
export function CountUp({
  value,
  className,
  duration = 1800,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Respect reduced motion settings
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const match = value.match(/^([^\d]*)(\d+)(.*)$/);
    if (!match) return;

    const prefix = match[1];
    const target = parseInt(match[2], 10);
    const suffix = match[3];

    let animationFrameId: number;
    let startTime: number | null = null;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          observer.disconnect();

          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentNum = Math.floor(easedProgress * target);

            if (progress < 1) {
              setDisplayValue(`${prefix}${currentNum}${suffix}`);
              animationFrameId = requestAnimationFrame(step);
            } else {
              setDisplayValue(value);
            }
          };

          animationFrameId = requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
