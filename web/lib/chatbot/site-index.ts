import { servicePages, type ServicePage } from "@/content/legacy-services";
import { legacyIndustries, type LegacyIndustry } from "@/content/legacy-industries";
import { partnerPages, type PartnerPage } from "@/content/partner-pages";
import { offices as shippedOffices } from "@/content/offices";
import { leadership as shippedLeadership } from "@/content/leadership";
import { caseStudies } from "@/content/case-studies";
import type { Leader, Office } from "@/content/types";
import { tokens, type SiteEntry } from "./engine";

/**
 * Everything on the site the assistant may point to, built from the same typed content modules the
 * pages render. A new service, industry or partner page is searchable as soon as it is deployed.
 */
const clip = (text: string, max = 220) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

/** A page's own words for the assistant: its introduction and what each section covers. */
const detailOf = (intro: string[], sections: { title: string; body?: string }[]) =>
  clip(
    [intro.slice(0, 2).join(" "), sections.length ? `Covers: ${sections.map((s) => s.title).join("; ")}.` : ""]
      .filter(Boolean)
      .join(" "),
    900,
  );

type Sources = {
  services: ServicePage[];
  industries: LegacyIndustry[];
  partners: PartnerPage[];
  offices: Office[];
  leadership?: Leader[];
};
const shipped: Sources = {
  services: servicePages,
  industries: legacyIndustries,
  partners: partnerPages,
  offices: shippedOffices,
  leadership: shippedLeadership,
};

/** The Managing Director has a page of their own; the rest of the team is on /about/. */
export const leaderUrl = (leader: Leader, i: number) =>
  i === 0 || /managing director/i.test(leader.title) ? "/about/our-leadership/" : "/about/#leadership";

/** "Chief Operating Officer (COO)" → ["coo"]; "Managing Director" → ["md"]. */
const titleShort = (title: string) => {
  const inBrackets = title.match(/\(([A-Z]{2,5})\)/)?.[1];
  const initials = title
    .replace(/\(.*?\)/g, "")
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .map((w) => w[0])
    .join("");
  return [...new Set([inBrackets, initials].filter((x): x is string => !!x && x.length >= 2))].map((x) =>
    x.toLowerCase(),
  );
};

/** The search index over the given content: the shipped text by default, the edited text when passed. */
export function siteIndex(sources: Sources = shipped): SiteEntry[] {
  const { services, industries, partners, offices, leadership = shippedLeadership } = sources;
  const entries: SiteEntry[] = [];
  for (const page of services)
    entries.push({
      title: page.name,
      summary: clip(page.metaDescription || page.intro[0] || ""),
      url: `/services/${page.slug}/`,
      detail: detailOf(page.intro, page.sections),
      keywords: [...tokens(page.slug.replace(/-/g, " ")), ...page.sections.flatMap((s) => tokens(s.title))],
    });
  for (const industry of industries)
    entries.push({
      title: industry.name,
      summary: clip(industry.metaDescription || industry.intro[0] || ""),
      url: `/industries/${industry.slug}/`,
      detail: detailOf(industry.intro, industry.sections),
      keywords: [...tokens(industry.slug.replace(/-/g, " ")), "industry", "sector"],
    });
  for (const partner of partners)
    entries.push({
      title: `${partner.name} partnership`,
      summary: clip(partner.intro[0] || ""),
      url: `/partners/${partner.slug}/`,
      detail: detailOf(partner.intro, partner.sections ?? []),
      keywords: [...tokens(partner.name), "partner", "partnership"],
    });
  entries.push({
    title: "Contact and offices",
    summary: `Offices in ${[...new Set(offices.map((o) => `${o.city} (${o.country})`))].join(", ")}.`,
    url: "/contact/",
    keywords: [
      ...offices.flatMap((o) => [...tokens(o.city), ...tokens(o.country)]),
      ...tokens("global footprint presence locations countries office address"),
    ],
  });
  // Each leader, by the name and title shown on the website (never anything more personal). They come
  // before the team entry so "who is the COO" finds the person first.
  for (const [i, leader] of leadership.entries())
    entries.push({
      title: leader.name,
      summary: clip(`${leader.title}. ${leader.bio}`),
      url: leaderUrl(leader, i),
      keywords: [...tokens(leader.name), "leadership"],
      aliases: [...tokens(leader.title.replace(/\(.*?\)/g, "")), ...titleShort(leader.title)],
    });
  // Named case studies have a page of their own (the anonymised ones are only on /case-studies/).
  for (const c of caseStudies.filter((s) => s.named))
    entries.push({
      title: c.client,
      summary: clip(c.summary ?? c.outcome ?? c.scenario),
      url: `/case-studies/${c.slug}/`,
      keywords: [...tokens(c.client), ...tokens(c.industry), ...tokens(c.featuredSolution), "case", "study", "project"],
    });
  entries.push({
    title: "Leadership team",
    summary: clip(leadership.map((l) => `${l.name}, ${l.title}`).join("; ")),
    url: "/about/#leadership",
    keywords: tokens("leadership team management leaders founder director officer"),
  });
  return entries;
}
