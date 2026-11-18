import type { MetadataRoute } from "next";
import { INDEXING_ENABLED, SITE_URL } from "@/lib/utils";
import { FEED_PATH } from "@/lib/capability-feed";

/**
 * ── WHY THIS FILE IS NOT ONE LINE ────────────────────────────────────────────────────────────
 * It used to be. `disallow: ["/api/", "/thank-you/"]` was written to keep crawlers out of the
 * form handlers, and it worked — but `/api/capabilities/` lives under `/api/` too.
 *
 * That endpoint is the capability register and SAP's qualified packages as JSON, built
 * deliberately so a machine could read our claims without parsing a page. The handover document
 * listed it under "Public data" and called the register "machine-readable" in two more places.
 * Meanwhile it was blocked by this file, absent from the sitemap and linked from nowhere.
 *
 * A site that fails its own build over an unverifiable claim had published one, in its own
 * handover, about itself. The blanket rule is gone: every endpoint is now named, and a new one
 * has to be classified deliberately rather than inheriting a default nobody revisits.
 *
 * ── WHY THIS MATTERS MORE THAN IT USED TO ────────────────────────────────────────────────────
 * For a firm selling eighteen-month SAP programmes, the assistant drafting a buyer's long-list
 * now sits upstream of the first conversation, and it reaches for sources that commit to an
 * answer. The register is the only page in this market that says "no, we do not do that" with a
 * status against every line. Blocking the machine-readable copy of it was the most expensive
 * two-character mistake on the site.
 *
 * `tests/links.test.ts` now fails the build if this file ever disallows the feed again.
 */
export default function robots(): MetadataRoute.Robots {
  // Staging and preview: nothing is indexable, and that is the point. INDEXING_ENABLED is false
  // for every host except the production domain.
  if (!INDEXING_ENABLED) return { rules: { userAgent: "*", disallow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` };

  return {
    rules: {
      userAgent: "*",
      // `allow` is listed before `disallow` and the longest matching rule wins, so the explicit
      // allow on the feed survives alongside the paths below it.
      allow: ["/", FEED_PATH],
      disallow: [
        "/admin/", // the CMS
        "/api/lead", // form handler — POST only, nothing to index
        "/api/apply", // CV submission
        "/api/voice/", // admin voice preview
        "/api/site-config", // announcement bar state
        "/api/health", // liveness probe
        "/api/gone", // 410 handler for retired URLs
        "/thank-you/", // post-submission page, no content of its own
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
