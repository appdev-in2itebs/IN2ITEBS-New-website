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
 * ── ROLES, NOT PEOPLE ────────────────────────────────────────────────────────────────────────
 * Roles survive people changing jobs; names do not. `people` below maps each role to the person
 * holding it today, and is the only part that changes when somebody moves. It is NOT rendered on
 * the site — this register is internal, and publishing a staff directory by page is not the
 * intent.
 *
 * The name against each role is the Managing Director's to confirm. Until he does, the role is
 * still the right answer to "who is answerable for this page", which is the question that was
 * previously unanswerable.
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

/** Who holds each role today. Confirm with the Managing Director before relying on it. */
export const people: Record<OwnerRole, string> = {
  "Marketing and Communications": "TO CONFIRM",
  Alliances: "TO CONFIRM",
  "Practice — Enterprise Platforms": "TO CONFIRM",
  "Practice — Digital, Data and AI": "TO CONFIRM",
  "Practice — Advisory": "TO CONFIRM",
  "Sales and Bid Management": "TO CONFIRM",
  "Human Resources": "TO CONFIRM",
  "Legal and Compliance": "TO CONFIRM",
};

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
