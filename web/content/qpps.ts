/**
 * SAP-QUALIFIED PARTNER-PACKAGED SOLUTIONS.
 *
 * ── WHY THIS IS A SEPARATE FILE ──────────────────────────────────────────────────────────────
 * A qualified partner-packaged solution is not a marketing name we chose. It is a designation SAP
 * grants after reviewing the package, and SAP publishes the list itself on our partner profile.
 * That makes these the strongest credentials on this site after the Gold Partner designation
 * — third-party, checkable, and worded by the body that granted them.
 *
 * So the names here are SAP's, exactly as SAP's partner profile prints them, and nobody should
 * shorten them. In particular:
 *
 *   "In2IT Converged Pulse for SAP GROW Fast"      is correct.
 *   "Converged Pulse"                              is acceptable shorthand in running copy.
 *   "GROW Fast"                                    is SAP's product, not ours, and must never be
 *                                                  used as the name of an In2IT offer.
 *
 * The construction SAP approves is <our name> for <SAP product>. That is why these read the way
 * they do, and it is the rule to apply to any future package.
 *
 * ── THE DESCRIPTIONS ─────────────────────────────────────────────────────────────────────────
 * `sapSummary` is SAP's own published wording, lightly trimmed for length and never for meaning.
 * Anything we would like to say beyond it goes in `ours`, so the two never get confused. If SAP
 * revises the profile, `sapSummary` follows it and `ours` is ours to keep.
 *
 * Source: sap.com/partners/profile/in2it-enterprise-business-services, read 18 November 2026.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */

export interface QualifiedPackage {
  /** The full designation, exactly as SAP's partner profile prints it. */
  name: string;
  /** Shorthand for running copy. Never "GROW Fast" on its own. */
  short: string;
  /** Which practice page carries it. */
  practice: "sap" | "successfactors";
  /** Who it is built for, in our words. */
  forWhom: string;
  /** SAP's published time-to-live, where SAP states one. */
  live?: string;
  /** SAP's own summary, trimmed for length only. */
  sapSummary: string;
  /** What we would add, which SAP does not say. */
  ours: string;
}

export const qualifiedPackages: QualifiedPackage[] = [
  {
    name: "In2IT Converged Pulse for SAP GROW Fast",
    short: "Converged Pulse",
    practice: "sap",
    forWhom: "A growing business putting a real ERP in for the first time",
    live: "Live in 12 weeks",
    sapSummary:
      "Integrated cloud ERP for growing businesses. Brings together Finance, Sales and Procurement on SAP Cloud ERP, enhanced with SAP SuccessFactors Employee Central.",
    ours: "The one that includes HR from the start rather than bolting it on in year two, which is the usual sequence and the usual regret.",
  },
  {
    name: "In2IT Converged Flow for SAP GROW Fast",
    short: "Converged Flow",
    practice: "sap",
    forWhom: "Mill products — sugar, rice, wheat, textile, metal",
    live: "Live in 16 weeks",
    sapSummary:
      "SAP GROW Fast for mill products. Integrated production planning, batch traceability and quality management, cutting shortages and quality escapes across any batch-based product line.",
    ours: "Batch traceability is the part that cannot be retro-fitted. If a recall question is ever asked of you, the answer was designed in at implementation or it does not exist.",
  },
  {
    name: "In2IT Converged Momentum for SAP GROW Fast",
    short: "Converged Momentum",
    practice: "sap",
    forWhom: "Professional services firms billing against projects",
    live: "Live in 16 weeks",
    sapSummary:
      "SAP GROW Fast for professional services. Real-time project profitability, AI-driven resourcing and automated project billing, replacing spreadsheets.",
    ours: "Project profitability you can see during the project rather than after it. The spreadsheet always tells you last month; this is the one that tells you this week.",
  },
  {
    name: "SimplifyTalent",
    short: "SimplifyTalent",
    practice: "successfactors",
    forWhom: "Organisations standing up core HR on SuccessFactors",
    sapSummary:
      "Leverages the SAP SuccessFactors solution portfolio, enabling organisations across all industries to implement the end-to-end spectrum of core HR.",
    ours: "A packaged core HR build, shaped by what Indian organisations actually have to run — establishment, statutory reporting and the payroll hand-off — rather than by a global template.",
  },
  {
    name: "SimplifyHiring",
    short: "SimplifyHiring",
    practice: "successfactors",
    forWhom: "Organisations fixing recruitment and onboarding first",
    sapSummary:
      "Leverages the global best practices of the SAP SuccessFactors solution portfolio, for recruitment and onboarding.",
    ours: "Recruiting and Onboarding taken together, because the hand-off between them is where candidates are lost and where the first impression of the employer is actually made.",
  },
];

export const packagesFor = (practice: QualifiedPackage["practice"]) =>
  qualifiedPackages.filter((p) => p.practice === practice);

/**
 * Delivery counts SAP publishes on our partner profile, by solution area.
 *
 * These are SAP's numbers, not ours, which is exactly what makes them worth having: a buyer can
 * check every one against sap.com without asking us for anything.
 *
 * NOT PUBLISHED ON THE SITE, by the Managing Director's decision of 18 November 2026. SAP revises
 * the profile as engagements close, so a figure printed here goes stale between bids unless
 * somebody re-reads the profile — and a stale number on a page about honesty is worse than no
 * number. They are recorded for bid teams, who can cite the live profile directly.
 *
 * Read 18 November 2026. Re-read before quoting any of them.
 */
export const sapPublishedDeliveries = [
  { area: "Talent management", india: 25 },
  { area: "Core HR", india: 17 },
  { area: "Recruiting", india: 10 },
  { area: "Workforce management", india: 9 },
  { area: "Learning", india: 8 },
  { area: "Integration", india: 8 },
  { area: "Application development and automation", india: 5 },
  { area: "Payroll", india: 4 },
  { area: "Database and data management", india: 4 },
  { area: "SAP cloud ERP finance", india: 3 },
] as const;

/** The date the partner profile was last read. The build warns when this goes stale. */
export const sapProfileReviewed = "2026-11-18";
export const SAP_PROFILE_URL = "https://www.sap.com/partners/profile/in2it-enterprise-business-services";
