import { site } from "@/content/site";
import { SITE_URL } from "@/lib/utils";
import {
  capabilities,
  capabilityExpires,
  capabilityOwner,
  capabilityReviewed,
  CAPABILITY_REVIEW_MAX_AGE_DAYS,
  STATUS_LABELS,
} from "@/content/capability-status";
import { qualifiedPackages, sapProfileReviewed, SAP_PROFILE_URL } from "@/content/qpps";
import { publicCorrections, correctionsReviewed, reducedCount } from "@/content/corrections";

/**
 * THE CAPABILITY FEED — the register as data, not as a page.
 *
 * ── WHY PUBLISH THIS AT ALL ──────────────────────────────────────────────────────────────────
 * Two things changed in the way our buyers find and filter firms, and we sit at the intersection
 * of both.
 *
 * 1. Discovery is moving to assistants. When somebody asks an AI "which SAP partners in India
 *    deliver meter-to-cash for utilities", the answer is assembled from what is crawlable and
 *    structured. Most firms in this market publish their capability as prose inside a PDF, which
 *    is very nearly invisible to that process.
 * 2. Tender teams increasingly parse before they read. A long-list gets cut by software, or by a
 *    junior with a spreadsheet, well before anybody reads anyone's positioning.
 *
 * ── WHY WE CAN DO IT AND MOST CANNOT ─────────────────────────────────────────────────────────
 * Publishing structured capability data is easy. Publishing *honest* structured capability data
 * requires already having the discipline — a maintained register with a status per line, a review
 * date, and a build that fails when it goes stale. We have that, so this file is a serialiser
 * over files that already exist rather than a new thing to keep up to date. A competitor would
 * have to build the discipline before they could publish the format.
 *
 * It also includes the corrections log, which is the part nobody else will copy.
 *
 * ── ONE SERIALISER, TWO CONSUMERS ────────────────────────────────────────────────────────────
 * `capabilityFeed()` is the single source for both /api/capabilities (the JSON endpoint) and the
 * JSON-LD embedded in /about/where-we-stand/. They are built from the same call on purpose: two
 * separate serialisers would disagree within a quarter, and a page whose markup and whose API
 * state different things about the same claim is worse than publishing neither.
 *
 * ── THE CONTRACT ─────────────────────────────────────────────────────────────────────────────
 * `version` is the shape of this document. Bump it on a breaking change — a removed field or a
 * changed meaning — and leave it alone for additions. Anyone parsing this should branch on it.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */

export const FEED_VERSION = 1;
export const FEED_PATH = "/api/capabilities/";

export function capabilityFeed() {
  return {
    version: FEED_VERSION,
    documentation: `${SITE_URL}/about/where-we-stand/`,
    publisher: {
      name: site.name,
      legalName: site.legalName,
      url: SITE_URL,
    },
    /**
     * Published so a consumer can tell a maintained feed from an abandoned one without having to
     * trust us about it. Every date in this document is a real review date, not a build stamp.
     */
    register: {
      url: `${SITE_URL}/about/where-we-stand/`,
      reviewed: capabilityReviewed,
      expires: capabilityExpires,
      maxAgeDays: CAPABILITY_REVIEW_MAX_AGE_DAYS,
      owner: capabilityOwner,
      note: "Every line is checked against delivery evidence. The site build fails if this register goes unchecked past `expires`, so a stale register cannot reach the live site by being forgotten.",
      statuses: Object.fromEntries(
        Object.entries(STATUS_LABELS).map(([key, v]) => [key, { label: v.label, meaning: v.meaning }]),
      ),
      capabilities: capabilities.map((c) => ({
        area: c.area,
        capability: c.capability,
        status: c.status,
        note: c.note,
      })),
    },
    /**
     * SAP's own wording, kept separate from ours in the source file and separate here. A consumer
     * that wants a vendor-verified claim should read `sapSummary`; `ours` is marketing and is
     * labelled as such.
     */
    sapQualifiedPackages: {
      source: SAP_PROFILE_URL,
      reviewed: sapProfileReviewed,
      note: "Partner-packaged solutions reviewed by SAP and listed on our SAP partner profile. `sapSummary` is SAP's wording, trimmed for length only. `ours` is ours.",
      packages: qualifiedPackages.map((p) => ({
        name: p.name,
        short: p.short,
        practice: p.practice,
        forWhom: p.forWhom,
        live: p.live ?? null,
        sapSummary: p.sapSummary,
        ours: p.ours,
      })),
    },
    corrections: {
      url: `${SITE_URL}/about/what-we-got-wrong/`,
      reviewed: correctionsReviewed,
      count: publicCorrections.length,
      reducedAClaim: reducedCount,
      note: "Claims we published on this site and then corrected or withdrew. Entries are added and never removed.",
      entries: publicCorrections.map((c) => ({
        date: c.date,
        heading: c.heading,
        published: c.published,
        correct: c.correct,
        action: c.action,
        where: c.where ?? null,
        reducedAClaim: Boolean(c.reduced),
      })),
    },
  };
}

export type CapabilityFeed = ReturnType<typeof capabilityFeed>;

/**
 * The same register as schema.org, for the crawlers that read markup rather than call endpoints.
 *
 * There is no schema.org vocabulary for "a capability we do not have", which is the single most
 * useful thing on the page. `ItemList` of `Service` with the status as an `additionalProperty` is
 * the closest honest mapping: a parser that understands nothing else still sees the name, and one
 * that looks at the property sees the status. Inventing a richer type that no consumer reads
 * would be decoration.
 */
export function capabilityJsonLd() {
  const feed = capabilityFeed();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/about/where-we-stand/#register`,
    name: "In2IT EBS capability register",
    description:
      "Every capability with one of four statuses, including the ones we do not deliver. Reviewed on a fixed cycle; the full feed is available as JSON.",
    url: feed.register.url,
    numberOfItems: feed.register.capabilities.length,
    dateModified: feed.register.reviewed,
    itemListElement: feed.register.capabilities.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: c.capability,
        category: c.area,
        description: c.note,
        provider: { "@id": `${SITE_URL}/#organization` },
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "deliveryStatus",
            value: c.status,
            description: feed.register.statuses[c.status]?.meaning,
          },
        ],
      },
    })),
  };
}
