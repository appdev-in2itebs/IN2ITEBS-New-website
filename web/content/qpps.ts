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
  /**
   * What the package actually contains, grouped the way it is sold.
   *
   * ── WHY THIS IS HERE AND NOT IN AN IMAGE ─────────────────────────────────────────────────
   * It used to be an image. The full scope of SimplifyTalent and SimplifyHiring — every module,
   * template and integration — was a set of flat JPEGs on two /insights/ articles. The most
   * specific and most checkable content we hold about two SAP-qualified packages was therefore
   * **invisible to search and unreadable by a screen reader**, and the first question a buyer
   * asks — "what do I actually get?" — could not be answered by searching for it.
   *
   * The artwork was also off-brand green and carried four spelling errors that had been live for
   * years, because nobody proofreads a picture: "Caimpaigns", "Starteygy", "Souring" and
   * "Questionaires". Text gets proofread; pictures do not. That is a reason to prefer text with
   * nothing to do with accessibility.
   *
   * ── THE RULE ─────────────────────────────────────────────────────────────────────────────
   * This is a transcription, not a rewrite. Every line below appears in the source artwork; the
   * only changes are spelling, capitalisation and the removal of duplicate rows. **Nothing was
   * added to make a package look larger**, because the scope of a fixed-price package is a
   * commercial commitment, and inventing a line in one is a different class of error from a typo.
   *
   * Left undefined for the three Converged packages: SAP's profile publishes their summary but no
   * itemised scope, and we do not hold one anybody has signed off. An invented scope is worse
   * than none.
   */
  scope?: { group: string; items: string[] }[];
  /** Where the itemised scope came from, so the next person can check it against the source. */
  scopeSource?: string;
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
    scopeSource:
      "Transcribed from the package artwork that was published on /insights/in2it-ebs-simplify-talent-2/. The artwork is kept at docs/source/qpp-artwork/Picture3.jpg and Picture4.jpg so the scope can be checked against it; it is no longer served, because a scope is text. Transcribed 18 November 2026.",
    scope: [
      {
        group: "Employee Central core",
        items: [
          "Organisation management",
          "People profile",
          "Standard job profile builder",
          "Badges and talent profile enablement",
          "Five standard document generations",
          "SFTP integration with one biometric and one payroll vendor",
        ],
      },
      {
        group: "Employee life cycle",
        items: ["New hire and rehire", "HR transactions", "Event reasons", "Separation"],
      },
      {
        group: "Leave management, India",
        items: ["Leave application", "Team absences", "View time account", "HR admin tasks on time off"],
      },
      {
        group: "Position management",
        items: ["Create position", "Change or deactivate position", "Mass change of positions"],
      },
      {
        group: "Goal management",
        items: [
          "Goal plan and approval",
          "Status report",
          "Meeting agenda",
          "Standard goal library and smart goal wizard",
        ],
      },
      {
        group: "Performance management",
        items: [
          "One route map, one rating scale",
          "Standard writing assistant and legal scan",
          "Company directory",
          "Continuous performance management",
        ],
      },
      {
        group: "360-degree feedback and calibration",
        items: ["360 reviews", "Standard dashboard", "Calibration", "Executive reviews", "Stack ranking reviews"],
      },
      {
        group: "Included with India localisation",
        items: [
          "Business processes and workflows",
          "Standard data models",
          "Standard email notifications",
          "Role-based permissions",
          "Theme manager",
          "One goal plan template, one performance template, one 360-degree template",
        ],
      },
    ],
  },
  {
    name: "SimplifyHiring",
    short: "SimplifyHiring",
    practice: "successfactors",
    forWhom: "Organisations fixing recruitment and onboarding first",
    sapSummary:
      "Leverages the global best practices of the SAP SuccessFactors solution portfolio, for recruitment and onboarding.",
    ours: "Recruiting and Onboarding taken together, because the hand-off between them is where candidates are lost and where the first impression of the employer is actually made.",
    scopeSource:
      "Transcribed from the package artwork that was published on /insights/in2it-ebs-simplify-hiring/, kept at docs/source/qpp-artwork/t1.png. Transcribed 18 November 2026; four spellings corrected against the original.",
    scope: [
      {
        group: "Requisition management",
        items: [
          "Requisition and approval",
          "Standard SuccessFactors pre-screening questionnaires",
          "Competency-based assessment setup",
          "Sourcing setup",
          "Recruiting posting setup",
        ],
      },
      {
        group: "Candidate management",
        items: [
          "Multistage application",
          "Document attachment",
          "Interview scheduling with Outlook integration",
          "Candidate search",
          "Candidate upload, single or bulk",
          "Email campaigns",
          "Talent pools with ten-status setup",
        ],
      },
      {
        group: "Offer management",
        items: ["Offer approval setup, two-level approval", "One offer letter setup"],
      },
      {
        group: "Onboarding",
        items: [
          "One India onboarding template, including Form 11 and Form 2 (EPF nominee details)",
          "Asset request setup",
          "ID card request setup",
          "Buddy programme setup",
          "Quick links setup",
          "Standard notifications",
        ],
      },
      {
        group: "Standard dashboards and reports",
        items: [
          "Requisition status",
          "Candidate pipeline report",
          "Offer acceptance ratio",
          "Cost per hire",
          "Joining report",
          "Turnaround time of position closure",
        ],
      },
      {
        group: "Included with",
        items: [
          "One requisition template, one candidate template",
          "One offer approval template, one offer letter template",
          "Role-based permissions",
          "Email notifications",
          "One standard route map: two steps, one rating scale of 1 to 5",
          "Career site builder, one strategy page",
        ],
      },
    ],
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
