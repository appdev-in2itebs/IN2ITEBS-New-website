import type { NavItem, PracticeSummary } from "./types";
import { servicesMenu } from "./legacy-services";

/**
 * NAVIGATION — the approved architecture, November 2026.
 *
 * Seven top-level items plus a persistent "Talk to us". Every item resolves to a real hub page.
 * None points at a dropdown only, and none points at "#".
 *
 * Three rules this file enforces:
 *  1. Service URLs are FLAT — /services/<slug>/. The pillar is a grouping in the menu and on the
 *     hub page, never a path segment, so renaming or regrouping a pillar later moves no URL.
 *  2. No count appears in a label. "Industries", never "Our nine industries".
 *  3. A page is listed here only when it exists and has proof behind it. Build the slot, not the
 *     page: a capability without evidence belongs in the credentials register, not the menu.
 */

/** The three service pillars. Categories, not vendors — each absorbs new platforms without renaming. */
export const pillars: PracticeSummary[] = [
  {
    slug: "enterprise-platforms",
    name: "Enterprise Platforms",
    tagline:
      "SAP, Salesforce and Workday — implementing, migrating, extending and running the packaged platforms that carry your core business processes.",
    href: "/services/enterprise-platforms/",
  },
  {
    slug: "advisory",
    name: "Advisory",
    tagline: "Transformation strategy, enterprise architecture, governance, risk and data protection.",
    href: "/services/advisory/",
  },
  {
    slug: "digital-data-ai",
    name: "Digital, Data & AI",
    tagline: "Engineering around and beyond the packaged core — applications, data, AI and the integration spine.",
    href: "/services/digital-data-ai/",
  },
];

/** Enterprise Platforms — nine pages. Managed Services is its own page, not a paragraph on four others. */
export const enterprisePlatformsChildren: NavItem[] = [
  { label: "SAP", href: "/services/sap/" },
  { label: "GROW Fast", href: "/services/grow-fast/" },
  { label: "ECC Prism", href: "/services/ecc-prism/" },
  { label: "RISE and S/4HANA", href: "/services/rise-s4hana/" },
  { label: "SuccessFactors", href: "/services/successfactors/" },
  { label: "Smart Meter to Cash", href: "/services/smart-meter-to-cash/" },
  { label: "Managed Services", href: "/services/managed-services/" },
  { label: "Salesforce", href: "/services/salesforce/" },
  { label: "Workday", href: "/services/workday/" },
];

/**
 * Advisory — the hub only, for now.
 *
 * Four child pages are specified in the architecture. Two of the four are genuinely sellable and
 * two are aspirational; which is which has not been settled. Publishing four pages before that is
 * decided would put unevidenced claims on the site, which is the defect this rebuild exists to
 * remove. The hub ships; the children ship when the content is settled.
 */
export const advisoryChildren: NavItem[] = [];

/** Digital, Data & AI — five pages plus the hub. */
export const digitalDataAiChildren: NavItem[] = [
  { label: "Application Engineering", href: "/services/application-engineering/" },
  { label: "The Application Estate Review", href: "/services/application-estate-review/" },
  { label: "Data Engineering and Analytics", href: "/services/data-engineering-analytics/" },
  { label: "Enterprise Data Management", href: "/services/enterprise-data-management/" },
  { label: "Applied AI", href: "/services/applied-ai/" },
];

/** The Services mega-menu, grouped by pillar. */
export const whatWeDoMenu: NavItem[] = [
  { label: "Enterprise Platforms", href: "/services/enterprise-platforms/", children: enterprisePlatformsChildren },
  { label: "Advisory", href: "/services/advisory/" },
  { label: "Digital, Data & AI", href: "/services/digital-data-ai/", children: digitalDataAiChildren },
];

/**
 * Industries — nine pages, down from fourteen.
 *
 * Every one of these has at least one named client engagement behind it, evidenced by a purchase
 * order or a signed contract. The five that were retired had navigation entries and nothing else.
 */
export const industriesMenu: NavItem[] = [
  { label: "Metals, mining and steel", href: "/industries/metals-mining-steel/" },
  { label: "Power and utilities", href: "/industries/power-utilities/" },
  { label: "Government and public sector", href: "/industries/government-public-sector/" },
  { label: "Manufacturing", href: "/industries/manufacturing/" },
  { label: "Consumer goods and distribution", href: "/industries/consumer-goods-distribution/" },
  { label: "Pharma, healthcare and life sciences", href: "/industries/pharma-healthcare-life-sciences/" },
  { label: "Technology and digital natives", href: "/industries/technology-digital-natives/" },
  { label: "Banking and financial services", href: "/industries/banking-financial-services/" },
  { label: "Real estate and infrastructure", href: "/industries/real-estate-infrastructure/" },
];

/**
 * Partners — one page, not ten.
 *
 * The old site gave each partner a page it could not fill. The Partnerships page states what tier
 * we hold, what we deliver under it and, where there is one, where we have delivered it. Partners
 * we hold no current designation from are named as absent rather than implied by a logo.
 */
export const partnersMenu: NavItem[] = [];

/** Primary navigation — seven items. "Talk to us" is rendered separately as the persistent CTA. */
export const primaryNav: NavItem[] = [
  { label: "Services", href: "/services/", children: whatWeDoMenu },
  { label: "Industries", href: "/industries/", children: industriesMenu },
  { label: "Client work", href: "/case-studies/" },
  { label: "Insights", href: "/insights/" },
  {
    label: "About",
    href: "/about/",
    children: [
      { label: "Who we are", href: "/about/who-we-are/" },
      { label: "Leadership", href: "/about/our-leadership/" },
      { label: "Credentials", href: "/about/credentials/" },
      { label: "Partnerships", href: "/about/partnerships/" },
      { label: "Where we operate", href: "/about/markets/" },
    ],
  },
  {
    label: "Careers",
    href: "/careers/",
    children: [
      { label: "Our culture", href: "/careers/our-culture/" },
      { label: "Events and celebrations", href: "/careers/events-celebrations/" },
      { label: "Current openings", href: "/careers/current-openings/" },
    ],
  },
  { label: "Contact", href: "/contact/" },
];

/** Back-compat: some components import `platformPractices` / `practices`. */
export const platformPractices: PracticeSummary[] = pillars;
export const practices = platformPractices;

/** Back-compat for components that still import the SAP deep-dive list. */
export const sapChildren: NavItem[] = enterprisePlatformsChildren;

export const footerNav = {
  company: [
    { label: "Who we are", href: "/about/who-we-are/" },
    { label: "Credentials", href: "/about/credentials/" },
    { label: "Partnerships", href: "/about/partnerships/" },
    { label: "Where we operate", href: "/about/markets/" },
    { label: "Industries", href: "/industries/" },
    { label: "Client work", href: "/case-studies/" },
    { label: "Insights", href: "/insights/" },
    { label: "Careers", href: "/careers/" },
  ],
  practices: [
    { label: "Enterprise Platforms", href: "/services/enterprise-platforms/" },
    { label: "SAP", href: "/services/sap/" },
    { label: "Managed Services", href: "/services/managed-services/" },
    { label: "Advisory", href: "/services/advisory/" },
    { label: "Digital, Data & AI", href: "/services/digital-data-ai/" },
  ],
  legal: [
    { label: "Privacy Notice", href: "/legal/privacy-notice/" },
    { label: "Privacy Policy", href: "/legal/privacy-policy/" },
    { label: "Disclaimer", href: "/legal/disclaimer/" },
  ],
};

export { servicesMenu };
