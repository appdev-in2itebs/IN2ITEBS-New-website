/** Case studies — Content Blueprint §10.2 + Deck 2 slides 51-62.
 *  Named studies are publishable; anonymised stay anonymised (no client name/logo). */

import { clientEvidenceApproved } from "./compliance";

export type SapPath = "GROW" | "RISE" | "ECC" | "AMS";

export interface CaseStudy {
  slug: string;
  client: string; // display name (anonymised label if not named)
  named: boolean;
  logo?: string | null; // /logos/clients/* when named + available
  industry: string; // matches an industry name/sector
  sapPath: SapPath;
  featuredSolution: string;
  employees: string;
  region: string;
  scenario: string;
  summary?: string; // ≤155 characters, used as the page meta description (named studies only)
  benefits: string[];
  solution: string[];
  differentiator: string;
  outcome?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "global-engineering-consultancy",
    client: "Global Engineering Consultancy",
    named: false,
    industry: "Engineering & Construction",
    sapPath: "GROW",
    featuredSolution: "GROW with SAP + SuccessFactors",
    employees: "5,000+",
    region: "Global (since 1946, Japan)",
    scenario:
      "A global leader in consulting engineering and project management — established in 1946 as Japan's first independent consulting engineering firm — needed a robust ERP to streamline operations across worldwide offices serving public and private clients.",
    benefits: [
      "End-to-end visibility across all customer projects, from lead to invoice",
      "Synchronised flow from employee onboarding through project billing",
      "Single unified stack across Lead-to-Cash, Hire-to-Retire and Record-to-Report",
      "Scalable platform supporting expansion into new markets",
    ],
    solution: [
      "S/4HANA Cloud",
      "Finance",
      "Source-to-Procure",
      "Sales / C4C",
      "SuccessFactors — Employee Central, Recruitment, Onboarding, LMS, Compensation",
    ],
    differentiator:
      "In2IT EBS recommended a package that uses data across the company and processes it centrally — accelerating IFRS-aligned financial close and consolidated project reporting across regions.",
  },
  {
    slug: "global-it-services-provider",
    client: "Global IT Services Provider",
    named: false,
    industry: "IT & Professional Services",
    sapPath: "GROW",
    featuredSolution: "GROW with SAP Public Cloud",
    employees: "1,000+",
    region: "Americas, APAC, EMEA (HQ Chandigarh, India)",
    scenario:
      "A global IT services provider specialising in infrastructure services, outsourcing, eSolutions and business process optimisation needed a single platform to streamline IT operations and financial close across regions.",
    benefits: [
      "Single integrated platform for IT infrastructure, cloud and security operations",
      "End-to-end IT outsourcing with optimised resource allocation",
      "Unified stack: Procure-to-Pay, Order-to-Cash, Hire-to-Retire, Record-to-Report",
    ],
    solution: ["Finance", "Source-to-Procure", "Sales", "IFRS & US GAAP Close", "Consolidated Reporting"],
    differentiator:
      "In2IT EBS recommended a centralised package — enabling IFRS and US GAAP financial close, consolidated reporting and operational consistency across regions.",
  },
  {
    slug: "tgnpdcl",
    client: "TGNPDCL",
    named: true,
    industry: "Energy & Utilities",
    sapPath: "RISE",
    featuredSolution: "ECC → RISE with S/4HANA",
    employees: "19,000+",
    region: "Telangana, India",
    scenario:
      "Telangana State Northern Power Distribution Co. migrated its existing SAP ERP estate from ECC (SOH) to RISE with S/4HANA, with phased delivery, document management, analytics and integration uplift.",
    summary:
      "Telangana State Northern Power Distribution Co. moved its SAP ERP estate from ECC to RISE with S/4HANA in phases, reaching an integrated SAP landscape.",
    benefits: [
      "Streamlined procurement, materials, service performance and invoicing",
      "SAC dashboards for real-time operational decision-making",
      "Reduced overhead through automation and better service tracking",
      "Scalable architecture supporting future modules and growth",
    ],
    solution: [
      "SAP Integration Suite (SAP & non-SAP)",
      "Custom Fiori apps",
      "OpenText document management",
      "SAC analytics",
      "Agile, validation-gated migration",
    ],
    differentiator:
      "Expertise, end-to-end support and consistent on-time delivery — a modern, integrated SAP landscape aligned to specific business needs.",
  },
  {
    slug: "wipro-infrastructure-engineering",
    client: "Wipro Infrastructure Engineering",
    named: true,
    industry: "Metals, Mining & Heavy Engineering",
    sapPath: "RISE",
    featuredSolution: "ECC → S/4HANA on RISE (Azure)",
    employees: "5,000+",
    region: "20+ facilities across 4 continents",
    scenario:
      "An industrial engineering business spanning Hydraulics, Industrial Automation, Aerospace, Water Treatment and Additive Manufacturing. Brownfield migration to S/4HANA 2022 on RISE with SAP (Azure), end-to-end lift-and-shift in 5 months.",
    summary:
      "Wipro Infrastructure Engineering moved to S/4HANA 2022 on RISE with SAP (Azure) in a 5-month brownfield migration — minimal disruption across 4 continents.",
    benefits: [
      "Streamlined domestic and export sourcing and procurement",
      "End-to-end traceability for recall management and compliance",
      "Improved demand forecasting and supply chain planning",
      "Higher quality control — reduced rejections and cost of quality",
    ],
    solution: [
      "S/4HANA 2022",
      "RISE Private Cloud (Azure)",
      "Brownfield conversion",
      "Quality, Production, MM, SD",
      "5-month delivery",
    ],
    differentiator:
      "Precise landscape design, sizing and technical migration tailored to global manufacturing — a seamless transition with minimal disruption across 4 continents.",
  },
  {
    slug: "waycool-foods",
    client: "WayCool Foods",
    named: true,
    industry: "FMCG / Food & Beverages",
    sapPath: "RISE",
    featuredSolution: "RISE with SAP S/4HANA PCE (Azure)",
    employees: "5,000+",
    region: "India",
    scenario:
      "India's largest and fastest-growing agri-commerce company scaling a complex supply chain from soil to sale. Migration to RISE with SAP on Azure completed end-to-end in 8 weeks.",
    summary:
      "WayCool Foods, India's largest agri-commerce company, moved to RISE with SAP S/4HANA on Azure in an 8-week end-to-end lift-and-shift.",
    benefits: [
      "Single platform unifying procurement, finance and sales",
      "Streamlined end-to-end manufacturing with capacity planning",
      "Integrated platform across manufacturing, supply chain and finance",
      "Streamlined sales across both B2B and B2C",
    ],
    solution: [
      "RISE with SAP S/4HANA PCE",
      "Sourcing & Procurement",
      "Manufacturing",
      "FIFO stock delivery",
      "Technical & functional support",
    ],
    differentiator:
      "An 8-week end-to-end lift-and-shift to Azure Cloud — mapping WayCool's complex agri-commerce processes to a digital platform.",
  },
  {
    slug: "vahdam-india",
    client: "VAHDAM India",
    named: true,
    industry: "FMCG / Food & Beverages",
    sapPath: "GROW",
    featuredSolution: "GROW with SAP",
    employees: "100+",
    region: "130 countries",
    scenario:
      "A homegrown wellness brand bringing handpicked Indian teas and superfoods directly to consumers in 130 countries, pioneering digital-first FMCG. GROW with SAP completed in 12 months, delivering an 18% reduction in manpower cost.",
    summary:
      "VAHDAM India, a digital-first tea and superfoods brand in 130 countries, went live on GROW with SAP in 12 months and cut manpower cost by 18%.",
    benefits: [
      "Streamlined supply chain through a unified business platform",
      "Improved capacity planning for manpower and machinery",
      "Seamless integration with GSP, Amazon and Shopify",
      "Automated e-invoicing, e-way billing and banking processes",
    ],
    solution: [
      "GROW with SAP S/4HANA",
      "Sourcing & Procurement",
      "Sales",
      "Manufacturing",
      "FICO · SD · MM · ABAP · CPI · BASIS",
    ],
    differentiator:
      "A tailored GROW with SAP rollout enabling a positive customer experience across 130 countries and an 18% manpower cost reduction over a 12-month implementation.",
  },
  {
    slug: "edtech-unicorn",
    client: "Indian EdTech Unicorn",
    named: false,
    industry: "IT & Professional Services",
    sapPath: "GROW",
    featuredSolution: "GROW with SAP Public Cloud",
    employees: "1,000+",
    region: "India (105 cities)",
    scenario:
      "India's leading EdTech unicorn democratises education at scale — reaching 98% of the country's pin codes with 3+ crore app downloads and 55+ lakh paid students across online, offline and hybrid platforms.",
    benefits: [
      "Scalable infrastructure handling 100,000+ student transactions daily",
      "Cloud integration with AWS S3 for unified online + offline sales booking",
      "Predictive dashboards for revenue-recognition insight",
      "Custom upload programmes eliminating repetitive manual entry",
    ],
    solution: ["Finance · Consolidation", "Sourcing & Procurement", "Sales", "Unified reporting · IRN & E-Way Bill"],
    differentiator:
      "A centralised package delivering consolidated financial close, unified compliance dashboards and scalable cloud infrastructure for continued hyper-growth.",
  },
  {
    slug: "triveni-turbines",
    client: "Triveni Turbines",
    named: true,
    industry: "Metals, Mining & Heavy Engineering",
    sapPath: "RISE",
    featuredSolution: "ECC → S/4HANA on RISE (Azure)",
    employees: "1,000+",
    region: "80+ countries",
    scenario:
      "A leading OEM of steam turbines up to 100 MWe serving power generation across sugar, steel, distillery, biomass, pulp & paper, palm oil, IPP and chemicals. Brownfield migration to RISE with SAP on Azure delivered in 5 months.",
    summary:
      "Triveni Turbines, a leading OEM of steam turbines up to 100 MWe, completed a brownfield migration to RISE with SAP on Azure in 5 months.",
    benefits: [
      "Unified domestic and export procurement for cost optimisation",
      "End-to-end traceability for recall management",
      "Accurate demand forecasting and supply chain planning",
      "Real-time equipment health visibility for production planning",
    ],
    solution: [
      "S/4HANA 2022",
      "RISE Private Cloud (Azure)",
      "Brownfield conversion",
      "Quality, Production, PP, MM, SD",
      "10 global offices",
    ],
    differentiator:
      "Deep RISE migration expertise and manufacturing-centric landscape understanding across UK, South Africa, Dubai, India, Bangkok and Indonesia.",
  },
  {
    slug: "kenya-railways",
    client: "Kenya Railways",
    named: true,
    industry: "Government & Public Enterprises (PSUs)",
    sapPath: "ECC",
    featuredSolution: "Legacy → SAP ECC 6.3 (fresh implementation)",
    employees: "3,000+",
    region: "Kenya & East Africa",
    scenario:
      "A State Corporation under the Ministry of Transport, established in 1978, operating the 930 km Mombasa–Kisumu mainline and a 2,778 km network. A 10-month fresh implementation migrated from legacy to SAP ECC 6.3.",
    summary:
      "Kenya Railways moved from legacy systems to SAP ECC 6.3 in a 10-month fresh implementation, streamlining operations for a national rail operator.",
    benefits: [
      "Streamlined transport management across Kenya and East Africa",
      "New processes tailored for government: Finance, Procurement, Sales, HR",
      "SAP workflows enabling transparency in a controlled environment",
      "Improved inventory visibility, procurement and distribution",
    ],
    solution: [
      "SAP ECC 6.3",
      "Greenfield from legacy",
      "FI, MM, SD, PP, HR",
      "10-month delivery",
      "Government stakeholder reporting",
    ],
    differentiator:
      "Landscape design, sizing and meticulous technical migration tailored to a national rail operator — streamlining operations and stakeholder reporting.",
  },
  {
    slug: "aptransco",
    client: "APTRANSCO",
    named: true,
    industry: "Government & Public Enterprises (PSUs)",
    sapPath: "AMS",
    featuredSolution: "ECC → S/4HANA Migration · 3-year AMS",
    employees: "1,000+",
    region: "Andhra Pradesh, India",
    scenario:
      "Andhra Pradesh Power Transmission Corporation engaged In2IT EBS for a three-year onsite application-management engagement to stabilise a critical ERP backbone.",
    summary:
      "Andhra Pradesh Power Transmission Corporation engaged In2IT EBS for a three-year onsite AMS engagement that kept a critical ERP backbone stable.",
    benefits: [
      "Reduced incident resolution time by 40% through robust ticket management",
      "Event-monitoring tools significantly reduced unplanned outages",
      "Intuitive SAP Fiori apps drove higher user adoption",
      "SAP BW/BOBJ integration for real-time decision-making insight",
    ],
    solution: ["ECC → S/4HANA migration", "24×7 AMS", "SAP Fiori / SAPUI5", "Event monitoring", "BW/BOBJ analytics"],
    differentiator:
      "Over three years, the AMS engagement maintained uninterrupted operations, optimised performance and aligned ERP with organisational objectives.",
  },
  {
    slug: "delhi-transco",
    client: "Delhi Transco Limited",
    named: true,
    industry: "Government & Public Enterprises (PSUs)",
    sapPath: "AMS",
    featuredSolution: "SAP AMS · Multi-Module",
    employees: "1,800+",
    region: "Delhi, India",
    scenario:
      "Annual maintenance support across the SAP ERP estate — resolving downtime, automating legacy processes and adapting to evolving regulatory standards.",
    summary:
      "Annual maintenance support across Delhi Transco Limited's SAP ERP estate — resolving downtime, automating legacy processes and keeping operations running.",
    benefits: [
      "99.9% system availability for critical business processes",
      "Workflows accelerated by 30% via integration and Fiori enhancements",
      "Reduced operational costs through fewer manual errors",
      "User adoption improved by 40% via extensive training",
    ],
    solution: [
      "SAP AMS (multi-module)",
      "Workflow automation",
      "Fiori enhancements",
      "Regulatory compliance",
      "Training & adoption",
    ],
    differentiator:
      "AMS services enabled uninterrupted operations, cost efficiencies and ERP aligned to organisational goals — improving service delivery and stakeholder satisfaction.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}

/** Public proof fails closed until written consent is recorded. */
export const publicCaseStudies = clientEvidenceApproved ? caseStudies : caseStudies.filter((study) => !study.named);
