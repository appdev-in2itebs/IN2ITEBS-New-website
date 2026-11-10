import type { NavItem, PracticeSummary } from "./types";
import { servicesMenu } from "./legacy-services";

/** Three-pillar architecture (Content Blueprint, Deck 2). */

// SAP flagship sub-pages (the deep-dive set).
export const sapChildren: NavItem[] = [
  { label: "SAP Overview", href: "/sap-enterprise-solutions/" },
  { label: "RISE with SAP", href: "/sap-enterprise-solutions/rise-with-sap/" },
  { label: "SAP GROW Fast", href: "/sap-enterprise-solutions/grow-fast/" },
  { label: "RISE vs GROW", href: "/sap-enterprise-solutions/rise-vs-grow/" },
  { label: "Migrations", href: "/sap-enterprise-solutions/migrations/" },
  { label: "SuccessFactors / HXM", href: "/sap-enterprise-solutions/successfactors/" },
  { label: "Health Check 360", href: "/sap-enterprise-solutions/health-check-360/" },
  { label: "Concur", href: "/sap-enterprise-solutions/concur/" },
  { label: "Ariba", href: "/sap-enterprise-solutions/ariba/" },
  { label: "Joule", href: "/sap-enterprise-solutions/joule/" },
  { label: "Clean Core / BTP", href: "/sap-enterprise-solutions/clean-core/" },
  { label: "Syniti Data Management", href: "/sap-enterprise-solutions/syniti/" },
  { label: "SAP Analytics Cloud", href: "/sap-enterprise-solutions/analytics-cloud/" },
  { label: "ABAP Factory", href: "/sap-enterprise-solutions/abap-factory/" },
];

/** Pillars used on hub pages + the mega-menu. */
export const pillars: PracticeSummary[] = [
  {
    slug: "platform-services",
    name: "Platform Services",
    tagline: "SAP, SuccessFactors, Salesforce, Workday, Oracle and Microsoft: full lifecycle, one accountable partner.",
    href: "/platform-services/",
  },
  {
    slug: "advisory-services",
    name: "Advisory Services",
    tagline: "Consulting-led transformation — strategy, enterprise architecture, AI strategy and program governance.",
    href: "/advisory/",
  },
  {
    slug: "digital-data-ai",
    name: "Digital, Data & AI",
    tagline:
      "Engineering-led transformation — application engineering, AI & automation, data & analytics, integration & cloud.",
    href: "/digital-data-ai/",
  },
  {
    slug: "delivery-excellence",
    name: "Delivery Excellence",
    tagline: "FastForward methodology, development factory and global AMS bench behind every engagement.",
    href: "/delivery-excellence/",
  },
];

// Practice cards used on the Platform Services hub.
export const platformPractices: PracticeSummary[] = [
  {
    slug: "sap",
    name: "SAP Enterprise Solutions",
    tagline: "SAP Gold Partner across S/4HANA, SuccessFactors, Ariba, Concur, analytics and BTP.",
    href: "/sap-enterprise-solutions/",
  },
  {
    slug: "salesforce",
    name: "Salesforce",
    tagline: "Customer experience across Sales, Service, Marketing, Commerce and Industry Clouds.",
    href: "/salesforce/",
  },
  {
    slug: "workday",
    name: "Workday",
    tagline: "HR and finance transformation on a single cloud platform.",
    href: "/workday/",
  },
  {
    slug: "successfactors",
    name: "SAP SuccessFactors",
    tagline: "HR transformation across core HR, talent and workforce experience.",
    href: "/sap-enterprise-solutions/successfactors/",
  },
  {
    slug: "oracle",
    name: "Oracle",
    tagline: "Enterprise applications, Oracle Cloud ERP, JD Edwards and database services.",
    href: "/oracle/",
  },
  {
    slug: "microsoft",
    name: "Microsoft",
    tagline: "Dynamics 365, Microsoft 365, SharePoint and Azure services.",
    href: "/microsoft/",
  },
];

/** The "What We Do" mega-menu — pillar-grouped with nested sub-items. */
export const whatWeDoMenu: NavItem[] = [
  {
    label: "Platform Services",
    href: "/platform-services/",
    children: [
      { label: "SAP Enterprise Solutions", href: "/sap-enterprise-solutions/", children: sapChildren },
      { label: "Salesforce", href: "/salesforce/" },
      { label: "Workday", href: "/workday/" },
      { label: "SAP SuccessFactors", href: "/sap-enterprise-solutions/successfactors/" },
      { label: "Oracle", href: "/oracle/" },
      { label: "Microsoft", href: "/microsoft/" },
    ],
  },
  {
    label: "Advisory Services",
    href: "/advisory/",
    children: [
      { label: "Transformation Advisory", href: "/advisory/#transformation-advisory" },
      { label: "Strategy & Governance", href: "/advisory/#strategy-governance" },
      { label: "Enterprise Architecture", href: "/advisory/#enterprise-architecture" },
      { label: "Change & Assurance", href: "/advisory/#change-assurance" },
    ],
  },
  {
    label: "Digital, Data & AI",
    href: "/digital-data-ai/",
    children: [
      { label: "Application Engineering", href: "/digital-data-ai/application-engineering/" },
      { label: "AI & Automation", href: "/digital-data-ai/ai-automation/" },
      { label: "Data & Analytics", href: "/digital-data-ai/#data-analytics" },
      { label: "Integration & Cloud", href: "/digital-data-ai/#integration-cloud" },
    ],
  },
  {
    label: "Delivery Excellence",
    href: "/delivery-excellence/",
    children: [
      { label: "FastForward Methodology", href: "/delivery-excellence/#fastforward" },
      { label: "AMS Transition", href: "/delivery-excellence/#transition" },
      { label: "Development Factory", href: "/delivery-excellence/#factory" },
    ],
  },
];

/** The Industries dropdown, item for item as the existing site's menu lists it, each to that page. */
export const industriesMenu: NavItem[] = [
  { label: "Automobiles", href: "/industries/automobiles/" },
  { label: "FMCG", href: "/industries/fmcg/" },
  { label: "Manufacturing", href: "/industries/manufacturing/" },
  { label: "Textiles", href: "/industries/textiles/" },
  { label: "Professional Services", href: "/industries/professional-services/" },
  { label: "Heavy Engineering", href: "/industries/heavy-engineering/" },
  { label: "Retail & Ecommerce", href: "/industries/retail-ecommerce/" },
  { label: "Energy and Utilities", href: "/industries/energy-and-utilities/" },
  { label: "Chemical & Fertilizers", href: "/industries/chemical-fertilizers/" },
  { label: "Banking, Financial Services & Insurance", href: "/industries/banking/" },
  { label: "Government & Public Enterprises", href: "/industries/government/" },
  { label: "Pharma, Healthcare & Life Science", href: "/industries/healthcare-life-science/" },
  { label: "Media & Telecommunications", href: "/industries/telecom/" },
  { label: "Engineering & Constructions (ECNO)", href: "/industries/engineering-constructions-ecno/" },
];

/** The Partners dropdown, in the existing site's order; each goes to that partner's own page. */
export const partnersMenu: NavItem[] = [
  { label: "SAP", href: "/partners/sap/" },
  { label: "SAP Qualtrics", href: "/partners/sap-qualtrics/" },
  { label: "SAP Concur", href: "/partners/sap-concur/" },
  { label: "Microsoft", href: "/partners/microsoft/" },
  { label: "Oracle", href: "/partners/oracle/" },
  { label: "Open Text", href: "/partners/open-text/" },
  { label: "IBM", href: "/partners/ibm/" },
  { label: "Newgen", href: "/partners/newgen/" },
  { label: "HP", href: "/partners/hp/" },
  { label: "AWS", href: "/partners/aws/" },
];

/**
 * The primary navigation, rebuilt on 2026-09-19 to the existing in2itebs.com menu: Home, Services
 * (its eight-group mega-menu), Industries, Partners, About, Contact and Career, with the same
 * items under each. The landing page itself is untouched; only the header follows the old site.
 */
export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services/", children: servicesMenu },
  { label: "Industries", href: "/industries/", children: industriesMenu },
  { label: "Partners", href: "/partners/", children: partnersMenu },
  {
    label: "About",
    href: "/about/",
    children: [
      { label: "Who We Are?", href: "/about/who-we-are/" },
      { label: "Our Leadership", href: "/about/our-leadership/" },
      { label: "Accreditation", href: "/accreditation-awards/" },
      { label: "Case Studies", href: "/case-studies/" },
      { label: "Blogs & Articles", href: "/insights/" },
    ],
  },
  { label: "Contact", href: "/contact/" },
  {
    label: "Career",
    href: "/careers/",
    children: [
      { label: "Our Culture", href: "/careers/our-culture/" },
      { label: "Events & Celebrations", href: "/careers/events-celebrations/" },
      { label: "Current Openings", href: "/careers/current-openings/" },
    ],
  },
];

// Back-compat: some existing components import `practices`.
export const practices = platformPractices;

export const footerNav = {
  company: [
    { label: "Who We Are", href: "/about/" },
    { label: "Why In2IT EBS", href: "/why-in2it-ebs/" },
    { label: "Our Awards", href: "/accreditation-awards/" },
    { label: "Industries", href: "/industries/" },
    { label: "Clients & Case Studies", href: "/case-studies/" },
    { label: "Partners & Ecosystem", href: "/partners/" },
    { label: "Insights", href: "/insights/" },
    { label: "Careers", href: "/careers/" },
  ],
  practices: [
    { label: "Platform Services", href: "/platform-services/" },
    { label: "SAP Enterprise Solutions", href: "/sap-enterprise-solutions/" },
    { label: "Advisory Services", href: "/advisory/" },
    { label: "Digital, Data & AI", href: "/digital-data-ai/" },
    { label: "Delivery Excellence", href: "/delivery-excellence/" },
  ],
  legal: [
    { label: "Privacy Notice", href: "/legal/privacy-notice/" },
    { label: "Privacy Policy", href: "/legal/privacy-policy/" },
    { label: "Disclaimer", href: "/legal/disclaimer/" },
  ],
};
