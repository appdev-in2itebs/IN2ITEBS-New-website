import type { Region, Stat } from "./types";

/**
 * CANONICAL CORPORATE FACTS — the single source of truth for every figure on this site.
 *
 * Merged 12 November 2026 from two sources that had drifted apart: the Managing Director's
 * confirmed figures, and the Amendment Brief v5 figures applied in commits 5a570d5 / 3a47c80.
 * Where the two disagreed, the disagreement is recorded here rather than resolved silently.
 *
 * Nothing on this site, in a deck or in a proposal may cite a figure that is not in this block.
 * If a document needs a number that is not here, it comes back here to be added first.
 *
 * Reviewed every six months. Next review: May 2027.
 *
 * ── ONE FIGURE IS IN DISPUTE AND NEEDS A DECISION ────────────────────────────────────────────
 * DELIVERY CENTRES. The Managing Director confirmed eight (below). The Ghana MoF IFMIS technical
 * proposal — submitted, auditable, and in a client's hands — states four: Bengaluru, Hyderabad,
 * Delhi NCR and Bhubaneswar. The difference is almost certainly staffed delivery centres (four,
 * all in India) versus offices and entities (eight, including the overseas ones). Both numbers
 * cannot be published. A website saying eight while a submitted bid says four is the kind of
 * contradiction that loses a tender on a technicality, so this is resolved before go-live, not
 * after. The eight below are the MD's figure and stand until he says otherwise.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */
export const stats: Stat[] = [
  { value: "500+", label: "People" },
  { value: "380+", label: "SAP consultants, across eleven practices" },
  { value: "170+", label: "Engineers in development, data, cloud and quality" },
  { value: "150+", label: "Global customers" },
  { value: "30+", label: "Countries delivered in" },
  { value: "10+", label: "Years of experience" },
  { value: "8", label: "Delivery centres" },
  { value: "50+", label: "SAP clients" },
];

/**
 * Reach, not capability. These say how widely the firm has worked; they are not a claim that every
 * vertical or accelerator has a page behind it. Nine industry pages exist, because nine are the
 * ones with something to show. Kept from Amendment Brief v5 and published in the Ghana bid.
 */
export const reachStats: Stat[] = [
  { value: "14+", label: "Industry verticals" },
  { value: "12+", label: "Strategic partners" },
  { value: "10+", label: "Proprietary accelerators" },
];

/** Headline four, for the home page and the SAP hub. */
export const headlineStats: Stat[] = stats.slice(0, 4);

/**
 * Footer credential strip.
 *
 * Every entry here is a third party's statement about us, so each one has to survive being asked
 * for the certificate. Four changes, and the reasoning is kept because it will be re-litigated:
 *
 *  - "RISE with SAP" REMOVED — a product, not a partner status. We are not a RISE with SAP
 *    Validated Partner, and that status is used as a pre-qualification in Indian PSU tenders. A
 *    badge implying it risks disqualification, not embarrassment.
 *  - "CMMI" with no maturity level REMOVED, "CMMI Level 3" ADDED — a maturity model with no level
 *    is not a credential. Level 3 is stated in the submitted Ghana MoF IFMIS proposal, which is
 *    the strongest evidence we hold for it.
 *  - "ISO 9001" REMOVED — held until the certificate number, issuing body, validity dates and
 *    scope are confirmed. The accreditation page cites withdrawn editions (9001:2008,
 *    20000-1:2005), and content/awards.ts now says versions and validity are under review.
 *  - "SAP PCE Partner" KEPT — and this is the one place this file reverses commit 5a570d5, which
 *    removed it as an unstable string. It is reinstated because the Managing Director confirmed
 *    it directly in November 2026. If Alliances cannot produce it in SAP's own wording, it comes
 *    out again and the MD is told why.
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

/** The eight delivery centres. See the dispute noted at the top of this file before publishing. */
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
  /** The full registered name, with CIN, as the footer must show it. */
  legalName: "In2IT Enterprise Business Services Private Limited",
  cin: "U72900KA2016PTC147788",
  tagline: "Converged Intelligence",
  description:
    "An SAP Gold Partner with 380+ SAP consultants across eleven practices, delivering enterprise platforms, advisory and digital engineering in more than thirty countries.",
  primaryEmail: "info@in2itebs.com",
  copyrightYear: 2026,
  primaryCta: { label: "Talk to us", href: "/contact/" },
};
