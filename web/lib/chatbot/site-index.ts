import { servicePages, type ServicePage } from "@/content/legacy-services";
import { legacyIndustries, type LegacyIndustry } from "@/content/legacy-industries";
import { partnerPages, type PartnerPage } from "@/content/partner-pages";
import { offices as shippedOffices } from "@/content/offices";
import type { Office } from "@/content/types";
import { tokens, type SiteEntry } from "./engine";

/**
 * Everything on the site the assistant may point to, built from the same typed content modules the
 * pages render. A new service, industry or partner page is searchable as soon as it is deployed.
 */
const clip = (text: string, max = 220) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

type Sources = { services: ServicePage[]; industries: LegacyIndustry[]; partners: PartnerPage[]; offices: Office[] };
const shipped: Sources = {
  services: servicePages,
  industries: legacyIndustries,
  partners: partnerPages,
  offices: shippedOffices,
};

/** The search index over the given content: the shipped text by default, the edited text when passed. */
export function siteIndex(sources: Sources = shipped): SiteEntry[] {
  const { services, industries, partners, offices } = sources;
  const entries: SiteEntry[] = [];
  for (const page of services)
    entries.push({
      title: page.name,
      summary: clip(page.metaDescription || page.intro[0] || ""),
      url: `/services/${page.slug}/`,
      keywords: [...tokens(page.slug.replace(/-/g, " ")), ...page.sections.flatMap((s) => tokens(s.title))],
    });
  for (const industry of industries)
    entries.push({
      title: industry.name,
      summary: clip(industry.metaDescription || industry.intro[0] || ""),
      url: `/industries/${industry.slug}/`,
      keywords: [...tokens(industry.slug.replace(/-/g, " ")), "industry", "sector"],
    });
  for (const partner of partners)
    entries.push({
      title: `${partner.name} partnership`,
      summary: clip(partner.intro[0] || ""),
      url: `/partners/${partner.slug}/`,
      keywords: [...tokens(partner.name), "partner", "partnership"],
    });
  entries.push({
    title: "Contact and offices",
    summary: `Offices in ${[...new Set(offices.map((o) => o.city))].join(", ")}.`,
    url: "/contact/",
    keywords: offices.flatMap((o) => [...tokens(o.city), ...tokens(o.country)]),
  });
  return entries;
}
