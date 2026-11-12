/** Partner ecosystem — Content Blueprint §10.3 + Deck 2 slide 5.
 *  Four categories with role descriptions; logos used where we hold the asset.
 *  Microsoft, Oracle, IBM, HP, OpenText and Qualtrics marks: Wikimedia Commons (public-domain text logos,
 *  8 Sep 2026). Newgen has no usable public vector; it stays a name until brand artwork is supplied. */

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
