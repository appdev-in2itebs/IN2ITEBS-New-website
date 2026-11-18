/**
 * The homepage hero's slides: the copy over each clip of footage. Editable in /admin (Website
 * content → Homepage hero, or the visual editor); these are the words the site ships with.
 */
export type HeroSlide = {
  id: string;
  label: string;
  heading: string[];
  body: string;
  cta: { href: string; label: string };
  secondary: { href: string; label: string };
  /** Which frame sequence in content/hero-frames.ts plays behind this slide (slide-1 … slide-5). */
  frames: string;
};

export const homeHeroSlides: HeroSlide[] = [
  {
    id: "brand",
    frames: "slide-1",
    label: "SAP for asset-heavy and regulated India",
    heading: ["Change with confidence.", "Run without compromise."],
    // Rewritten 18 November 2026. The previous body described a category — "connects enterprise
    // platforms, digital engineering and managed operations through one accountable
    // transformation partner" — which is true of every firm in this market and names nobody. The
    // replacement names four sectors, names the condition that unites them (somebody is always
    // checking), and puts a number a reader can verify in the first screen.
    body: "We run SAP for mining, power, manufacturing and the public sector — the estates where an audit, a tender or a regulator is always watching. 500+ people, four delivery centres, one accountable partner.",
    cta: { href: "/contact/", label: "Talk to us" },
    secondary: { href: "/services/", label: "See our services" },
  },
  {
    id: "sap",
    frames: "slide-2",
    label: "SAP enterprise solutions",
    heading: ["Transform your enterprise with SAP."],
    body: "From S/4HANA and cloud migration to SuccessFactors, analytics and managed services. Connect the platform to the way your business operates.",
    cta: { href: "/services/sap/", label: "See our SAP practice" },
    secondary: { href: "/contact/", label: "Talk to us" },
  },
  {
    id: "applications",
    frames: "slide-3",
    label: "Application development & maintenance",
    heading: ["Applications built around your business."],
    body: "Design, build, integrate and maintain business applications, with engineering and ongoing support connected from the start.",
    cta: { href: "/services/application-engineering/", label: "See application services" },
    secondary: { href: "/contact/", label: "Talk to us" },
  },
  {
    id: "platforms",
    frames: "slide-4",
    label: "People, finance & customer platforms",
    heading: ["Connect people, processes and performance."],
    body: "Explore SuccessFactors, Workday, Salesforce, Oracle and Microsoft practices for the systems your teams rely on every day.",
    cta: { href: "/services/enterprise-platforms/", label: "See our platform practices" },
    secondary: { href: "/contact/", label: "Talk to us" },
  },
  {
    id: "data-ai",
    frames: "slide-5",
    label: "Cloud, data & AI",
    heading: ["Turn enterprise data into everyday decisions."],
    body: "Bring data, analytics, integration and AI into the flow of work, with architecture and delivery grounded in your business priorities.",
    cta: { href: "/services/digital-data-ai/", label: "See data and AI services" },
    secondary: { href: "/contact/", label: "Talk to us" },
  },
];
