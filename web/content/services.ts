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
  image: string;
  /** Describes the photograph for anyone who cannot see it; several carry burnt-in wordmarks. */
  imageAlt: string;
};

export const services: ServiceCard[] = [
  {
    slug: "rise-with-sap",
    name: "RISE with SAP",
    blurb:
      "SAP S/4HANA is a real-time enterprise resource management suite for digital business, built on the in-memory SAP HANA platform and deployable on-premise, in the cloud or hybrid.",
    href: "/services/rise-with-sap/",
    image: "/services/rise-with-sap.jpg",
    imageAlt: "A desk running S/4HANA dashboards, captioned RISE with SAP — Business Transformation as a Service",
  },
  {
    slug: "sap-successfactors",
    name: "SAP SuccessFactors",
    blurb:
      "The SAP SuccessFactors HXM Suite provides cloud-based solutions for core HR and payroll, talent management and the everyday experience of working in your organisation.",
    href: "/services/sap-successfactors/",
    image: "/services/sap-successfactors.jpg",
    imageAlt: "A pen resting on printed bar charts and graphs",
  },
  {
    slug: "sap-sac",
    name: "SAP SAC",
    blurb:
      "SAP Analytics Cloud combines business intelligence, enterprise planning and augmented analytics in one solution on SAP Business Technology Platform, so reporting and planning stop living apart.",
    href: "/services/sap-sac/",
    image: "/services/sap-analytics-cloud.jpg",
    imageAlt: "A hand reaching into a field of figures and rising bars, captioned SAP Analytics Cloud",
  },
  {
    slug: "grow-with-sap",
    name: "Grow with SAP",
    blurb:
      "S/4HANA Public Cloud on pre-configured industry processes — a fit-to-standard path for the mid-market and for net-new business units, on a quarterly release cadence.",
    href: "/services/sap-grow-fast/",
    image: "/services/grow-with-sap.jpg",
    imageAlt: "Terraced green hillside planting, captioned GROW with SAP",
  },
  {
    slug: "other-enterprise-solutions",
    name: "Other Enterprise Solutions",
    blurb:
      "Enterprises keep changing with the market. We help you plan, implement and customise the leading platforms — Oracle, Microsoft and SAP — around what the organisation needs next.",
    href: "/services/other-enterprise-solutions/",
    image: "/services/other-enterprise-solutions.jpg",
    imageAlt: "Four pairs of hands fitting jigsaw pieces together on a table",
  },
  {
    slug: "data-analytics-ai",
    name: "Data Analytics & AI",
    blurb:
      "Structured, unstructured and semi-structured data is rising in volume faster than anyone can read it. Business analytics and intelligence turn that variety into answers you can act on.",
    href: "/services/data-analytics-ai/",
    image: "/services/data-analytics-ai.jpg",
    imageAlt: "A desktop monitor filled with analytics dashboards in an office",
  },
  {
    slug: "adms",
    name: "Application Development & Maintenance Services (ADMS)",
    blurb:
      "Building and maintaining the software a business runs on — development, integration, maintenance and support across both modern and legacy application estates.",
    href: "/services/application-development-maintenance-services-adms/",
    image: "/services/adms.jpg",
    imageAlt: "Two people sketching mobile app wireframes on paper at a desk",
  },
];
