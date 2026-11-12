import type { Region, Stat } from "./types";

/**
 * CANONICAL CORPORATE FACTS — the single source of truth for every figure on this site.
 *
 * Confirmed by the Managing Director, November 2026. Nothing on this site, in a deck or in a
 * proposal may cite a figure that is not in this block. If a document needs a number that is not
 * here, it comes back here to be added first.
 *
 * Reviewed every six months. Next review: May 2027.
 */
export const stats: Stat[] = [
  { value: "500+", label: "People" },
  { value: "380+", label: "SAP consultants, across eleven practices" },
  { value: "170+", label: "Engineers in development, data, cloud and quality" },
  { value: "150+", label: "Global customers" },
  { value: "30+", label: "Countries delivered in" },
  { value: "8", label: "Delivery centres" },
  { value: "9", label: "Years in operation" },
  { value: "50+", label: "SAP clients" },
];

/** Headline four, for the home page and the SAP hub. */
export const headlineStats: Stat[] = stats.slice(0, 4);

/**
 * Footer credential strip.
 *
 * Deliberately shorter than it was. Three claims were removed on 10 November 2026:
 *  - "RISE with SAP" — a product, not a partner status. We are not a RISE with SAP Validated
 *    Partner, and that status is used as a pre-qualification in Indian PSU tenders. A badge
 *    implying it risks disqualification, not embarrassment.
 *  - "CMMI" with no maturity level — not a credential. Restored as "CMMI Level 3".
 *  - "ISO 9001" — held until the certificate number, issuing body, validity dates and scope are
 *    confirmed. The accreditation page currently cites withdrawn editions.
 */
export const footerCertifications = ["CMMI Level 3", "ISO 27001", "SAP Gold Partner", "SAP PCE Partner"];

/** Bump when site copy changes; feeds sitemap lastModified for pages without their own date. */
export const contentUpdated = "2026-11-12";

/** Headquarters and registered office. Confirmed November 2026: Bengaluru, not Noida or Bhubaneswar. */
export const headquarters = {
  city: "Bengaluru",
  country: "India",
  legalName: "In2IT Enterprise Business Services Private Limited",
};

/** The eight staffed delivery centres. A city is listed here only if you can visit it. */
export const deliveryCentres = [
  "Bengaluru",
  "Delhi",
  "Bhubaneswar",
  "Hyderabad",
  "Singapore",
  "Dubai",
  "Nairobi",
  "Johannesburg",
];

/** The five legal entities. */
export const legalEntities = [
  { country: "India", name: "In2IT Enterprise Business Services Pvt Ltd" },
  { country: "South Africa", name: "In2IT Enterprise Business Services (Pty) Ltd" },
  { country: "Singapore", name: "In2IT Enterprise Business Services Pte Ltd" },
  { country: "United Arab Emirates", name: "In2IT EB Solutions L.L.C." },
  { country: "Kenya", name: "In2IT Enterprise Business Services Kenya Limited" },
];

export const regions: Region[] = [
  { code: "IN", name: "India", email: "info@in2itebs.com" },
  { code: "KE", name: "Kenya", email: "info@in2itebs.co.ke" },
  { code: "ZA", name: "South Africa", email: "info@in2itebs.co.za" },
  { code: "ME", name: "Middle East", email: "info@in2itebs.ae" },
];

export const social = {
  linkedin: "https://www.linkedin.com/company/in2itebs/",
  x: "https://twitter.com/in2itebs_",
  youtube: "https://www.youtube.com/channel/UCdUFIRwrZMoq4oUvPt3KuPQ",
  instagram: "https://www.instagram.com/in2itebs/",
};

export const site = {
  name: "In2IT EBS",
  legalName: "In2IT Enterprise Business Services",
  tagline: "Converged Intelligence",
  description:
    "An SAP Gold Partner with 380+ SAP consultants across eleven practices, delivering enterprise platforms, advisory and digital engineering in more than thirty countries.",
  primaryEmail: "info@in2itebs.com",
  copyrightYear: 2026,
  primaryCta: { label: "Talk to us", href: "/contact/" },
};
