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
    label: "Enterprise transformation, under control",
    heading: ["Change with confidence.", "Run without compromise."],
    body: "In2IT EBS connects enterprise platforms, digital engineering and managed operations through one accountable transformation partner.",
    cta: { href: "/contact/", label: "Start a conversation" },
    secondary: { href: "/what-we-do/", label: "Explore our services" },
  },
  {
    id: "sap",
    frames: "slide-2",
    label: "SAP enterprise solutions",
    heading: ["Transform your enterprise with SAP."],
    body: "From S/4HANA and cloud migration to SuccessFactors, analytics and managed services. Connect the platform to the way your business operates.",
    cta: { href: "/sap-enterprise-solutions/", label: "Explore SAP solutions" },
    secondary: { href: "/contact/", label: "Talk to us" },
  },
  {
    id: "applications",
    frames: "slide-3",
    label: "Application development & maintenance",
    heading: ["Applications built around your business."],
    body: "Design, build, integrate and maintain business applications, with engineering and ongoing support connected from the start.",
    cta: { href: "/digital-data-ai/application-engineering/", label: "Explore application services" },
    secondary: { href: "/contact/", label: "Talk to us" },
  },
  {
    id: "platforms",
    frames: "slide-4",
    label: "People, finance & customer platforms",
    heading: ["Connect people, processes and performance."],
    body: "Explore SuccessFactors, Workday, Salesforce, Oracle and Microsoft practices for the systems your teams rely on every day.",
    cta: { href: "/platform-services/", label: "Explore our platform practices" },
    secondary: { href: "/contact/", label: "Talk to us" },
  },
  {
    id: "data-ai",
    frames: "slide-5",
    label: "Cloud, data & AI",
    heading: ["Turn enterprise data into everyday decisions."],
    body: "Bring data, analytics, integration and AI into the flow of work, with architecture and delivery grounded in your business priorities.",
    cta: { href: "/digital-data-ai/", label: "Explore data & AI services" },
    secondary: { href: "/contact/", label: "Talk to us" },
  },
];
