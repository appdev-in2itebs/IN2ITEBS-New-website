import type { IndustryMeta } from "./types";

/**
 * Nine industry pages, down from fourteen. Hero metadata only — the page bodies live in
 * content/legacy-industries.ts and must use the same slugs.
 *
 * `deckSectors` drives which client logos appear. Logos publish only where written consent covers
 * the logo specifically: name, figures and logo are three separate permissions and clients often
 * grant one and not another.
 */
export const industries: IndustryMeta[] = [
  {
    slug: "metals-mining-steel",
    name: "Metals, mining and steel",
    headline: "Where the tonnage and the ledger",
    accentWord: "have to agree",
    subhead:
      "Grade-based contract pricing, gate and weighbridge control, fleet integration and statutory levies — in production at Navratna public sector undertakings.",
    deckSectors: ["Metals & Mining", "PSUs"],
  },
  {
    slug: "power-utilities",
    name: "Power and utilities",
    headline: "Meters installed is not",
    accentWord: "revenue collected",
    subhead:
      "Meter-to-cash, contract accounting, asset management and grid capital projects — across distribution, transmission, generation and water.",
    deckSectors: ["PSUs", "Others"],
  },
  {
    slug: "government-public-sector",
    name: "Government and public sector",
    headline: "Built for the buyer who has to",
    accentWord: "show their working",
    subhead:
      "Public sector undertakings, state utilities and state-owned enterprises — delivered under open tender, national audit and statutory reporting.",
    deckSectors: ["PSUs"],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    headline: "Where the shop floor and the ledger",
    accentWord: "have to agree",
    subhead:
      "S/4HANA conversions, RISE migrations, engineering project lifecycles and plant maintenance for industrial manufacturers.",
    deckSectors: ["Automotives", "Chemicals", "Others"],
  },
  {
    slug: "consumer-goods-distribution",
    name: "Consumer goods and distribution",
    headline: "One business, and a different tax authority",
    accentWord: "in every market",
    subhead:
      "Global HR platforms, statutory e-invoicing integrations and cloud migrations across Asia and Africa for food, beverage and retail businesses.",
    deckSectors: ["Food & Beverages", "Apparel & Fashion"],
  },
  {
    slug: "pharma-healthcare-life-sciences",
    name: "Pharma, healthcare and life sciences",
    headline: "The implementation is a project.",
    accentWord: "The audit trail is forever.",
    subhead:
      "SuccessFactors and S/4HANA for pharmaceutical manufacturers, hospital groups, biotech and diagnostics — eight evidenced engagements.",
    deckSectors: ["Health & Pharma"],
  },
  {
    slug: "technology-digital-natives",
    name: "Technology and digital natives",
    headline: "A real ERP, before the spreadsheets",
    accentWord: "become the risk",
    subhead:
      "S/4HANA Cloud and SuccessFactors for internet platforms, education technology, data science and IT services businesses.",
    deckSectors: ["IT & Professional Services"],
  },
  {
    slug: "banking-financial-services",
    name: "Banking and financial services",
    headline: "Development finance, with the audit",
    accentWord: "scrutiny that comes with it",
    subhead: "A brownfield conversion to S/4HANA on RISE for a state-established development finance institution.",
    deckSectors: ["Services & BFSI"],
  },
  {
    slug: "real-estate-infrastructure",
    name: "Real estate and infrastructure",
    headline: "Workspace and property operations",
    accentWord: "on a cloud core",
    subhead: "S/4HANA Cloud implementation, managed support and licensing for flexible workspace operations.",
    deckSectors: ["Real Estate", "Infra & Housing"],
  },
];

export function getIndustry(slug: string) {
  return industries.find((industry) => industry.slug === slug);
}
