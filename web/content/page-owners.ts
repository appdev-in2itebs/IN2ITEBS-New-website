/**
 * THE PAGE OWNER REGISTER.
 *
 * Every page on this site has exactly one accountable role. Not a team — a role, held by one
 * person, who is answerable for whether what is on that page is still true.
 *
 * ── WHY THIS EXISTS ──────────────────────────────────────────────────────────────────────────
 * The November 2026 audit found Ford Motor Company's vision statement on the About page, a
 * stock-tips article under an SAP partner's brand, withdrawn ISO standards on the certification
 * page, and two main navigation items returning 404. None of those failures happened because
 * somebody made a bad decision. They happened because nobody was answerable for noticing.
 *
 * A page with no owner decays silently and nobody is at fault, which is the worst of both worlds.
 *
 * ── HOW IT IS ENFORCED ───────────────────────────────────────────────────────────────────────
 * `tests/redirects.test.ts` fails if any route in the sitemap has no owner here. A new page
 * therefore cannot ship without somebody's name against it. That is deliberate friction, and it
 * costs about thirty seconds.
 *
 * ── ROLES AND MAILBOXES, NEVER NAMES ─────────────────────────────────────────────────────────
 * An earlier draft of this file held a person's name against each role. That was wrong, and the
 * Managing Director was right to reject it: people change jobs, a name register goes stale within
 * a year, and a stale register is exactly the failure this file exists to prevent.
 *
 * So ownership resolves to a ROLE, and a role resolves to a MAILBOX. A mailbox is durable, it
 * already routes to whoever holds the role today, it survives a resignation without an edit here,
 * and it is what the rest of the industry uses. Nobody has to remember to update this file when
 * somebody is promoted.
 *
 * This register is internal and is not rendered anywhere on the site. Public contact on the site
 * is the role mailbox too — never an individual's address, for the same reason.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */

export type OwnerRole =
  | "Marketing and Communications"
  | "Alliances"
  | "Practice — Enterprise Platforms"
  | "Practice — Digital, Data and AI"
  | "Practice — Advisory"
  | "Sales and Bid Management"
  | "Human Resources"
  | "Legal and Compliance";

/**
 * Where a question about a page goes. Mailboxes, not people.
 *
 * Only two of these exist today — info@ and hr@ are already in use on the site. The rest are
 * aliases to create, and each one is five minutes of work in the mail admin that then never needs
 * touching again. Until an alias exists, mail to it will bounce, so create them before relying on
 * this register operationally.
 */
export const mailboxes: Record<OwnerRole, string> = {
  "Marketing and Communications": "marketing@in2itebs.com",
  Alliances: "alliances@in2itebs.com",
  "Practice — Enterprise Platforms": "sap@in2itebs.com",
  "Practice — Digital, Data and AI": "engineering@in2itebs.com",
  "Practice — Advisory": "advisory@in2itebs.com",
  "Sales and Bid Management": "sales@in2itebs.com",
  "Human Resources": "hr@in2itebs.com",
  "Legal and Compliance": "legal@in2itebs.com",
};

/** Already live. The others in `mailboxes` are aliases still to be created. */
export const existingMailboxes = new Set(["info@in2itebs.com", "hr@in2itebs.com"]);

/**
 * Ownership by route prefix, most specific first. A route takes the first prefix it matches, so
 * `/services/sap/` is owned by Enterprise Platforms even though `/services/` is owned by Marketing.
 */
export const ownerRules: { prefix: string; owner: OwnerRole; why?: string }[] = [
  // ── Service pages belong to the practice that has to deliver what they promise ──
  { prefix: "/services/sap/", owner: "Practice — Enterprise Platforms" },
  { prefix: "/services/grow-fast/", owner: "Practice — Enterprise Platforms" },
  { prefix: "/services/ecc-prism/", owner: "Practice — Enterprise Platforms" },
  { prefix: "/services/rise-s4hana/", owner: "Practice — Enterprise Platforms" },
  { prefix: "/services/successfactors/", owner: "Practice — Enterprise Platforms" },
  { prefix: "/services/smart-meter-to-cash/", owner: "Practice — Enterprise Platforms" },
  { prefix: "/services/managed-services/", owner: "Practice — Enterprise Platforms" },
  { prefix: "/services/salesforce/", owner: "Practice — Enterprise Platforms" },
  { prefix: "/services/workday/", owner: "Practice — Enterprise Platforms" },
  { prefix: "/services/enterprise-platforms/", owner: "Practice — Enterprise Platforms" },

  { prefix: "/services/application-engineering/", owner: "Practice — Digital, Data and AI" },
  { prefix: "/services/application-estate-review/", owner: "Practice — Digital, Data and AI" },
  { prefix: "/services/data-engineering-analytics/", owner: "Practice — Digital, Data and AI" },
  { prefix: "/services/enterprise-data-management/", owner: "Practice — Digital, Data and AI" },
  { prefix: "/services/applied-ai/", owner: "Practice — Digital, Data and AI" },
  { prefix: "/services/digital-data-ai/", owner: "Practice — Digital, Data and AI" },

  { prefix: "/services/advisory/", owner: "Practice — Advisory" },

  {
    prefix: "/services/how-we-price/",
    owner: "Sales and Bid Management",
    why: "Commercial terms are theirs to stand behind, not Marketing's to describe.",
  },

  // ── Credentials and anything that states a third party's view of us ──
  {
    prefix: "/about/credentials/",
    owner: "Alliances",
    why: "Every line is a designation, appraisal or award granted by somebody else. Alliances holds the certificates.",
  },
  { prefix: "/about/partnerships/", owner: "Alliances" },
  {
    prefix: "/about/where-we-stand/",
    owner: "Marketing and Communications",
    why: "Monthly review against delivery evidence. The build fails if it goes 90 days unchecked — see scripts/check-build.mjs.",
  },

  // ── Careers ──
  { prefix: "/careers/", owner: "Human Resources" },

  // ── Legal ──
  { prefix: "/legal/", owner: "Legal and Compliance" },

  // ── Client work. Named clients carry consent risk, so this is not Marketing's alone ──
  {
    prefix: "/case-studies/",
    owner: "Legal and Compliance",
    why: "A named client, a figure and a logo are three separate permissions. Consent is a legal question before it is a marketing one; content/compliance.ts is the gate.",
  },

  // ── Everything else Marketing owns ──
  { prefix: "/industries/", owner: "Marketing and Communications" },
  { prefix: "/insights/", owner: "Marketing and Communications" },
  { prefix: "/about/", owner: "Marketing and Communications" },
  { prefix: "/services/", owner: "Marketing and Communications" },
  { prefix: "/contact/", owner: "Marketing and Communications" },
  { prefix: "/", owner: "Marketing and Communications" },
];

/** The role accountable for a route. Returns undefined only if the rules above have a hole. */
export function ownerOf(path: string): OwnerRole | undefined {
  return ownerRules.find((rule) => path.startsWith(rule.prefix))?.owner;
}

/** Where to send a question about a page. */
export function mailboxFor(path: string): string {
  const owner = ownerOf(path);
  return owner ? mailboxes[owner] : "info@in2itebs.com";
}
