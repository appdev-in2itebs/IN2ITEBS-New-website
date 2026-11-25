/**
 * "Services We Offer" — the homepage service grid carried over from the existing site.
 *
 * The set, the names and the order are taken one-for-one from the live in2itebs.com homepage
 * (checked 2026-09-17): RISE with SAP, SAP SuccessFactors, SAP SAC, Grow with SAP, Other
 * Enterprise Solutions, Data Analytics & AI, and ADMS. The card photographs are the same images
 * that section uses, pulled from /wp-content/uploads and stored in /public/services.
 *
 * Two things are deliberately not 1:1:
 *
 * 1. The live cards print a WordPress excerpt cut mid-word ("…advanced in-memory platfor.."). The
 *    blurbs here are the same sentences finished off from the destination page each card links to,
 *    so nothing ships truncated.
 * 2. `href` points at this site's page for the service rather than the old WordPress URL. Each one
 *    is also where that old URL now redirects to — see content/redirects.mjs, which is the single
 *    source of truth for that mapping. "Grow with SAP" is a dead card on the live site (an image
 *    and a title with no link); it leads to the SAP GROW Fast page here, which is what the live
 *    site's own nav means by it.
 */

export type ServiceCard = {
  slug: string;
  /** The service name exactly as the live homepage prints it. */
  name: string;
  blurb: string;
  /** This site's page for the service — the destination its old URL redirects to. */
  href: string;
  /** Describes the photograph for anyone who cannot see it; several carry burnt-in wordmarks. */
  heroImage?: string;
};

/**
 * NOTE ON `href` VS `slug`, 18 November 2026.
 *
 * Every `href` below points at the page's canonical URL. The `slug` beside it is the PRE-RESTRUCTURE
 * name and is kept because it still addresses the artwork in public/services/ — they are no longer
 * the same string and must not be re-derived from one another.
 *
 * They used to match, which meant all seven cards in the homepage service grid linked at old URLs
 * and every visitor who clicked one paid a 308 redirect. It resolved, so no crawl of the sitemap
 * ever saw it: the sitemap lists canonical routes, and a link to a non-canonical one is invisible
 * to that check by construction. tests/links.test.ts now fails on it.
 */
export const services: ServiceCard[] = [
  {
    slug: "rise-with-sap",
    heroImage: "/generated/service-rise-s4hana-telemetry.webp",
    name: "RISE with SAP",
    blurb:
      "SAP S/4HANA is a real-time enterprise resource management suite for digital business, built on the in-memory SAP HANA platform and deployable on-premise, in the cloud or hybrid.",
    href: "/services/rise-s4hana/",
  },
  {
    slug: "sap-successfactors",
    heroImage: "/generated/service-successfactors-telemetry.webp",
    name: "SAP SuccessFactors",
    blurb:
      "The SAP SuccessFactors HXM Suite provides cloud-based solutions for core HR and payroll, talent management and the everyday experience of working in your organisation.",
    href: "/services/successfactors/",
  },
  {
    slug: "sap-sac",
    heroImage: "/generated/service-data-engineering-telemetry.webp",
    name: "SAP SAC",
    blurb:
      "SAP Analytics Cloud combines business intelligence, enterprise planning and augmented analytics in one solution on SAP Business Technology Platform, so reporting and planning stop living apart.",
    href: "/services/data-engineering-analytics/",
  },
  {
    slug: "grow-with-sap",
    heroImage: "/generated/service-converged-pulse-telemetry.webp",
    name: "Grow with SAP",
    blurb:
      "S/4HANA Public Cloud on pre-configured industry processes — a fit-to-standard path for the mid-market and for net-new business units, on a quarterly release cadence.",
    href: "/services/converged-pulse/",
  },
  {
    slug: "other-enterprise-solutions",
    heroImage: "/generated/service-enterprise-platforms-telemetry.webp",
    name: "Other Enterprise Solutions",
    // "Oracle, Microsoft and SAP" removed 19 November 2026 — see content/home-hero.ts. We hold no
    // designation from Oracle or Microsoft Dynamics and do not implement them; naming them beside
    // SAP in a list of platforms we "plan, implement and customise" said otherwise. The card keeps
    // its place: integrating to a system we do not sell is real work, and saying which is which is
    // the distinction /about/partnerships/ already draws.
    blurb:
      "Enterprises keep changing with the market. We implement the platforms we are designated for and integrate to the systems around them — and the capability register says which is which, line by line.",
    href: "/services/enterprise-platforms/",
  },
  {
    slug: "data-analytics-ai",
    heroImage: "/generated/service-digital-data-ai-telemetry.webp",
    name: "Data Analytics & AI",
    blurb:
      "Structured, unstructured and semi-structured data is rising in volume faster than anyone can read it. Business analytics and intelligence turn that variety into answers you can act on.",
    href: "/services/data-engineering-analytics/",
  },
  {
    slug: "adms",
    heroImage: "/generated/service-application-engineering-telemetry.webp",
    name: "Application Development & Maintenance Services (ADMS)",
    blurb:
      "Building and maintaining the software a business runs on — development, integration, maintenance and support across both modern and legacy application estates.",
    href: "/services/application-engineering/",
  },
];
