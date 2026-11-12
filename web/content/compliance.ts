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
 *   CASE STUDY  — what we did for a named client, with scope, duration and figures.
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
 * Named case studies — the client, the engagement, the scope and the figures.
 *
 * OFF. The highest bar of the three, because the content is commercial detail about the client's
 * own business rather than the bare fact that they are a client. Nine named studies and the four
 * written from purchase orders sit behind this.
 *
 * Turn it on per client rather than globally, when their communications or legal team has agreed
 * the text. Until then every one of them still publishes anonymised, by sector and region.
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
