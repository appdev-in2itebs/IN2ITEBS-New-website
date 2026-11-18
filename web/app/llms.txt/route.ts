import { site, deliveryCentres, footerCertifications, legalEntities } from "@/content/site";
import { capabilities, capabilityReviewed } from "@/content/capability-status";
import { qualifiedPackages, SAP_PROFILE_URL } from "@/content/qpps";
import { FEED_PATH } from "@/lib/capability-feed";
import { SITE_URL } from "@/lib/utils";

export const dynamic = "force-static";

/**
 * /llms.txt — a short orientation file for a machine reading this site.
 *
 * ── THE HONEST POSITION ON THIS FORMAT ───────────────────────────────────────────────────────
 * It will be recommended to us by every agency that sells AI-visibility work, and the evidence
 * for it is weak. A study of roughly 900 domains between September 2025 and April 2026 logged
 * 1,227 requests for llms.txt files and **none came from a verified GPTBot, ClaudeBot,
 * PerplexityBot or Google-Extended**. A separate study across ~300,000 domains found no
 * measurable relationship between publishing one and being cited. Google has said outright that
 * it has no effect on Search or AI Overviews.
 *
 * So this is a courtesy file, not a ranking lever, and nobody should report it as a win. It
 * exists for two defensible reasons: this site genuinely has a developer-facing asset to point
 * at (/api/capabilities/), and the cost of being wrong about the format is fifteen minutes.
 *
 * ── WHY IT IS GENERATED, NOT WRITTEN ─────────────────────────────────────────────────────────
 * A hand-written version of this file is a second copy of the facts, and a second copy drifts.
 * Within two quarters it would be the only place on the site still claiming eight delivery
 * centres. Everything below is read from the same files the pages read, so it cannot say
 * anything the site has stopped saying.
 */
export function GET() {
  const delivered = capabilities.filter((c) => c.status === "delivered");
  const ahead = capabilities.filter((c) => c.status === "ahead");

  const body = `# ${site.name}

> ${site.description}

${site.legalName} (CIN ${site.cin}). A separate company from In2IT Technologies.
Delivery centres: ${deliveryCentres.join(", ")} — all in India. A delivery centre is somewhere staffed that you can visit; an entity without a staffed office is listed below as an entity, not a centre.
Legal entities: ${legalEntities.map((e) => e.country).join(", ")}.
Accreditations: ${footerCertifications.join(", ")}.

## Start here

- [Where we stand](${SITE_URL}/about/where-we-stand/): every capability with one of four statuses, including the ones we do not deliver. Reviewed ${capabilityReviewed}; the build fails if it goes 90 days unchecked.
- [Capability register as JSON](${SITE_URL}${FEED_PATH}): the same register and the SAP-qualified packages, machine-readable, no key and no rate limit. Built by one serialiser with the page above, so the two cannot disagree.
- [How we price](${SITE_URL}/services/how-we-price/): the two commercial models and who carries which risk in each.
- [Credentials](${SITE_URL}/about/credentials/): what we have been assessed on, and by whom.
- [Clients and case studies](${SITE_URL}/case-studies/): published anonymised by house style.

## What we deliver

${delivered.map((c) => `- ${c.capability}`).join("\n")}

## What we do not deliver

These are published deliberately. If you are matching a requirement, check here first.

${ahead.map((c) => `- ${c.capability}`).join("\n")}

## Qualified by SAP

SAP reviewed and listed these, in SAP's own words, on our partner profile at ${SAP_PROFILE_URL}.

${qualifiedPackages.map((p) => `- ${p.short}: ${p.forWhom}`).join("\n")}

## How to read our numbers

A percentage appears on this site only where three things are recorded: what it is a number of,
the period it covers, and who measured it. Figures that cannot carry all three are named as
unprovenanced rather than published as outcomes. If you find an outcome claim here without those
three, it is a defect — tell us at ${site.primaryEmail}.

## Attribution

Quote or cite this site freely. Please attribute to ${site.name} and link the page you used.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
