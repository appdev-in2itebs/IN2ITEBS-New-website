/**
 * Phase 0 publication controls from the November 2026 amendment brief and audit.
 *
 * These defaults deliberately fail closed: customer evidence stays hidden until written
 * consent is recorded, known demo articles cannot be restored through an old CMS row, and
 * disputed office claims are filtered even when the database still contains legacy content.
 */
export const clientEvidenceApproved = false;

export const blockedInsightSlugs = new Set([
  "attract-and-retain-quality-high-paying-customers",
  "coronavirus-lockdown-leads-to-more-gaming-and-e-sports",
  "future-where-technology-creates-good-jobs",
  "live-stream-from-awwwards-showcasing-trends",
  "solutions-for-all-small-and-large-business",
  "what-you-do-today-improve-your-tomorrows",
]);

export const blockedOfficeSlugs = new Set(["usa"]);
