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
 * ── WHY THESE ARE ALL "+" NUMBERS, AND WHY NONE OF THEM SAYS "CERTIFIED" ─────────────────────
 * Headcount changes every month, so a precise figure on a website is wrong within weeks. A floor
 * claim is not: "380+" only becomes false if the number falls below 380, which it will not. That
 * is the whole reason this block is written the way it is, and it is why the figures can survive
 * between reviews.
 *
 * What a floor claim cannot survive is a word that makes it auditable. "500+ people" is provable
 * from payroll. "500+ certified consultants" is a different claim: somebody in a tender can ask
 * for the certificate register, and the register has to contain five hundred certificates. We do
 * not publish that word anywhere, and our SAP partner profile should not either.
 *
 * Reviewed every six months, and `statsReviewed` below is a build gate rather than a reminder —
 * scripts/check-build.mjs fails a production build when it goes stale, so these cannot rot by
 * being forgotten.
 *
 * DELIVERY CENTRES: FOUR. Settled by the Managing Director on 12 November 2026, matching the
 * submitted Ghana MoF IFMIS proposal. A delivery centre is a staffed centre you can visit, and all
 * four are in India. Singapore, Dubai, Nairobi and Johannesburg are offices and legal entities —
 * they are listed as entities, below, and must never be counted as delivery centres. The website
 * and a bid in a client's hands now say the same number.
 */
export const stats: Stat[] = [
  { value: "500+", label: "People" },
  { value: "380+", label: "SAP consultants, across eleven practices" },
  { value: "170+", label: "Engineers in development, data, cloud and quality" },
  { value: "150+", label: "Global customers" },
  { value: "30+", label: "Countries delivered in" },
  // "10+ Years of experience" was removed on 18 November 2026. It had said 10+ for several years,
  // which means it was either stale or understating, and nobody was ever going to remember to
  // move it. A figure that ages on its own does not belong in a block reviewed twice a year.
  { value: "4", label: "Delivery centres in India" },
  { value: "50+", label: "SAP clients" },
];

/**
 * Reach, not capability. These say how widely the firm has worked; they are not a claim that every
 * group or accelerator has a page behind it.
 *
 * Nothing on the website renders this block — it exists for decks and bids, which is exactly why
 * it matters that it agrees with the site. A figure that appears only in a proposal is the one
 * nobody checks.
 */
export const reachStats: Stat[] = [
  // Was "14+ Industry verticals", which matched neither of the two places that define them: the
  // master data standard has nine industry groups across thirty verticals, and this site has nine
  // industry pages. Nine is the number both of those agree on.
  { value: "9", label: "Industry groups we publish pages for" },
  { value: "12+", label: "Strategic partners" },
  { value: "10+", label: "Proprietary accelerators" },
];

/** Headline four, for the home page and the SAP hub. */
export const headlineStats: Stat[] = stats.slice(0, 4);

/**
 * The date a person last checked every figure above against the source it comes from.
 *
 * This is a gate, not a note. `scripts/check-build.mjs` fails a production build once it is older
 * than STATS_REVIEW_MAX_AGE_DAYS, so a stale number cannot reach the live site by being
 * forgotten — only by somebody editing this date without doing the check, which is a different
 * and much more visible kind of failure.
 *
 * Six months rather than three: these are floor claims, and a floor claim does not drift the way
 * a precise one does.
 */
export const statsReviewed = "2026-11-18";
export const STATS_REVIEW_MAX_AGE_DAYS = 200;

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
 *  - "ISO 9001" KEPT — confirmed by the Managing Director on 12 November 2026 alongside CMMI
 *    Level 3 and ISO/IEC 27001. THE CERTIFICATION IS REAL; WHAT WAS WRONG WAS THE EDITION. The
 *    legacy accreditation page cited ISO 9001:2008 and ISO/IEC 20000-1:2005, both withdrawn, and
 *    "ISO/IEC 27000:2005", which is the vocabulary document and not certifiable at all. So the
 *    standard is named here without a year, and no edition number is published anywhere on this
 *    site until the certificate itself is in hand. Naming a withdrawn edition is worse than
 *    naming none: it tells an auditor we have not looked at our own certificate since 2008.
 *  - "SAP PCE Partner" REMOVED — commit 5a570d5 took it out as an undefined, unstable string, and
 *    the Managing Director confirmed that removal on 12 November 2026. It returns only if
 *    Alliances produces it in SAP's own wording, with a date.
 */
/**
 * ── THE GAP THE REVIEW DATES DO NOT COVER ────────────────────────────────────────────────────
 * Every credential on this list expires. CMMI appraisals are valid three years. ISO 9001 and
 * ISO/IEC 27001 run three-year certification cycles with annual surveillance audits, and a failed
 * surveillance can suspend a certificate between cycles. SAP Gold Partner renews annually against
 * targets.
 *
 * **None of those dates was recorded anywhere.** The site would go on publishing a lapsed
 * certificate indefinitely and nothing would stop it — the 200-day corporate-facts review might
 * catch it eventually, by accident, months late. Meanwhile `/about/credentials/` tells a reader
 * these are "re-assessed on a cycle", which is a claim about a date the site does not hold.
 *
 * That is exactly the failure this codebase exists to prevent, on the one page whose subject is
 * credentials.
 *
 * ── HOW IT WORKS ─────────────────────────────────────────────────────────────────────────────
 * `validUntil` comes from the certificate, not from memory. `null` means nobody has supplied it.
 *
 * While a date is missing the build **warns and counts** rather than failing — the same treatment
 * `UNPROVENANCED` figures get, because failing over information nobody has yet turns a gate into
 * an obstacle. Once a date is present it is enforced: 30 days out the build warns, and **past the
 * date the build fails**, because publishing a lapsed credential is a different class of wrong
 * from publishing an unverified one.
 *
 * To fill these in, the certificates themselves are the source. Compliance holds them and
 * `public/awards/` has scans of several.
 */
export interface Certification {
  /** Exactly as the issuing body writes it. */
  name: string;
  /** The body that granted it — the house rule is that a credential names its issuer. */
  issuedBy: string | null;
  /** From the certificate. `null` until somebody supplies it; the build counts these. */
  validUntil: string | null;
  /** What is needed, while it is missing. */
  note?: string;
}

export const certifications: Certification[] = [
  {
    name: "CMMI Level 3",
    issuedBy: null,
    validUntil: null,
    note: "Appraisals are valid three years. Needs the appraisal date and the Lead Appraiser's organisation.",
  },
  {
    name: "ISO 9001",
    issuedBy: null,
    validUntil: null,
    note: "Three-year cycle, annual surveillance. Needs the registrar and the certificate expiry.",
  },
  {
    name: "ISO/IEC 27001",
    issuedBy: null,
    validUntil: null,
    note: "Three-year cycle, annual surveillance. Needs the registrar and the certificate expiry.",
  },
  {
    name: "SAP Gold Partner",
    issuedBy: "SAP SE",
    validUntil: null,
    note: "Renews annually against targets. Needs the current term's end date from Alliances.",
  },
];

/** The names, for the footer and the markup. Derived, so the two cannot drift apart. */
export const footerCertifications = certifications.map((c) => c.name);

/** Bump when site copy changes; feeds sitemap lastModified for pages without their own date. */
export const contentUpdated = "2026-11-12";

/** Headquarters and registered office. Confirmed November 2026: Bengaluru, not Noida or Bhubaneswar. */
export const headquarters = {
  city: "Bengaluru",
  country: "India",
  legalName: "In2IT Enterprise Business Services Private Limited",
};

/** The four delivery centres. Staffed, visitable, all in India. Offices are not delivery centres. */
export const deliveryCentres = ["Bengaluru", "Hyderabad", "Delhi NCR", "Bhubaneswar"];

/** Where the firm has an office or a registered entity but not a staffed delivery centre. */
export const internationalOffices = ["Singapore", "Dubai", "Nairobi", "Johannesburg"];

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
