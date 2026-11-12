/**
 * Publication controls from the November 2026 amendment brief and audit.
 *
 * ── WHY THERE ARE THREE FLAGS AND NOT ONE ────────────────────────────────────────────────────
 * The original control was a single `clientEvidenceApproved`, which failed closed on everything
 * at once. That was right as a Phase 0 emergency brake and wrong as a steady state, because it
 * treats three genuinely different permissions as one:
 *
 *   IDENTITY    — a client's name and logo, shown as a fact of the relationship.
 *   TESTIMONIAL — a named person's words, face and job title.
 *   CASE STUDY  — what we did for a client, named or by sector, with scope, duration and figures.
 *
 * They carry different risk and are granted by different people. A logo is a trademark question
 * and usually a marketing decision. A testimonial is an individual's likeness and words, and that
 * person can withdraw it when they change jobs. A case study is commercial detail about the
 * client's own business, and is the one their legal team will care about.
 *
 * Collapsing all three into one flag means the most cautious of them governs the other two, which
 * is why ninety-odd client logos were hidden in order to protect five testimonials.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */

/**
 * Client names and logos.
 *
 * ON, by the Managing Director's decision of 12 November 2026: nothing has been signed that
 * prohibits identifying our clients, and showing who you work for is ordinary practice in this
 * industry. This governs the homepage logo wall, the client strip, the industry logo rows, the
 * client list the assistant may read from, and the reference-book diagram on /case-studies/.
 *
 * If a client ever asks to be removed, remove that client from content/clients.ts rather than
 * turning this flag off. One objection is not a reason to hide everyone.
 */
export const clientIdentityApproved = true;

/**
 * Named testimonials — a person's quote, role and photograph.
 *
 * OFF, and this is not the same decision as the logos. The words and the face belong to the
 * individual who gave them, not to their employer. The quotes on file were collected for the
 * legacy site, and at least one has been misattributed in the past — "Trileagal" printed inside
 * Trilegal's own quotation, on three pages — which is how a goodwill quote becomes a complaint.
 *
 * Turn this on when each named person has confirmed in writing, recently, that their quote, role
 * and photograph may be used. That is a short email per person, not a legal project.
 */
export const clientTestimonialsApproved = false;

/**
 * Naming clients in case studies.
 *
 * OFF, and this is a POSITION rather than a holding pattern. The Managing Director's preference,
 * confirmed 12 November 2026, is that client work publishes by sector and region — "A state-owned
 * mining undertaking, eastern India" — and the competitors do the same. So the default is not
 * "hidden until consent arrives"; the default is anonymous, and naming a client is the exception
 * that has to be argued for.
 *
 * Every study publishes either way. See `publicCaseStudies` in content/case-studies.ts: each named
 * study carries an `anonymous` block and goes out through it, with a neutral slug, while this is
 * false. Nothing is withheld by leaving it that way.
 *
 * Turning it on would need two things, in this order: the client's written agreement to be named
 * AND a decision to depart from the house style for that client. Written consent alone is not a
 * reason to name somebody if anonymous is how we publish.
 *
 * A reminder worth keeping, because it is the trap: anonymising is not renaming. The overrides
 * exist because the scenarios identified the clients outright, and tests/metadata.test.ts fails
 * the build if a name or an identifying token survives into the published copy.
 */
export const namedCaseStudiesApproved = false;

/**
 * Demo articles shipped with the original theme. Blocked by slug so an old CMS row cannot put a
 * stock-tips article back under an SAP partner's brand.
 */
export const blockedInsightSlugs = new Set([
  "attract-and-retain-quality-high-paying-customers",
  "coronavirus-lockdown-leads-to-more-gaming-and-e-sports",
  "future-where-technology-creates-good-jobs",
  "live-stream-from-awwwards-showcasing-trends",
  "solutions-for-all-small-and-large-business",
  "what-you-do-today-improve-your-tomorrows",
]);

/** The US office was removed from the record; this stops a legacy database row restoring it. */
export const blockedOfficeSlugs = new Set(["usa"]);
