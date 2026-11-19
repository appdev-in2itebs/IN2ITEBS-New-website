/**
 * WHERE WE STAND — the capability status table.
 *
 * ── READ THIS BEFORE YOU EDIT THE FILE ───────────────────────────────────────────────────────
 * This is the only honest mechanism by which a 500-person firm claims breadth. The positioning is
 * independent at the advisory layer and deep at the delivery layer, and the risk in that position
 * is the oldest one in professional services: that breadth quietly borrows credibility from depth.
 * This table is what stops it. Every capability carries one of four statuses, and "Ahead of us" is
 * published next to "Delivered" on purpose.
 *
 * THREE RULES, AND THEY ARE NOT NEGOTIABLE.
 *
 * 1. A capability is "delivered" only when it is in production at a named client, signed off, with
 *    a named person here accountable for it. Not a pilot. Not a proof of concept. Not "we have
 *    people with the skill". If you cannot name the client to yourself while writing the line, it
 *    is not delivered.
 * 2. `reviewed` is the date a human last checked the line against delivery evidence. It is not the
 *    date the file was edited. Changing wording does not change the date.
 * 3. THE TABLE HAS A MONTHLY OWNER IN MARKETING OR IT DOES NOT PUBLISH. A stale status table is
 *    worse than no status table: it converts an instrument of honesty into evidence that we do not
 *    check our own claims. If the owner lapses for two review cycles, take the page down rather
 *    than let it drift.
 *
 * None of the six firms benchmarked in November 2026 — Persistent, Birlasoft, Zensar, Mastek,
 * NTT DATA Business Solutions, Hexaware — publishes anything like this. That is the opportunity
 * and also the warning: there is no competitor to copy if it goes wrong.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */

export type CapabilityStatus = "delivered" | "partner" | "building" | "ahead";

export interface Capability {
  area: string;
  capability: string;
  status: CapabilityStatus;
  /** What a buyer should take from this line. Plain, specific, and never a sales sentence. */
  note: string;
}

export const STATUS_LABELS: Record<CapabilityStatus, { label: string; meaning: string }> = {
  delivered: {
    label: "Delivered",
    meaning: "In production at a named client, signed off, with a named person here accountable for it.",
  },
  partner: {
    label: "With a partner",
    meaning: "We deliver this alongside a partner, and we name them before you sign — not after.",
  },
  building: {
    label: "Building",
    meaning: "We are investing in it and some of it is live. Ask us what is running today, and we will tell you.",
  },
  ahead: {
    label: "Ahead of us",
    meaning: "We do not do this. If you need it, we will say so and point you at someone who does.",
  },
};

/**
 * The vendors the register marks "Ahead of us" — the ones we hold no designation from and do not
 * implement. Declared as its own list because a build gate reads it.
 *
 * ── WHY THIS IS DATA AND NOT INFERRED ────────────────────────────────────────────────────────
 * On 19 November 2026 the homepage was advertising "SuccessFactors, Workday, Salesforce, Oracle
 * and Microsoft practices" while this file published Oracle and Microsoft Dynamics as platforms
 * we do not implement. Two further copies of the claim sat on /about/ and in the services list.
 * Whichever page a buyer read second, one of them had told them something untrue.
 *
 * scripts/check-build.mjs now fails the build on any copy naming one of these inside a delivery
 * sentence. Deriving the list by parsing the register was tried first and was wrong: it read
 * "RISE with SAP Validated Partner designation" as a claim about RISE, which we do deliver, and
 * "24×7 network and security operations centre" as a claim about security. What the gate needs is
 * a list of VENDORS, which is not the same thing as a list of capabilities — so it is written
 * down rather than guessed at.
 *
 * Keep it in step with the "Other platforms" line below. If a designation is obtained, the status
 * changes and the name comes off this list in the same commit, not a later one.
 *
 * "Microsoft" appears without "Dynamics" deliberately. The designation we lack is for Dynamics,
 * but a reader who meets "Microsoft practices" on the homepage takes the broader claim. The gate
 * exempts "Microsoft Azure" and "Microsoft 365" — a hyperscaler we really do deliver RISE on, and
 * a product estate we really do work alongside.
 */
export const platformsWeDoNotImplement = ["Oracle", "ServiceNow", "Microsoft Dynamics", "Microsoft", "Adobe"];

/** The date a person last checked every line below against delivery evidence. */
export const capabilityReviewed = "2026-11-12";

/**
 * The role accountable for the monthly check. A role, not a person, so that it survives someone
 * changing jobs — the person is named in the page-owner register (content/page-owners.ts).
 */
export const capabilityOwner = "Marketing and Communications";

/**
 * The eight accountable roles on this site live in content/page-owners.ts. This file names only
 * the one that owns this table; the register is the single place a role is defined.
 */

/**
 * How long a line may go unchecked before the build refuses to ship the page.
 *
 * This is not a reminder, it is a gate. `scripts/check-build.mjs` fails a production build when
 * `capabilityReviewed` is older than this, which means a stale table cannot reach the live site by
 * being forgotten — only by somebody deliberately editing the date without doing the review, which
 * is a different and more visible kind of failure.
 *
 * Ninety days rather than thirty: a monthly cadence with a ninety-day hard stop tolerates one
 * missed month and a holiday, and fails on genuine neglect.
 */
export const CAPABILITY_REVIEW_MAX_AGE_DAYS = 90;

/**
 * The date this page stops publishing unless somebody checks the table again.
 *
 * ── WHY A DATE AND NOT A COUNTDOWN ───────────────────────────────────────────────────────────
 * The obvious way to show the gate on the page is "checked 12 days ago, 78 remaining". That
 * number is computed when the page is built, and these pages are statically generated — so a page
 * built today and not rebuilt for a month goes on telling every visitor it was checked 12 days
 * ago. That is precisely the quiet staleness this whole mechanism exists to prevent, and a clock
 * that lies is worse than no clock.
 *
 * A date cannot drift. "Checked on 12 November 2026, expires 10 February 2027" is true the moment
 * it renders and still true a year later, and the reader does the subtraction against their own
 * calendar rather than against our build time.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */
export const capabilityExpires = new Date(
  Date.parse(`${capabilityReviewed}T00:00:00Z`) + CAPABILITY_REVIEW_MAX_AGE_DAYS * 86_400_000,
)
  .toISOString()
  .slice(0, 10);

/** The house format for a date a reader is meant to check against their own calendar. */
export const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export const capabilities: Capability[] = [
  // ── SAP, which is where the depth claim is made ──
  {
    area: "SAP",
    capability: "S/4HANA conversion and RISE migration",
    status: "delivered",
    note: "Brownfield conversions and RISE migrations in production, including in state utilities and public sector undertakings.",
  },
  {
    area: "SAP",
    capability: "SuccessFactors across the module set",
    status: "delivered",
    note: "Employee Central, Recruiting, Onboarding, Performance and Goals, Compensation, Succession and Learning, in production across multiple sectors.",
  },
  {
    area: "SAP",
    capability: "Application management and support",
    status: "delivered",
    note: "Multi-year AMS engagements running against per-client service levels from a shared specialist pool.",
  },
  {
    area: "SAP",
    capability: "Utilities meter-to-cash and contract accounting",
    status: "delivered",
    note: "In production at distribution and transmission utilities.",
  },
  {
    area: "SAP",
    capability: "Plant maintenance, including work clearance management",
    status: "delivered",
    note: "Implemented and run at a Navratna public sector undertaking, won on open tender.",
  },
  {
    area: "SAP",
    capability: "Ariba and source-to-procure",
    status: "building",
    note: "We hold the skills and have delivered components of it. We are not currently claiming a full source-to-procure programme as a reference. Ask what is live.",
  },
  {
    area: "SAP",
    capability: "SAP Business AI and Joule agents",
    status: "building",
    note: "Advisory work on feasibility has been delivered. Agents built with Joule Studio on SAP Business AI Platform are an investment, not a reference. We will tell you what is running before you ask twice.",
  },
  {
    area: "SAP",
    capability: "RISE with SAP Validated Partner designation",
    status: "ahead",
    note: "We do not hold it. Some Indian public-sector tenders use it as a pre-qualification, and where they do we are not eligible unless we bid with a partner who holds it. We will tell you that at the start of a pursuit rather than at the end.",
  },

  // ── The other platforms ──
  {
    area: "Other platforms",
    capability: "Salesforce",
    status: "building",
    note: "We are a partner in India with trained people and project experience, and no referenceable client of our own as at November 2026. That is a real position and we would rather state it than imply otherwise.",
  },
  {
    area: "Other platforms",
    capability: "Workday",
    status: "building",
    note: "As Salesforce: partnership and bench, no reference client of our own yet.",
  },
  {
    area: "Other platforms",
    capability: "Oracle, ServiceNow, Microsoft Dynamics, Adobe",
    status: "ahead",
    note: "We hold no designation from any of them and we do not implement them. If your answer is one of these, we are the wrong firm and we will say so in the first meeting.",
  },

  // ── Engineering, data and AI ──
  {
    area: "Engineering and data",
    capability: "Application development and maintenance",
    status: "delivered",
    note: "Government workflow platforms, dealer and retailer portals, and long-running maintenance engagements across three continents.",
  },
  {
    area: "Engineering and data",
    capability: "Data migration with reconciliation on every load",
    status: "delivered",
    note: "Reconciled migrations into production, with rejected records on a named list with an owner rather than in a log nobody reads.",
  },
  {
    area: "Engineering and data",
    capability: "Analytics and reporting platforms",
    status: "delivered",
    note: "In production, including SAP Analytics Cloud and open-source stacks.",
  },
  {
    area: "Engineering and data",
    capability: "Applied AI inside enterprise processes",
    status: "building",
    note: "Delivered in narrow scopes — document and computer vision work in production at a state undertaking. The broader agentic claim is not one we make yet.",
  },

  // ── Run, and the boundary ──
  {
    area: "Run and operations",
    capability: "Infrastructure managed services",
    status: "delivered",
    note: "Server, operating system, database, desktop, application and network security management, delivered under a twelve-month managed service at a state mining undertaking.",
  },
  {
    area: "Run and operations",
    capability: "Cloud hosting on hyperscaler regions",
    status: "partner",
    note: "We design and run the estate; the hyperscaler supplies the region and the infrastructure. We do not resell hardware or hosting, and we will name the partner before you sign.",
  },
  {
    area: "Run and operations",
    capability: "24×7 network and security operations centre",
    status: "ahead",
    note: "We do not currently operate one and will not describe application support as though it were one. Where a client needs it, we say so and bring a partner.",
  },
  {
    area: "Run and operations",
    capability: "Operational technology — controls, instrumentation, historians",
    status: "ahead",
    note: "We are OT-adjacent, not OT. We integrate to it through SAP PM and EAM and design to IEC 62443 zones and conduits. We do not employ controls or instrumentation engineers, and the sensor layer itself is somebody else's work.",
  },
];
