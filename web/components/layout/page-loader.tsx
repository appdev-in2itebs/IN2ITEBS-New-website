"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/** Fired on `window` when the splash starts to fade, so entrance animations can begin with it. */
export const SPLASH_DONE = "in2it:splash-done";

export function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Initial company logo loading splash screen
    const timer = setTimeout(() => {
      setFadeOut(true);
      // The splash sits over the hero for its whole first second, which is exactly how long the
      // hero's entrance takes: left to itself, the copy finished converging behind this panel and
      // a first-time visitor never saw it. Announcing the fade lets the hero start with it, so the
      // copy arrives as the splash clears. Both the flag and the event are published: a component
      // mounting after this point reads the flag, one already mounted hears the event.
      document.documentElement.dataset.splash = "done";
      window.dispatchEvent(new Event(SPLASH_DONE));
      const removeTimer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(removeTimer);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-canvas transition-opacity duration-500 ease-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center gap-6">
        {/* Company Logo */}
        <Image
          src="/brand/in2it-ebs-navy.svg"
          alt="In2IT EBS — Converged Intelligence"
          width={280}
          height={68}
          priority
          className="h-12 w-auto md:h-14 animate-pulse"
        />

        {/* Loading Bar */}
        <div className="h-1 w-44 overflow-hidden rounded-full bg-border-subtle">
          <div className="h-full w-full bg-action animate-[pulse_1s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
