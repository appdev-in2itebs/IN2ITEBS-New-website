import type { NavItem } from "./types";
import type { HeroImageKey } from "@/components/sections/hero-media";

/**
 * SERVICE PAGES — the approved architecture, November 2026.
 *
 * Seventeen pages: three pillar hubs and fourteen service pages. Down from forty-six.
 *
 * URLs are FLAT — /services/<slug>/. The pillar groups these pages in the menu and on the hub
 * page; it is not a path segment. Renaming or regrouping a pillar later therefore moves no URL.
 *
 * The rule that keeps this list from growing: we publish a page only where there is a named offer
 * of our own, or a capability we can evidence with a client engagement. SAP describes RISE, GROW
 * and S/4HANA better than we will, and a page that restates a vendor's product is a page a buyer
 * has already read. Concur, Analytics Cloud, BTP, Joule, Ariba and the rest are described inside
 * the pages below rather than given pages of their own.
 *
 * Oracle, ServiceNow, Microsoft Dynamics and Adobe do not appear. We hold no designation from any
 * of them and we do not implement them.
 */

export type ServiceIconKey =
  | "boxes"
  | "rocket"
  | "trending-up"
  | "receipt"
  | "prism"
  | "bar-chart"
  | "users"
  | "cloud"
  | "map"
  | "cloud-upload"
  | "server"
  | "layers"
  | "database"
  | "grid"
  | "file-text"
  | "briefcase"
  | "shield"
  | "shield-alert"
  | "lock"
  | "key"
  | "sparkles"
  | "code"
  | "wrench"
  | "git-branch"
  | "brain"
  | "line-chart"
  | "cpu"
  | "hard-drive"
  | "link"
  | "bot"
  | "search"
  | "check-circle"
  | "settings"
  | "eye"
  | "target"
  | "lightbulb"
  | "handshake"
  | "globe"
  | "monitor"
  | "message-square"
  | "mail"
  | "table"
  | "presentation"
  | "folder"
  | "smartphone"
  | "layout"
  | "building"
  | "zap"
  | "refresh"
  | "heart";

export interface ServiceSection {
  title: string;
  body?: string;
  bullets?: string[];
  icon?: ServiceIconKey;
  iconImage?: string;
  href?: string;
}

export interface ServicePage {
  slug: string;
  name: string;
  title?: string;
  group: string;
  intro: string[];
  introHeading?: string;
  sections: ServiceSection[];
  layout?: "cards" | "steps" | "list";
  sectionsHeading?: string;
  closing?: string[];
  image?: { src: string; alt: string };
  /**
   * A full-width explanatory diagram, shown between the overview and the sections. `src` is a file
   * in /public/diagrams/. The alt text must carry the diagram's point, not name the picture — see
   * components/sections/diagram-band.tsx.
   */
  diagram?: { src: string; alt: string; caption?: string };
  heroObject?: HeroImageKey;
  icon: ServiceIconKey;
  metaTitle?: string;
  metaDescription: string;
  sourceUrl: string;
}

export interface ServiceGroup {
  slug: string;
  name: string;
  href: string;
  icon: ServiceIconKey;
  blurb: string;
  items: NavItem[];
}

const svc = (slug: string) => `/services/${slug}/`;

/** Three pillars. Categories, not vendors — each absorbs a new platform without renaming. */
export const serviceGroups: ServiceGroup[] = [
  {
    slug: "enterprise-platforms",
    name: "Enterprise Platforms",
    href: svc("enterprise-platforms"),
    icon: "boxes",
    blurb: "The packaged platforms your core business processes run on — implemented, migrated, extended and run.",
    items: [
      { label: "SAP", href: svc("sap") },
      { label: "GROW Fast", href: svc("grow-fast") },
      { label: "ECC Prism", href: svc("ecc-prism") },
      { label: "RISE and S/4HANA", href: svc("rise-s4hana") },
      { label: "SuccessFactors", href: svc("successfactors") },
      { label: "Smart Meter to Cash", href: svc("smart-meter-to-cash") },
      { label: "Managed Services", href: svc("managed-services") },
      { label: "Salesforce", href: svc("salesforce") },
      { label: "Workday", href: svc("workday") },
    ],
  },
  {
    slug: "advisory",
    name: "Advisory",
    href: svc("advisory"),
    icon: "lightbulb",
    blurb: "Transformation strategy, enterprise architecture, governance, risk and data protection.",
    items: [],
  },
  {
    slug: "digital-data-ai",
    name: "Digital, Data & AI",
    href: svc("digital-data-ai"),
    icon: "cpu",
    blurb: "Engineering around and beyond the packaged core — applications, data, AI and the integration spine.",
    items: [
      { label: "Application Engineering", href: svc("application-engineering") },
      { label: "The Application Estate Review", href: svc("application-estate-review") },
      { label: "Data Engineering and Analytics", href: svc("data-engineering-analytics") },
      { label: "Enterprise Data Management", href: svc("enterprise-data-management") },
      { label: "Applied AI", href: svc("applied-ai") },
    ],
  },
];

/** Menu column layout for the mega-menu. */
export const serviceMenuColumns: string[][] = [["enterprise-platforms"], ["advisory", "digital-data-ai"]];

export const servicesMenu: NavItem[] = serviceGroups.map((group) => ({
  label: group.name,
  href: group.href,
  children: group.items,
}));

export const servicePages: ServicePage[] = [
  // ══════════════════════════════════════════════════ PILLAR HUBS
  {
    slug: "enterprise-platforms",
    name: "Enterprise Platforms",
    title: "The platforms your business runs on",
    group: "enterprise-platforms",
    icon: "boxes",
    sourceUrl: "https://www.in2itebs.com/services/enterprise-platforms/",
    metaTitle: "Enterprise Platforms — SAP, Salesforce, Workday",
    metaDescription:
      "We implement, migrate, extend and run the packaged platforms that carry your core business processes. SAP is our deepest practice; it is not our only one.",
    intro: [
      "Packaged platforms are bought once and lived with for a decade. The decision that matters is not which product you choose — it is who is still accountable in year three, when the consultants have gone and the system has to close the books.",
    ],
    sectionsHeading: "What we deliver here",
    sections: [
      {
        title: "SAP",
        icon: "boxes",
        body: "Our deepest practice. S/4HANA and ECC, SuccessFactors and Payroll, Ariba and SRM, BTP and Joule. Implementation, migration, extension and support.",
        href: svc("sap"),
      },
      {
        title: "Salesforce",
        icon: "cloud",
        body: "Implementation and support across Sales, Service and Platform, delivered by a certified Indian team — and integrated properly to the system of record.",
        href: svc("salesforce"),
      },
      {
        title: "Workday",
        icon: "users",
        body: "Implementation and support across HCM and Financials, with the payroll and benefits interfaces that carry most of the operational risk.",
        href: svc("workday"),
      },
      {
        title: "Managed Services",
        icon: "shield",
        body: "The practice that keeps all of it running after go-live. Named severity bands, published response targets, service credits when we miss.",
        href: svc("managed-services"),
      },
    ],
    closing: [
      "Oracle, ServiceNow, Microsoft Dynamics and Adobe do not appear on this site. We do not implement them, and a logo on a page is not a capability. If one of those is the right answer for you, we will say so — it is a short conversation and it costs us nothing to have honestly.",
    ],
  },
  {
    slug: "advisory",
    diagram: {
      src: "/diagrams/p1-accelerators.svg",
      alt: "The accelerators and intellectual property In2IT EBS brings to an engagement, and what each one shortens.",
    },
    name: "Advisory",
    title: "Advisory",
    group: "advisory",
    icon: "lightbulb",
    sourceUrl: "https://www.in2itebs.com/services/advisory/",
    metaTitle: "Advisory — transformation strategy, architecture and governance",
    metaDescription:
      "Transformation strategy, enterprise architecture, governance and data protection — delivered by the people who also build and run the systems.",
    intro: [
      "Advice that is never followed by delivery is a deck. Delivery without advice is an order taker. We do both, which means our recommendations have to survive the moment somebody has to build them.",
    ],
    sectionsHeading: "Where we advise",
    sections: [
      {
        title: "Transformation strategy and governance",
        icon: "target",
        body: "What to change, in what order, and how the programme is governed so that it can be stopped at a defined moment rather than an undefined one.",
      },
      {
        title: "Enterprise architecture",
        icon: "layers",
        body: "The target estate, the route to it, and the application and cloud decisions that follow from it rather than preceding it.",
      },
      {
        title: "Data protection and privacy",
        icon: "lock",
        body: "India's DPDP Act and its equivalents in the markets we operate in — South Africa's POPIA, Kenya's Data Protection Act, Singapore's PDPA and the UAE PDPL.",
      },
      {
        title: "AI governance",
        icon: "shield-alert",
        body: "Where AI is allowed to act, what it may see, who reviews its output, and the evidence an auditor will ask for.",
      },
    ],
    closing: [
      "Each of these is currently delivered inside platform and engineering programmes. Detailed pages follow as each is scoped as a standalone offer.",
    ],
  },
  {
    slug: "digital-data-ai",
    diagram: {
      src: "/diagrams/d1-where-it-sits.svg",
      alt: "Where application engineering, data and AI sit in relation to the SAP core: the channels and users above, the core below, and the layer in between that the two meet in.",
    },
    name: "Digital, Data & AI",
    title: "Digital, Data & AI",
    group: "digital-data-ai",
    icon: "cpu",
    sourceUrl: "https://www.in2itebs.com/services/digital-data-ai/",
    metaTitle: "Digital, Data & AI — application engineering, data and AI",
    metaDescription:
      "Engineering around and beyond the packaged core: applications, the integration spine, data engineering, enterprise data management and applied AI.",
    intro: [
      "An ERP holds the transaction. It does not hold the process. The applications that carry the work to the ERP, and the data that has to agree with it afterwards, are where most of the operational risk actually sits.",
    ],
    sectionsHeading: "What we deliver here",
    sections: [
      {
        title: "Application Engineering",
        icon: "code",
        body: "We design, build, integrate, modernise and support business-critical web, mobile and enterprise applications — and stay accountable for them after go-live.",
        href: svc("application-engineering"),
      },
      {
        title: "The Application Estate Review",
        icon: "search",
        body: "A fixed-scope diagnostic of what you are running, what it costs, what is genuinely at risk, and in what order any of it should change.",
        href: svc("application-estate-review"),
      },
      {
        title: "Data Engineering and Analytics",
        icon: "bar-chart",
        body: "Pipelines, models and reporting that reconcile to the system of record — because a dashboard that disagrees with the ledger is an argument, not an insight.",
        href: svc("data-engineering-analytics"),
      },
      {
        title: "Enterprise Data Management",
        icon: "database",
        body: "Strategy, governance, quality, migration, archiving and managed data operations. Bought as an assessment, a delivery wave, or a managed service.",
        href: svc("enterprise-data-management"),
      },
      {
        title: "Applied AI",
        icon: "brain",
        body: "AI where it moves a number you already report. Delivered inside your data protection policy, with an accountable consultant reviewing every output.",
        href: svc("applied-ai"),
      },
    ],
  },

  // ══════════════════════════════════════════════════ ENTERPRISE PLATFORMS
  {
    slug: "sap",
    diagram: {
      src: "/diagrams/m1-sap-estate.svg",
      alt: "The SAP estate we run: an S/4HANA core surrounded by the people, customer, data and integration layers, with the eleven practices that staff each one.",
    },
    name: "SAP",
    title: "Our deepest practice. Measured, not asserted.",
    group: "enterprise-platforms",
    icon: "boxes",
    sourceUrl: "https://www.in2itebs.com/services/sap/",
    metaTitle: "SAP Gold Partner — S/4HANA, SuccessFactors, Ariba, BTP",
    metaDescription:
      "An SAP Gold Partner with 380+ SAP consultants across eleven practices, delivering S/4HANA and ECC, SuccessFactors and Payroll, Ariba and SRM, BTP and Joule.",
    intro: [
      "Every firm claims SAP depth. Below is ours, as numbers and named modules. If a module is not on this page, we have not configured it in production, and we would rather tell you that than find out together on your project.",
    ],
    sectionsHeading: "The estate we work in",
    sections: [
      {
        title: "The core",
        icon: "server",
        body: "S/4HANA, ECC and Business Suite.",
        bullets: [
          "Finance and Controlling",
          "Materials Management",
          "Sales and Distribution",
          "Production Planning",
          "Quality Management",
          "Plant Maintenance and Asset Management",
          "Project Systems",
          "ABAP and custom development",
        ],
      },
      {
        title: "People",
        icon: "users",
        body: "SuccessFactors, HCM and Payroll.",
        bullets: [
          "Employee Central",
          "Employee Central Payroll",
          "Recruiting and Onboarding",
          "Performance and Goals",
          "Compensation",
          "Learning",
          "Time Management",
          "Employee and Manager Self-Service",
        ],
      },
      {
        title: "Spend and supply",
        icon: "receipt",
        body: "Ariba, SRM and procurement.",
        bullets: [
          "Sourcing",
          "e-Tendering for the public sector",
          "Direct Materials Sourcing",
          "Contract management",
          "Supplier collaboration",
          "SRM to Ariba migration",
        ],
      },
      {
        title: "Platform and data",
        icon: "layers",
        body: "BTP, integration, analytics and AI.",
        bullets: [
          "BTP extensions",
          "Integration Suite",
          "Analytics Cloud",
          "Business Data Cloud",
          "Joule",
          "Basis and security",
          "Fiori user experience",
        ],
      },
    ],
    closing: [
      "Depth is a number and a name. It should not be an adjective anywhere on this site.",
      "Ask us what we cannot do. It is a faster conversation than the other one, and it tells you more.",
    ],
  },
  {
    slug: "grow-fast",
    diagram: {
      src: "/diagrams/m3-grow-fast.svg",
      alt: "The GROW Fast timeline: a fixed scope agreed in weeks one and two, configuration and validation through the middle weeks, and go-live on a date set at the start.",
    },
    name: "GROW Fast",
    title: "A real ERP, on a date you can plan around",
    group: "enterprise-platforms",
    icon: "rocket",
    sourceUrl: "https://www.in2itebs.com/services/grow-fast/",
    metaTitle: "GROW Fast — a packaged SAP GROW implementation",
    metaDescription:
      "A packaged implementation of SAP S/4HANA Cloud Public Edition with a fixed scope, a fixed duration and a fixed price — all three stated before you sign.",
    intro: [
      "GROW Fast is a packaged implementation of SAP S/4HANA Cloud Public Edition with a fixed scope, a fixed duration and a fixed price. All three are stated before you sign, and all three are ours to hold.",
    ],
    sectionsHeading: "The shape of it",
    layout: "steps",
    sections: [
      { title: "Prepare", icon: "check-circle", body: "Access, project team, data templates issued." },
      {
        title: "Explore",
        icon: "search",
        body: "Fit-to-standard against SAP Best Practices. Gaps are decisions, not change requests.",
      },
      { title: "Realize", icon: "settings", body: "Configuration, data load, two test cycles, user training." },
      { title: "Deploy", icon: "rocket", body: "Cutover rehearsal, go-live." },
      {
        title: "Run",
        icon: "shield",
        body: "Hypercare, then handover to managed service or to your own team.",
      },
    ],
    closing: [
      "Who buys this: companies growing faster than their systems. The spreadsheets have stopped being funny, finance is closing the month by hand, and nobody has the appetite for a multi-year programme. The honest answer is that a packaged implementation on standard processes will serve you better, and for considerably less money. The discipline is in accepting the standard process rather than rebuilding your current one inside a new system.",
      "What is not included: processes outside the published scope, custom development beyond the stated extension allowance, and integration to systems not on the list. None of that is a trap — it is the reason the price can be fixed at all, and anything on it can be added as a priced change request with its own date, agreed in writing before any work starts.",
    ],
  },
  {
    slug: "ecc-prism",
    diagram: {
      src: "/diagrams/m5-ecc-prism-stages.svg",
      alt: "ECC Prism in three stages — assess the estate, decide the disposition, then move — each one priced and sellable on its own, with a decision point between each.",
    },
    name: "ECC Prism",
    title: "You do not have to move yet. You do have to know when.",
    group: "enterprise-platforms",
    icon: "prism",
    sourceUrl: "https://www.in2itebs.com/services/ecc-prism/",
    metaTitle: "ECC Prism — the SAP ECC maintenance decision, assessed",
    metaDescription:
      "2027, 2030 or 2035 — most ECC customers do not know which maintenance date applies to them. ECC Prism establishes which one, gets the estate safe to it, and runs it.",
    intro: [
      "Most ECC customers believe they are facing a single deadline. They are facing three, they are eligible for only one of them, and almost nobody has checked which.",
    ],
    sectionsHeading: "Three stages, each one sellable on its own",
    layout: "steps",
    sections: [
      {
        title: "Assess",
        icon: "search",
        body: "Which maintenance door you are actually eligible for, what your custom code and database position allow, and what the real risk is in each year between now and your chosen date.",
        bullets: [
          "Eligibility finding — 2027, 2030 or 2035",
          "Custom code and Z-object inventory",
          "Security and compliance exposure, year by year",
          "A costed comparison against migrating now",
        ],
      },
      {
        title: "Remediate",
        icon: "wrench",
        body: "We get the estate into a state where it can run safely to the date you chose, without pretending the date is further away than it is.",
        bullets: [
          "Security and patch remediation",
          "Custom code rationalisation",
          "Interface and integration hardening",
          "Documentation the next partner can actually use",
        ],
      },
      {
        title: "Run",
        icon: "shield",
        body: "We operate and support the estate to the agreed date under the same service levels as any other managed service, with the migration decision reviewed every year rather than deferred indefinitely.",
        bullets: [
          "Application and Basis support",
          "Statutory and regulatory updates",
          "Annual migration-readiness review",
          "Exit on three months' notice, documented",
        ],
      },
    ],
    closing: [
      "Why we built this: because the alternative being offered to most ECC customers is a migration they are not ready to fund, on a timetable set by somebody else's product roadmap rather than by their own business.",
      "That is not an argument against moving to S/4HANA. We migrate clients to S/4HANA and we think most ECC estates should get there. It is an argument against moving badly, at the wrong moment, because a date was presented as an emergency. A migration taken on an informed timetable is a better migration.",
      "You can buy the assessment on its own, act on it yourself, and never speak to us again. That is a real option and we price it as one.",
    ],
  },
  {
    slug: "rise-s4hana",
    diagram: {
      src: "/diagrams/m2-achieve.svg",
      alt: "SAP's ACHIEVE delivery method as we run it: seven stages from assess to run, each ending in a sign-off the client controls before the next begins.",
    },
    name: "RISE and S/4HANA",
    title: "Getting there is the project. Running it is the decade.",
    group: "enterprise-platforms",
    icon: "cloud-upload",
    sourceUrl: "https://www.in2itebs.com/services/rise-s4hana/",
    metaTitle: "SAP S/4HANA migration and RISE operation",
    metaDescription:
      "ECC to S/4HANA migration — system conversion, selective data transition or greenfield — and operation on RISE afterwards, under published service levels.",
    intro: [
      "We migrate ECC estates to S/4HANA and we operate them afterwards. The second half of that sentence is the one most migration proposals leave out, and it is where the cost of a bad migration actually appears.",
    ],
    sectionsHeading: "Three routes, and the one that fits you",
    sections: [
      {
        title: "System conversion",
        icon: "refresh",
        body: "Your existing ECC system becomes an S/4HANA system. Configuration, history and custom code come with you. The fastest route, and the one that carries your existing problems forward unless custom code is dealt with properly on the way.",
      },
      {
        title: "Selective data transition",
        icon: "git-branch",
        body: "A new system, into which you move the configuration and data worth moving. More work, and the only route that lets you leave two decades of accumulated workarounds behind without starting from zero.",
      },
      {
        title: "Greenfield",
        icon: "sparkles",
        body: "A new implementation on standard processes, with data migrated as opening balances and master data. The cleanest result and the biggest change-management job.",
      },
      {
        title: "What RISE actually changes",
        icon: "cloud",
        body: "RISE moves infrastructure, patching, operating system and database upgrades and security alerting to SAP. That is a real reduction in what your team carries, and it is not the same as having no operational responsibility. Your configuration, custom code, master data, interfaces, authorisations and statutory cycles stay yours — and whether month-end actually closed stays yours too. That second list is what our managed service covers.",
        href: svc("managed-services"),
      },
    ],
    closing: [
      "The route is not a preference. It falls out of your custom code position, your data quality, your appetite for process change and your window. We establish it in the assess stage and we will argue with you about it if the evidence says something different from what you expected.",
      "Two things matter more than the rest on a conversion. Custom code is assessed in the first stage, not the fifth — finding out in Realize that half the custom estate will not lift is how migrations lose their dates. And cutover is rehearsed and anchored away from your calendar, with mock loads, quality gates, a dated freeze period and windows placed deliberately away from year-end and payroll runs.",
      "For Indian public-sector and regulated clients we deliver on MeitY-compliant hosting with both data centre and disaster recovery inside Indian jurisdiction, aligned to the DPDP Act and the IT Act. For clients in our other markets we deliver against the equivalent local requirement.",
    ],
  },
  {
    slug: "successfactors",
    name: "SuccessFactors",
    title: "HR systems fail quietly. Payroll fails on the 28th.",
    group: "enterprise-platforms",
    icon: "users",
    sourceUrl: "https://www.in2itebs.com/services/successfactors/",
    metaTitle: "SAP SuccessFactors implementation and support",
    metaDescription:
      "Employee Central, Payroll, Recruiting, Performance and the rest of the SuccessFactors suite — implemented, integrated and supported by our largest practice.",
    intro: [
      "SuccessFactors is our largest practice by headcount. Most of what we have learned in it is about the parts that do not demo well — payroll parallel runs, statutory reporting, the integration back to finance, and what happens in the second year.",
    ],
    sectionsHeading: "The parts that do not demo well",
    sections: [
      {
        title: "Payroll parallel runs",
        icon: "check-circle",
        body: "Three cycles, reconciled to the rupee, before anyone goes live. Payroll that is nearly right is payroll that is wrong, and the people it is wrong for will find out before you do.",
      },
      {
        title: "Statutory reporting",
        icon: "file-text",
        body: "Provident fund, employee provident fund, tax deducted at source, professional tax, Form 16, gratuity and terminal benefits — and the equivalents in each market we operate in. These are not configuration options; they are legal obligations with dates attached.",
      },
      {
        title: "The integration back to finance",
        icon: "link",
        body: "HR data that does not reconcile to the general ledger produces a month-end argument every month, for years.",
      },
      {
        title: "Year two",
        icon: "refresh",
        body: "The implementation partner has gone, the configuration has drifted, and the first statutory change arrives. This is the year the decision is actually judged, and it is why this page links to managed support rather than ending at go-live.",
        href: svc("managed-services"),
      },
    ],
    closing: [
      "What we implement: Employee Central, Employee Central Payroll, Time Management, self-service for employees and managers; Recruiting and Onboarding, Performance and Goals, Compensation, Succession and Development, Learning; integration to S/4HANA and finance, to third-party payroll and benefits providers, reporting and people analytics, and the authorisation model nobody budgets for and everybody needs.",
      "Our managed services practice supports SuccessFactors estates under the same published severity bands and response targets as every other platform we run — including the ones we did not implement.",
    ],
  },
  {
    slug: "smart-meter-to-cash",
    diagram: {
      src: "/diagrams/n2-meter-to-cash.svg",
      alt: "The meter-to-cash chain from meter to collection, with revenue leaking at each hand-off between field, billing, collection and the general ledger.",
    },
    name: "Smart Meter to Cash",
    title: "The meters are installed. The revenue is not arriving.",
    group: "enterprise-platforms",
    icon: "zap",
    sourceUrl: "https://www.in2itebs.com/services/smart-meter-to-cash/",
    metaTitle: "Smart Meter to Cash — metering to billed revenue",
    metaDescription:
      "Turning metering investment into billed and collected revenue for electricity and water utilities, with one partner accountable for the whole flow from meter to cash.",
    intro: [
      "Utilities are rolling out metering faster than they can build the teams to run it. The meters go in, the reads do not reach billing, customers stay on estimated bills, and the business case quietly stops being true.",
      "Every one of those gaps sits between two suppliers. The meter vendor, the communications provider, the meter-data system, the billing team and the collections function each hold up their own service level while the revenue sits in the space between them. Nobody's target is breached and the money does not arrive. That is not a technology problem — it is an accountability problem, and it is solved by one party owning the whole flow.",
    ],
    sectionsHeading: "Connect, bill, collect",
    layout: "steps",
    sections: [
      {
        title: "Connect",
        icon: "link",
        body: "Head-end, automated meter reading and smart-meter integration. Read validation and estimation rules. Exception workflows a human actually looks at. Meter-health dashboards that show which meters are not talking, before the billing cycle rather than after it.",
      },
      {
        title: "Bill",
        icon: "receipt",
        body: "Utility Billing QPPS — our own pre-configured utility billing package. Prepaid and postpaid on one platform. Energy, water, sewerage and lifeline tariffs. Bill-quality checks run before release, not after complaints.",
      },
      {
        title: "Collect",
        icon: "trending-up",
        body: "Contract accounting, bank and mobile-money channels, dunning and disconnection rules, prepaid token and top-up integration, and collection-propensity scoring so follow-up effort goes where it will be paid.",
      },
    ],
    closing: [
      "A utility never runs on SAP alone. We integrate to head-end systems, meter data management and bulk-meter telemetry; to geographic information systems and network asset data; to legacy energy and water billing applications that are not being retired yet; and to banks, payment gateways, mobile money and field applications. The integration design is part of the offer, not a dependency we discover later.",
      "It starts as a pilot on a single circle, zone or division — not as a utility-wide programme. The pilot establishes the baseline, proves the flow end to end, and produces the numbers that justify the rollout or stop it.",
    ],
  },
  {
    slug: "managed-services",
    diagram: {
      src: "/diagrams/m4b-severity.svg",
      alt: "What happens when something breaks: four severity levels, each with the response time it carries, who picks it up and when it escalates.",
    },
    name: "Managed Services",
    title: "The year after go-live. And the eight after that.",
    group: "enterprise-platforms",
    icon: "shield",
    sourceUrl: "https://www.in2itebs.com/services/managed-services/",
    metaTitle: "SAP managed services and application support",
    metaDescription:
      "Application management for SAP estates — published severity bands, response and resolution targets, monthly service reporting and service credits when we miss.",
    intro: [
      "Implementation is a project with an end date. Support is a relationship with none. This page states what we commit to, what we measure, and what happens when we miss — because a support proposal that does not say those three things is asking you to find out later.",
    ],
    sectionsHeading: "Four severity bands, and what each one means",
    sections: [
      {
        title: "S1 — Critical · 30 minutes to respond, same business day to resolve",
        icon: "shield-alert",
        body: "Production down. Multiple modules unusable. A payroll run blocked, or a statutory deadline at risk.",
      },
      {
        title: "S2 — High · 2 hours to respond, 1 working day to resolve",
        icon: "shield-alert",
        body: "A major function unavailable. A workaround exists but the financial close is at risk.",
      },
      {
        title: "S3 — Medium · 8 hours to respond, 3 working days to resolve",
        icon: "eye",
        body: "A limited function affected. A few users. A non-critical report or screen.",
      },
      {
        title: "S4 — Low · 1 working day to respond, reviewed monthly",
        icon: "message-square",
        body: "Cosmetic issues, how-to questions, minor master-data edits, enhancement requests.",
      },
    ],
    closing: [
      "Every incident is classified within fifteen minutes of being logged, against business impact rather than technical symptom. A screen that looks broken but blocks nothing is not an S1. A screen that looks fine but blocks a payroll run is. The clock stops only for reasons we both agree on — waiting on your approval, your access, or your business input — and every pause is visible in the ticket rather than applied quietly at month-end.",
      "A monthly service report gives ticket volume by severity, compliance per band, the five most frequent recurring incidents and a corrective action plan against them — issued whether or not it makes good reading. A quarterly review covers trend analysis, root-cause themes and any service credit triggered. Where compliance on the critical and high bands falls below the agreed threshold for two consecutive months, credits apply against that month's fee on a published scale. We would rather not invoke it. We would rather it exist.",
      "How we run it: a named Service Delivery Manager accountable for your account and reachable without a ticket; a shared specialist pool against per-client service levels, so you are not paying for a ring-fenced team to sit idle in the quiet weeks; minimum two-deep coverage on every skill, refreshed quarterly, with documented runbooks; and onsite presence where the contract requires it, including at plant and remote sites.",
      "How you leave: three months' structured exit, written into the contract from the start. A documented inventory, module-by-module knowledge transfer, a shadow period, a reverse-shadow period where your team or your next partner runs it with us watching, and a signed handover. Configuration documents, source code, runbooks, the knowledge base and every credential handed over, with our access revoked at sign-off. A support partner who makes leaving difficult is telling you something about how they intend to keep you.",
    ],
  },
  {
    slug: "salesforce",
    name: "Salesforce",
    title: "A certified team. And a straight answer about where we are.",
    group: "enterprise-platforms",
    icon: "cloud",
    sourceUrl: "https://www.in2itebs.com/services/salesforce/",
    metaTitle: "Salesforce implementation and support",
    metaDescription:
      "A Salesforce partner in India delivering implementation, integration and support across Sales, Service and Platform — with an experienced certified team.",
    intro: [
      "We are a Salesforce partner in India with an experienced certified team. We are earlier in this practice than we are in SAP, and we would rather you heard that from us than discovered it in week three.",
    ],
    sectionsHeading: "What we do here",
    sections: [
      {
        title: "Implementation",
        icon: "settings",
        body: "Sales Cloud, Service Cloud and Platform — configuration, data migration, user enablement and go-live.",
      },
      {
        title: "Integration to the system of record",
        icon: "link",
        body: "This is where our SAP depth is actually useful. A Salesforce instance that disagrees with the ERP about what a customer ordered creates an argument every month, and reconciling those two is work we have done for years in other contexts.",
      },
      {
        title: "Support and administration",
        icon: "shield",
        body: "After go-live, under the same severity bands and response targets as the rest of our managed services practice.",
        href: svc("managed-services"),
      },
    ],
    closing: [
      "Being straight about this: we hold the partnership and we hold the people. What we do not yet hold is a Salesforce client we can name on this page, and we are not going to imply otherwise.",
      "If you need a partner with a long referenceable Salesforce book, that is a reasonable requirement and we are not it today. If what you need is a certified team that will integrate Salesforce properly to an SAP core and still be accountable in year two, that is a conversation worth having.",
    ],
  },
  {
    slug: "workday",
    name: "Workday",
    title: "A certified team. And the same straight answer.",
    group: "enterprise-platforms",
    icon: "users",
    sourceUrl: "https://www.in2itebs.com/services/workday/",
    metaTitle: "Workday implementation and support",
    metaDescription:
      "A Workday partner in India delivering implementation, integration and support across HCM and Financials, with an experienced certified team.",
    intro: [
      "We are a Workday partner in India with an experienced certified team. As with Salesforce, this is a younger practice than our SAP one, and this page says so rather than implying otherwise.",
    ],
    sectionsHeading: "What we do here",
    sections: [
      {
        title: "Implementation",
        icon: "settings",
        body: "Workday HCM and Financials — configuration, data conversion, testing and deployment.",
      },
      {
        title: "Integration",
        icon: "link",
        body: "Including to an SAP core where one exists, and the payroll and benefits interfaces that carry most of the operational risk.",
      },
      {
        title: "Support through the release cycle",
        icon: "refresh",
        body: "Administration under our published severity bands, and support through the twice-yearly Workday release cycle — which is where an unsupported Workday estate quietly accumulates problems.",
        href: svc("managed-services"),
      },
    ],
    closing: [
      "Partnership and people, yes. A named Workday client on this page, not yet. When there is one, it will appear here.",
    ],
  },

  // ══════════════════════════════════════════════════ DIGITAL, DATA & AI
  {
    slug: "application-engineering",
    diagram: {
      src: "/diagrams/d2-five-services.svg",
      alt: "Five application engineering services — discover, build, modernise, integrate and run — reached through one engagement and delivered by one accountable team.",
    },
    name: "Application Engineering",
    title: "The applications your business runs on. Built, modernised, and kept running.",
    group: "digital-data-ai",
    icon: "code",
    sourceUrl: "https://www.in2itebs.com/services/application-engineering/",
    metaTitle: "Application Engineering and Modernisation",
    metaDescription:
      "We build, integrate, modernise and support the applications your business runs on — and keep them reconciled with your system of record.",
    intro: [
      "We design, build, integrate, modernise and support business-critical web, mobile and enterprise applications — and we stay accountable for them after go-live. Most firms will either build you an application or support one. The gap between those two is where projects are lost.",
    ],
    sectionsHeading: "Where the numbers stop agreeing",
    sections: [
      {
        title: "The problem we are set up to solve",
        icon: "target",
        body: "A field application records one figure. The interface passes another. The ledger holds a third. Nobody notices for five weeks, and by then the month is closed. An application that disagrees with the system of record is not a working application, whatever it does on screen — and the first thing we do is find out by how much.",
      },
      {
        title: "Build",
        icon: "code",
        body: "Custom web, mobile and enterprise applications; workflow and approval platforms; line-of-business applications; and the portals that reach customers, dealers and field teams.",
      },
      {
        title: "Integrate",
        icon: "link",
        body: "A governed, two-way, documented integration spine: APIs and middleware, SAP BTP, event and batch interfaces, and master-data alignment.",
      },
      {
        title: "Modernise",
        icon: "refresh",
        body: "Legacy estates assessed and moved deliberately — rewritten, re-platformed, replaced or retained, with the choice made on evidence rather than on appetite.",
      },
      {
        title: "Run",
        icon: "shield",
        body: "Managed support for what we built and for what you already had, under the same published service levels as our platform estates.",
        href: svc("managed-services"),
      },
    ],
    closing: [
      "We are an SAP company that also builds applications. That combination is unusual, and it is the reason the numbers reconcile.",
    ],
  },
  {
    slug: "application-estate-review",
    diagram: {
      src: "/diagrams/e2-portfolio-map.svg",
      alt: "What an application estate review produces: every application in the estate placed on a map and given a disposition — keep, replace, retire or leave alone.",
    },
    name: "The Application Estate Review",
    title: "A fixed-scope look at what you are actually running",
    group: "digital-data-ai",
    icon: "search",
    sourceUrl: "https://www.in2itebs.com/services/application-estate-review/",
    metaTitle: "The Application Estate Review",
    metaDescription:
      "A fixed-scope diagnostic of your application estate: what runs, what it costs, what is at risk, and in what order any of it should change.",
    intro: [
      "Most organisations can name their ERP and their top ten applications. Very few can name the other sixty, say what each costs, or say which of them one person understands.",
    ],
    sectionsHeading: "What the review produces",
    sections: [
      {
        title: "An inventory that is actually complete",
        icon: "table",
        body: "Every application in service, its owner, its users, its cost, its support position and its integration surface.",
      },
      {
        title: "A disposition for each one",
        icon: "git-branch",
        body: "Retain, re-platform, rebuild, replace or retire — decided against defined criteria rather than against who shouts loudest.",
      },
      {
        title: "The reconciliation gaps",
        icon: "shield-alert",
        body: "Where the applications and the system of record disagree, and by how much.",
      },
      {
        title: "A sequenced plan",
        icon: "map",
        body: "What to do first, what it costs, and what each step releases — in an order your finance function can fund.",
      },
    ],
    closing: [
      "Fixed scope, fixed duration, fixed price. A review that concludes you should change nothing yet is a successful review, and it is priced as one.",
    ],
  },
  {
    slug: "data-engineering-analytics",
    name: "Data Engineering and Analytics",
    title: "Reporting that agrees with the ledger",
    group: "digital-data-ai",
    icon: "bar-chart",
    sourceUrl: "https://www.in2itebs.com/services/data-engineering-analytics/",
    metaTitle: "Data Engineering and Analytics",
    metaDescription:
      "Pipelines, models and reporting that reconcile to the system of record — on SAP Analytics Cloud, Datasphere, or your own cloud data platform.",
    intro: [
      "A dashboard that disagrees with the ledger is not an insight. It is an argument that recurs every month until somebody stops using the dashboard.",
    ],
    sectionsHeading: "What we build",
    sections: [
      {
        title: "Pipelines",
        icon: "database",
        body: "Extraction, transformation and loading at scale, from SAP and non-SAP sources, with monitoring and defined recovery runbooks rather than a person who notices.",
      },
      {
        title: "Models",
        icon: "layers",
        body: "Semantic models that define a measure once, so that two reports cannot quietly mean different things by the same word.",
      },
      {
        title: "Reporting and planning",
        icon: "line-chart",
        body: "SAP Analytics Cloud, Datasphere and Business Data Cloud, or your own cloud data platform. We are not tied to one, and we will tell you where the SAP-native route is the wrong answer.",
      },
      {
        title: "Reconciliation as a feature",
        icon: "check-circle",
        body: "Every model we build carries a reconciliation back to the system of record, and the variance is reported rather than discovered.",
      },
    ],
  },
  {
    slug: "enterprise-data-management",
    diagram: {
      src: "/diagrams/n1-data-layers.svg",
      alt: "Enterprise data management in three layers — advise, build, run — each bought separately or together, with what each layer delivers.",
    },
    name: "Enterprise Data Management",
    title: "Data is a lifecycle. Not a project.",
    group: "digital-data-ai",
    icon: "database",
    sourceUrl: "https://www.in2itebs.com/services/enterprise-data-management/",
    metaTitle: "Enterprise data management for SAP estates",
    metaDescription:
      "Data strategy, governance, quality, migration, archiving and managed data operations for SAP-centric enterprises — bought as an assessment, a wave, or a service.",
    intro: [
      "Around two-thirds of the effort in a transformation programme touches data — and none of that effort ends at go-live. Master data decays daily. Retention obligations outlive the systems that created the records.",
      "Data gets treated as a task inside somebody else's programme. It is given to whoever is free, scoped by how long the cutover window is, and declared finished on the day the system goes live. Three things then happen: master data drifts because nobody owns it, reporting becomes distrusted because the masters disagree, and years of statutory retention obligation sit on a legacy system kept alive purely so somebody can look things up. None of those is a migration problem. All three are consequences of treating data as a phase.",
    ],
    sectionsHeading: "Three layers, bought separately or together",
    layout: "steps",
    sections: [
      {
        title: "Advise",
        icon: "lightbulb",
        body: "Set direction before anything moves: data strategy and target state, the governance operating model, retention and information-lifecycle policy, and the S/4HANA data-readiness and sizing work that should happen before a programme commits to a number. Bought as a fixed-scope assessment, three to six weeks.",
      },
      {
        title: "Transform",
        icon: "settings",
        body: "Execute it, wave by wave, with evidence at every gate: profiling and cleansing, master data governance, migration across every transition pattern, archiving and legacy decommissioning. Bought at a fixed price per wave, or per object, per cycle, per system retired.",
      },
      {
        title: "Operate",
        icon: "shield",
        body: "Keep it trusted after the programme closes: master data operations, scheduled delta archiving, replication and pipeline monitoring, and the compliance evidence an auditor will ask for. Bought as a managed service against published service levels, with a monthly scorecard.",
      },
    ],
    closing: [
      "Four classes of data, all of them ours. Programmes fail when one is treated as an afterthought: content bloat drives database cost, master-data drift breaks reporting, and replication gaps stall analytics. We cover master, transactional, unstructured and analytical data at every layer.",
      "Migration runs through five stages — assess, design, build, validate, cutover — each with standard work packets and defined entry and exit criteria, so waves can run in parallel and the rule library compounds across them. Execution is evidence-gated in a fixed order that does not get compressed when the date gets tight: mock loads, system and user acceptance testing, a timed dress rehearsal producing the go or no-go evidence pack, production cutover with reconciliation variance reporting, then hypercare. The dress rehearsal is the one that gets dropped on programmes that fail. It is not optional here.",
      "Licence-agnostic across SAP Migration Cockpit, Syniti ADMM, SAP Data Services, Master Data Governance, Information Steward, Landscape Transformation, ILM, Content Server and OpenText. We will tell you which of these you need and which you are being sold without cause.",
    ],
  },
  {
    slug: "applied-ai",
    name: "Applied AI",
    title: "AI where it moves a number you already report",
    group: "digital-data-ai",
    icon: "brain",
    sourceUrl: "https://www.in2itebs.com/services/applied-ai/",
    metaTitle: "Applied AI for enterprise operations",
    metaDescription:
      "AI delivered against a measure you already report, inside your data protection policy, with an accountable consultant reviewing every output.",
    intro: [
      "The question is not what AI could do. It is which number on your management report it is supposed to move, and by when.",
    ],
    sectionsHeading: "Where it earns its place",
    sections: [
      {
        title: "Forecasting",
        icon: "line-chart",
        body: "Demand, consumption and production forecasting from the data you already hold, against the planning decision it is meant to improve.",
      },
      {
        title: "Anomaly and loss detection",
        icon: "search",
        body: "Patterns that flag leakage, theft, abnormal consumption or a bill that should not go out — caught before the customer sees it.",
      },
      {
        title: "Predictive maintenance",
        icon: "wrench",
        body: "Failure history and condition data that prioritise inspections and replacements, tied back to the maintenance order rather than to a dashboard.",
      },
      {
        title: "Document and image understanding",
        icon: "file-text",
        body: "Reading what arrives as a photograph or a PDF — meter images, invoices, tariff orders, identity and compliance documents — into a transaction.",
      },
      {
        title: "Computer vision in operations",
        icon: "eye",
        body: "Delivered, not theorised: a facial-recognition attendance system with temperature and mask detection, supplied, installed and implemented for a state public sector undertaking.",
      },
      {
        title: "Assistants, grounded",
        icon: "bot",
        body: "Service and employee assistants grounded in your own documents and your own data, rather than in a general model's recollection.",
      },
    ],
    closing: [
      "Two rules that are not negotiable. Every AI output is reviewed by an accountable consultant before it reaches a decision. And all of it operates inside your data protection and security policy, agreed at mobilisation rather than assumed.",
      "We will also tell you when the answer is a rule, a report or a fixed process rather than a model. That conversation is shorter and it is more often correct.",
    ],
  },
];

/** Flattens a nav tree to a single list, parents first. Used by the mega-menu and the assistant index. */
export function flattenItems(items: NavItem[]): NavItem[] {
  const out: NavItem[] = [];
  for (const item of items) {
    out.push(item);
    if (item.children?.length) out.push(...flattenItems(item.children));
  }
  return out;
}

/** The pillar a service page sits under, or undefined for a page with no group. */
export function getServiceGroup(slug: string): ServiceGroup | undefined {
  const page = servicePages.find((p) => p.slug === slug);
  const groupSlug = page?.group ?? slug;
  return serviceGroups.find((g) => g.slug === groupSlug);
}
