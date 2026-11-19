import { capabilityFeed } from "@/lib/capability-feed";

/**
 * The capability register, as JSON, for anyone who wants to parse it rather than read it.
 *
 * See lib/capability-feed.ts for why this exists. The short version: our buyers' long-lists are
 * increasingly cut by software before a person reads anything, and assistants assemble answers
 * from what is structured rather than from what is well written.
 *
 * ── OPEN, CACHED, AND CORS-ENABLED ───────────────────────────────────────────────────────────
 * No key and no rate limit. The entire point is that somebody can check our claims without
 * asking us for anything, and an endpoint that requires a conversation with Alliances first is
 * the PDF problem again with extra steps. `Access-Control-Allow-Origin: *` so a bid team's own
 * tooling can read it from the browser.
 *
 * The content changes a handful of times a quarter, so it is cached hard at the edge with a long
 * stale-while-revalidate: a consumer polling this should never be the reason a page is slow.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(capabilityFeed(), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "noindex",
    },
  });
}
