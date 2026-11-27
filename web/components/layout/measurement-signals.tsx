"use client";
import { useEffect } from "react";
import { signalMeasurement } from "@/lib/measurement";
export function MeasurementSignals() {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      const link = (event.target as Element).closest?.("a");
      if (!link) return;
      const target = new URL(link.href, location.origin);
      if (target.origin !== location.origin) return;
      if (target.pathname === "/contact/") signalMeasurement("contact_click");
      // A click into any service page is a practice click. The list used to be the five platform
      // practice URLs; after the November 2026 restructure every service lives under /services/,
      // so the prefix is the signal and a new service page needs no change here.
      else if (/^\/services\/[^/]+\/$/.test(target.pathname)) signalMeasurement("practice_click");
    };
    document.addEventListener("click", listener);
    return () => document.removeEventListener("click", listener);
  }, []);
  return null;
}
