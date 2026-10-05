import type { MetadataRoute } from "next";
import { sapChildren } from "@/content/nav";
import { servicePages } from "@/content/legacy-services";
import { partnerPages } from "@/content/partner-pages";
import { industries } from "@/content/industries";
import { legacyIndustries } from "@/content/legacy-industries";

import { caseStudies } from "@/content/case-studies";
import { contentUpdated } from "@/content/site";
import { SITE_URL } from "@/lib/utils";
import { getCms } from "@/lib/cms/content";
import { livePagePaths } from "@/lib/builder/store";

/** Canonical route inventory — three-pillar IA. All paths use trailing slashes. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Articles as published in /admin/content, including ones added there.
  const articles = (await getCms()).articles.filter((a) => !a.href);
  const staticPaths = [
    "/",
    // What We Do — pillars
    "/services/",
    "/what-we-do/",
    "/platform-services/",
    "/platform-services/other-enterprise-solutions/",
    "/advisory/",
    "/digital-data-ai/",
    "/digital-data-ai/application-engineering/",
    "/digital-data-ai/ai-automation/",
    "/delivery-excellence/",
    // Platform practices
    "/sap-enterprise-solutions/",
    "/salesforce/",
    "/workday/",
    "/oracle/",
    "/microsoft/",
    "/ecc-prism/",
    // Proof & company
    "/industries/",
    "/case-studies/",
    "/partners/",
    "/why-in2it-ebs/",
    "/about/",
    "/accreditation-awards/",
    "/insights/",
    "/careers/",
    "/careers/our-culture/",
    "/careers/current-openings/",
    "/about/who-we-are/",
    "/about/our-leadership/",
    "/about/customer-stories/",
    "/about/customer-stories/welspun/",
    "/careers/events-celebrations/",
    "/contact/",
    "/legal/privacy-notice/",
    "/legal/privacy-policy/",
    "/legal/disclaimer/",
  ];

  const dynamicPaths = [
    ...sapChildren.map((c) => c.href), // SAP deep-dive sub-pages
    ...servicePages.map((p) => `/services/${p.slug}/`), // the existing site's Services menu, page for page
    ...partnerPages.map((p) => `/partners/${p.slug}/`),
    ...industries.map((i) => `/industries/${i.slug}/`),
    ...legacyIndustries.map((i) => `/industries/${i.slug}/`),
    ...articles.map((p) => `/insights/${p.slug}/`),
    ...caseStudies.filter((c) => c.named).map((c) => `/case-studies/${c.slug}/`),
  ];

  // Pages published from the admin's page builder.
  const built = await livePagePaths();

  const all = Array.from(new Set([...staticPaths, ...dynamicPaths, ...built]));

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
