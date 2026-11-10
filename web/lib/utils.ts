import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["display", "h1", "h2", "h3"] }] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const configuredSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.in2itebs.com").replace(/\/$/, "");

/**
 * The Azure VM was left with SITE_ENV=preview after DNS cut over to the public domain. A deployed
 * Next production server is therefore treated as public unless it is running inside CI. Explicit
 * production remains supported; development and CI preview builds stay non-indexable.
 */
export const INDEXING_ENABLED =
  process.env.SITE_ENV === "production" || (process.env.NODE_ENV === "production" && process.env.CI !== "true");

/** Public releases always use the approved host; previews may use their own origin. */
export const SITE_URL = INDEXING_ENABLED ? "https://www.in2itebs.com" : configuredSiteUrl;
