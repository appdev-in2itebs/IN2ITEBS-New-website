import { insightArticles } from "@/content/insights";
import { blockedInsightSlugs } from "@/content/compliance";
import { site } from "@/content/site";
import { SITE_URL } from "@/lib/utils";

export const dynamic = "force-static";

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * /insights/feed.xml — RSS 2.0 for the articles.
 *
 * ── WHY A FEED IN 2026 ───────────────────────────────────────────────────────────────────────
 * Not for readers with feed readers; there are few of those left in this market. A feed is the
 * cheapest machine-readable index of "what is new here and when", and it is read by the
 * aggregators, newsletter tools and retrieval pipelines that sit between our writing and the
 * people who might cite it. A site with six good articles and no feed is asking every one of
 * those to scrape a listing page and guess at the dates.
 *
 * ── WHAT IT WILL NOT DO ──────────────────────────────────────────────────────────────────────
 * It will not make a thin article findable. Six articles that each make an argument are the
 * asset; this is plumbing attached to them.
 *
 * ── THE GATE IT HONOURS ──────────────────────────────────────────────────────────────────────
 * `blockedInsightSlugs` applies here exactly as it applies to the listing page. A feed that
 * republishes something the compliance flags withdrew would be a withdrawal that did not happen,
 * and feeds are cached and re-syndicated in places we do not control — so this is the one
 * surface where getting it wrong is hardest to take back.
 */
export function GET() {
  const published = insightArticles
    .filter((article) => !blockedInsightSlugs.has(article.slug))
    .filter((article) => article.date)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const items = published
    .map((article) => {
      const url = `${SITE_URL}/insights/${article.slug}/`;
      return `    <item>
      <title>${escape(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${article.date}T00:00:00Z`).toUTCString()}</pubDate>
      ${article.category ? `<category>${escape(article.category)}</category>` : ""}
      <description>${escape(article.excerpt ?? "")}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.name)} — Insights</title>
    <link>${SITE_URL}/insights/</link>
    <atom:link href="${SITE_URL}/insights/feed.xml" rel="self" type="application/rss+xml" />
    <description>Points of view from our practices on SAP, SuccessFactors, AI and the technologies reshaping the enterprise.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
