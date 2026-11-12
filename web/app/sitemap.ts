import type { MetadataRoute } from "next";
import { servicePages } from "@/content/legacy-services";
import { industries } from "@/content/industries";
import { legacyIndustries } from "@/content/legacy-industries";

import { publicCaseStudies } from "@/content/case-studies";
import { contentUpdated } from "@/content/site";
import { SITE_URL } from "@/lib/utils";
import { getCms } from "@/lib/cms/content";
import { livePagePaths } from "@/lib/builder/store";
import { getOpenOpenings } from "@/lib/cms/store";

/**
 * Canonical route inventory. All paths use trailing slashes.
 *
 * Rule: a sitemap lists pages that return 200, never ones that redirect. Every path retired in the
 * November 2026 restructure was removed from this list on the same day its route folder was
 * deleted, and lives on only in content/redirects.mjs. If you delete a route, delete it here too.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Articles as published in /admin/content, including ones added there.
  const articles = (await getCms()).articles.filter((a) => !a.href);
  const staticPaths = [
    "/",
    // What we do
    "/services/",
    "/services/how-we-price/",
    // Proof
    "/industries/",
    "/case-studies/",
    "/insights/",
    // Company
    "/about/",
    "/about/who-we-are/",
    "/about/our-leadership/",
    "/about/credentials/",
    "/about/partnerships/",
    "/about/markets/",
    "/about/where-we-stand/",
    // Careers
    "/careers/",
    "/careers/our-culture/",
    "/careers/current-openings/",
    "/careers/events-celebrations/",
    // Contact and legal
    "/contact/",
    "/legal/privacy-notice/",
    "/legal/privacy-policy/",
    "/legal/disclaimer/",
  ];

  const dynamicPaths = [
    ...servicePages.map((p) => `/services/${p.slug}/`), // every service page, pillar hubs included
    ...industries.map((i) => `/industries/${i.slug}/`),
    ...legacyIndustries.map((i) => `/industries/${i.slug}/`),
    ...articles.map((p) => `/insights/${p.slug}/`),
    ...publicCaseStudies.filter((c) => c.named).map((c) => `/case-studies/${c.slug}/`),
  ];

  // Pages published from the admin's page builder.
  const built = await livePagePaths();
  // Every open job post (written in /admin/openings).
  const jobs = (await getOpenOpenings().catch(() => [])).map((o) => `/careers/current-openings/${o.id}/`);

  const all = Array.from(new Set([...staticPaths, ...dynamicPaths, ...built, ...jobs]));

  const dateFor = (path: string) => {
    const slug = path.match(/^\/insights\/([^/]+)\/$/)?.[1];
    const articleDate = slug ? (articles.find((i) => i.slug === slug)?.date ?? "") : "";
    return new Date(articleDate || contentUpdated);
  };

  return all.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: dateFor(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
