/**
 * Partner ecosystem — Content Blueprint §10.3 + Deck 2 slide 5.
 *
 * ── A NOTE THAT USED TO BE HERE, AND WHY IT WAS WRONG ────────────────────────────────────────
 * This file previously recorded that the Microsoft, Oracle, IBM, HP, OpenText and Qualtrics marks
 * were cleared because Wikimedia Commons lists them as public domain. That reasoning does not
 * work, and it is a common enough mistake to be worth writing down.
 *
 * Wikimedia's public-domain tag is a statement about COPYRIGHT: a plain wordmark is usually too
 * simple to attract copyright, so the image file can be reused. TRADEMARK is a separate right
 * that is wholly unaffected by that, and trademark is the one that governs what we are doing
 * here — using another company's mark in a way that says something about our relationship with
 * them. Wikimedia's own tag says exactly this.
 *
 * So the clearance each of these needs is the OEM's own brand or partner guidelines, not a
 * licence tag on a file. Alliances holds that question.
 *
 * ── AND THE HARDER PROBLEM ───────────────────────────────────────────────────────────────────
 * /about/where-we-stand/ publishes that we hold no designation from Oracle, ServiceNow, Microsoft
 * Dynamics or Adobe and do not implement them. Several of those marks appear below under a
 * heading about platforms we transform and run. Whichever page a buyer reads second, one of them
 * has told them something untrue — and the capability table is the least copyable asset on this
 * site, so it is not the one to undermine.
 *
 * The fix is a category split — "Platforms we implement" with logos, "Systems we integrate to,
 * and do not sell" without — which is the framing /about/partnerships/ already uses. It is a
 * business decision about what the homepage shows, so it is flagged rather than made here.
 *
 * Newgen has no usable public vector; it stays a name until brand artwork is supplied.
 */

export interface PartnerCategory {
  title: string;
  intro: string;
  partners: { name: string; note?: string; logo?: string | null }[];
}

export const partnerCategories: PartnerCategory[] = [
  {
    title: "Application Platforms",
    intro: "The enterprise platforms we transform and run end-to-end.",
    partners: [
      { name: "SAP", note: "Gold Partner", logo: "/logos/partners/sap.svg" },
      { name: "Salesforce", logo: "/logos/partners/salesforce.svg" },
      { name: "Workday", logo: "/logos/partners/workday.svg" },
      { name: "SAP Concur", logo: "/logos/sap/sap-concur.png" },
      { name: "SAP Ariba", logo: "/logos/sap/sap-ariba.png" },
      { name: "SAP SuccessFactors" },
      { name: "Oracle", logo: "/logos/partners/oracle.svg" },
      { name: "Microsoft", note: "Dynamics 365 · Microsoft 365", logo: "/logos/partners/microsoft.svg" },
    ],
  },
  {
    title: "Hyperscalers",
    intro: "Multi-cloud delivery experience across the major clouds.",
    partners: [
      { name: "Amazon Web Services (AWS)", logo: "/logos/partners/aws.svg" },
      { name: "Microsoft Azure", logo: "/logos/partners/microsoft-azure.svg" },
      { name: "Google Cloud Platform", logo: "/logos/partners/google-cloud.svg" },
      { name: "Multi-cloud delivery" },
    ],
  },
  {
    title: "Data & Analytics",
    intro: "The data, migration and analytics stack behind every transformation.",
    partners: [
      { name: "SAP Datasphere & SAC" },
      { name: "Syniti", note: "data migration" },
      { name: "Tableau, Power BI, Qlik" },
      { name: "Snowflake, Databricks", note: "integration" },
    ],
  },
  {
    title: "Specialised Partners",
    intro: "Specialist vendors that extend the stack.",
    partners: [
      { name: "MuleSoft", note: "integration" },
      { name: "OpenText", note: "content", logo: "/logos/partners/opentext.svg" },
      { name: "Newgen", note: "process & content" },
      { name: "Qualtrics", note: "experience management", logo: "/logos/partners/qualtrics.svg" },
      { name: "IBM", logo: "/logos/partners/ibm.svg" },
      { name: "HP", logo: "/logos/partners/hp.svg" },
      { name: "ServiceNow", note: "ITSM" },
    ],
  },
];

/** Names shown in the homepage "Our partners & technology ecosystem" grid, in the order of the preserved partner pages. */
export const homeEcosystemNames = [
  "SAP",
  "Microsoft",
  "Oracle",
  "Salesforce",
  "Workday",
  "IBM",
  "HP",
  "OpenText",
  "Newgen",
  "SAP Concur",
  "Qualtrics",
] as const;

const allPartners = partnerCategories.flatMap((category) => category.partners);

/** Look a partner up by display name across every category (single source of truth for logos). */
export function findPartner(name: string) {
  return allPartners.find((partner) => partner.name === name);
}

/** Homepage grid entries resolved from the ecosystem data; missing artwork renders as a plain name. */
export const homeEcosystem = homeEcosystemNames.map((name) => ({ name, logo: findPartner(name)?.logo ?? null }));
