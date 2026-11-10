/**
 * The Services section as the existing in2itebs.com site presents it — its mega-menu tree and the
 * page behind every item in it, carried over with the existing site's own copy (the May 2026
 * capture in scraped/services, checked against the live menu on 2026-09-19).
 *
 * Only the theme changes: each page is set in this site's tokens, type and components. Nothing is
 * added to the copy and nothing claimed that the existing page did not claim.
 */

import type { NavItem } from "./types";
import type { HeroImageKey } from "@/components/sections/hero-media";

/** Icon keys resolved in components/sections/service-icon.tsx (string keys keep this file data-only). */
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
  /** The existing site's own picture-icon for this card (under /public), where it draws one. */
  iconImage?: string;
  /** Optional link out (used on hub pages whose cards were "Read more" links on the existing site). */
  href?: string;
}

export interface ServicePage {
  slug: string;
  /** Menu label, exactly as the existing site's menu prints it. */
  name: string;
  /** The page's own H1 on the existing site (defaults to `name`). */
  title?: string;
  /** Slug of the group it sits under in the menu. */
  group: string;
  /** Opening paragraphs, in order. The first one doubles as the hero's subhead. */
  intro: string[];
  /** A heading the existing page places above its intro, where it has one. */
  introHeading?: string;
  sections: ServiceSection[];
  /** How the sections read: feature cards (default), a numbered sequence, or a plain list. */
  layout?: "cards" | "steps" | "list";
  /** A heading above the sections, where the existing page has one. */
  sectionsHeading?: string;
  /** Closing paragraphs, after the sections. */
  closing?: string[];
  /** A local image under /public, where this site already holds the existing page's own picture. */
  image?: { src: string; alt: string };
  /** Another page's hero picture to borrow (a key of content/hero-images.json), for a page with no
   *  services/<slug> picture of its own. */
  heroObject?: HeroImageKey;
  icon: ServiceIconKey;
  metaTitle?: string;
  metaDescription: string;
  /** The existing site's URL this page reproduces. */
  sourceUrl: string;
}

export interface ServiceGroup {
  slug: string;
  name: string;
  /** Where the group heading itself goes. */
  href: string;
  icon: ServiceIconKey;
  /** One line under the heading on the /services/ index. */
  blurb: string;
  items: NavItem[];
}

const svc = (slug: string) => `/services/${slug}/`;

/** The seven menu groups, in the existing site's order. Nested children mirror its nesting. */
export const serviceGroups: ServiceGroup[] = [
  {
    slug: "sap-enterprise-solutions",
    name: "SAP Enterprise Solutions",
    href: svc("sap-enterprise-solutions"),
    icon: "boxes",
    blurb: "Driving digital innovation through SAP technology.",
    items: [
      { label: "RISE with SAP", href: svc("rise-with-sap") },
      { label: "SAP GROW Fast", href: svc("sap-grow-fast") },
      { label: "SAP Concur", href: svc("sap-concur") },
      { label: "ECC Prism™", href: svc("ecc-prism") },
    ],
  },
  {
    slug: "analytics",
    name: "Analytics",
    href: svc("sap-sac"),
    icon: "bar-chart",
    blurb: "Business intelligence, planning and augmented analytics in one cloud offering.",
    items: [{ label: "SAP SAC", href: svc("sap-sac") }],
  },
  {
    slug: "cloud-hcm-solution",
    name: "Cloud HCM Solution",
    href: svc("sap-successfactors"),
    icon: "users",
    blurb: "The next generation of human capital management software.",
    items: [{ label: "SAP SuccessFactors", href: svc("sap-successfactors") }],
  },
  {
    slug: "cloud-infrastructure-services",
    name: "Cloud Infrastructure Services",
    href: svc("cloud-infrastructure-services"),
    icon: "cloud",
    blurb: "Strategy, migration and hosting for your journey to the cloud.",
    items: [
      { label: "Cloud Strategy", href: svc("cloud-strategy") },
      { label: "Cloud Migration", href: svc("cloud-migration") },
      { label: "Cloud Hosting Services", href: svc("cloud-hosting-services") },
    ],
  },
  {
    slug: "other-enterprise-solutions",
    name: "Other Enterprise Solutions",
    href: svc("other-enterprise-solutions"),
    icon: "grid",
    blurb: "Oracle and Microsoft platforms, planned, implemented and customised.",
    items: [
      { label: "Oracle", href: svc("oracle") },
      {
        label: "Microsoft",
        href: svc("microsoft"),
        children: [
          { label: "MS Office 365", href: svc("ms-office-365") },
          { label: "Microsoft Dynamics 365", href: svc("microsoft-dynamics-365") },
        ],
      },
    ],
  },
  {
    slug: "cyber-security-enterprise-risk",
    name: "Cyber Security & Enterprise Risk",
    href: svc("cyber-security-enterprise-risk"),
    icon: "shield",
    blurb: "We help you create a secure network and organization.",
    items: [
      { label: "Security and Risk Advisory", href: svc("security-and-risk-advisory") },
      { label: "Cloud and Infra Security", href: svc("cloud-and-infra-security") },
      { label: "Identity and Access Management", href: svc("identity-and-access-management") },
    ],
  },
  {
    slug: "digital-services",
    name: "Digital Services",
    href: svc("digital-services"),
    icon: "sparkles",
    blurb: "A comprehensive suite of offerings to empower your business.",
    items: [
      { label: "Digital Transformation Services", href: svc("digital-transformation-services") },
      {
        label: "Application Development & Maintenance Services (ADMS)",
        href: svc("application-development-maintenance-services-adms"),
      },
      { label: "Application Maintenance & Support", href: svc("application-maintenance-support") },
      { label: "Development & Maintenance", href: svc("development-maintenance") },
      { label: "Agile & Devops", href: svc("agile-devops") },
    ],
  },
  {
    slug: "data-analytics-ai",
    name: "Data Analytics & AI",
    href: svc("data-analytics-ai"),
    icon: "brain",
    blurb: "Business analytics and intelligence for data-driven decisions.",
    items: [
      { label: "Database & Data Management", href: svc("database-data-management") },
      { label: "Predictive Analysis", href: svc("predictive-analysis") },
      { label: "AI & Machine Learning", href: svc("ai-machine-learning") },
      { label: "Big Data", href: svc("big-data") },
      { label: "Blockchain", href: svc("blockchain") },
      { label: "Robotic Process Automation (RPA)", href: svc("robotic-process-automation") },
    ],
  },
];

/**
 * The mega-menu's four columns, as the existing site lays them out: SAP alone in the first, then
 * Analytics over Other Enterprise Solutions, Cloud HCM over Cyber Security, and Cloud
 * Infrastructure over Digital Services over Data Analytics & AI.
 */
export const serviceMenuColumns: string[][] = [
  ["sap-enterprise-solutions"],
  ["analytics", "other-enterprise-solutions"],
  ["cloud-hcm-solution", "cyber-security-enterprise-risk"],
  ["cloud-infrastructure-services", "digital-services", "data-analytics-ai"],
];

/** The Services entry of the primary nav: one child per group, each carrying the group's items. */
export const servicesMenu: NavItem[] = serviceGroups.map((group) => ({
  label: group.name,
  href: group.href,
  children: group.items,
}));

export const servicePages: ServicePage[] = [
  // ---------------------------------------------------------------- SAP Enterprise Solutions
  {
    slug: "sap-enterprise-solutions",
    name: "SAP Enterprise Solutions",
    group: "sap-enterprise-solutions",
    icon: "boxes",
    heroObject: "pages/sap-enterprise-solutions",
    sourceUrl: "https://in2itebs.com/sap-enterprise-solutions/",
    metaTitle: "SAP Enterprise Solutions",
    metaDescription:
      "Comprehensive SAP consulting and project management expertise that enables clients to transform their customer, supplier and employee interactions.",
    image: { src: "/services/live/sap-enterprise-solutions.jpg", alt: "SAP Enterprise Solutions" },
    intro: ["Driving Digital Innovation through SAP technology."],
    sections: [
      {
        title: "Boost your business transformation with SAP consulting services",
        icon: "rocket",
        body: "From our experienced SAP technology consultants' strategy and sector-specific execution through to steady operation with In2IT EBS, the largest general full-service partner for end-to-end incorporation, our consumers get everything from one provider. The proficiency of specialists means that you are sure of optimal execution of current and future requirements in difficult application environments. Our practiced SAP business workflow consultants make sure professional regulation and support are based on the latest discovery in technology and platforms.",
      },
      {
        title: "Highly Collaborative approach to generating best Business performance",
        icon: "handshake",
        body: "Our SAP consulting approach is collaborative and uses experienced, industry-aware teams across the delivery lifecycle. Engagement scope, governance and knowledge transfer are agreed for each project.",
      },
    ],
  },
  {
    slug: "rise-with-sap",
    name: "RISE with SAP",
    title: "RISE WITH SAP",
    group: "sap-enterprise-solutions",
    icon: "rocket",
    sourceUrl: "https://in2itebs.com/sap-rise-with-sap/",
    metaTitle: "Rise with SAP | SAP S/4HANA Implementation",
    metaDescription:
      "SAP S/4HANA is a real-time enterprise resource management suite for digital business, built on SAP HANA, with SAP Fiori, deployable on-premise, cloud and hybrid.",
    image: { src: "/services/live/rise-with-sap.png", alt: "SAP S/4HANA, the digital core" },
    introHeading: "SAP S/4HANA",
    intro: [
      "SAP S/4HANA is a real-time enterprise resource management suite for digital business. It is built on our advanced in-memory platform, SAP HANA, and offers a personalized, consumer-grade user experience with SAP Fiori. It is deployable in on-premise, cloud, and hybrid environments.",
      "SAP S/4HANA, is designed for enterprises across industries that need a deep and broad level of functionality combined with a high degree of flexibility in customization.",
      "SAP S/4HANA is the digital core for your business. Built on the SAP HANA platform, it can enable the digital network that connects your entire workforce, suppliers, customers, and assets to the digital core.",
    ],
    sections: [
      {
        title: "Key-Value Proposition of SAP S/4HANA",
        icon: "sparkles",
        bullets: [
          "It enables business-centric innovation, empowering customers to become Intelligent Enterprises by transforming businesses with a new generation of innovative end-to-end processes.",
          "It provides industry-leading capabilities, helping customers in 25+ industries with an unmatched depth of capabilities and expertise.",
          "It runs on SAP HANA for massive simplifications (customer adoption, data model, user experience, decision making, business processes, and models) and innovations (Internet of Things, Big Data, business networks, and mobile-first).",
          "It is natively designed with SAP Fiori UX, offering an integrated user experience with modern usability and instant insight on any device (role-based, mobile-first, consistent experience across lines of business).",
          "It is natively engineered for providing a choice of deployment (on-premise, multi-tenant and single-tenant cloud, and hybrid).",
          "It is natively born for easy adoption (guided, configuration, and easy onboarding, from the discovery of the solution through cloud trials to deployment with preconfigured best practices).",
        ],
      },
      {
        title: "Business Benefits",
        icon: "trending-up",
        body: "SAP S/4HANA allows you to reinvent business models and drive new revenues and profits from a business value perspective.",
        bullets: [
          "You can easily connect to people, devices, and business networks to deliver new value to your customers on any channel.",
          "You can leverage digital assistance and natural language conversations for increased productivity and user satisfaction.",
          "You can add automation to key processes and signal users when input is required with artificial intelligence functionality and machine learning capabilities.",
          "Your business users can get context-aware, predictive insights in real-time: planning, execution, prediction, and simulation for better decisions and faster business impact.",
        ],
      },
      {
        title: "IT value perspective",
        icon: "server",
        body: "From an IT value perspective, SAP S/4HANA allows you to simplify the landscape and helps reduce the total cost of ownership (TCO) with SAP HANA as the great simplifier.",
        bullets: [
          "You can reduce your data footprint and work with larger data sets in one system to save hardware costs, operational costs, and time.",
          "You can simplify innovation with an open platform (SAP Business Technology Platform) to drive advanced applications – for example, predicting, recommending, and simulating – while protecting existing investments.",
          "Your business users can leverage a simple and role-based user experience based on modern design principles which minimizes training efforts while increasing productivity.",
          "You get a choice of deployment: cloud, on-premise, or hybrid to drive quick time to value.",
        ],
      },
    ],
  },
  {
    slug: "sap-grow-fast",
    name: "SAP GROW Fast",
    title: "Go Live in Weeks, Not Months: SAP GROW Fast, Delivered by In2IT EBS",
    group: "sap-enterprise-solutions",
    icon: "zap",
    sourceUrl: "https://in2itebs.com/sap-grow-fast/",
    metaTitle: "SAP GROW Fast",
    metaDescription:
      "SAP GROW Fast is a structured path to Cloud ERP using a pre-defined scope and fit-to-standard delivery approach.",
    image: { src: "/services/live/sap-grow-fast.jpg", alt: "SAP GROW Fast" },
    intro: [
      "Most companies that put off moving to a modern ERP aren't dragging their feet because they don't see the value. They're dragging their feet because \"ERP implementation\" has become shorthand for eighteen months of workshops, a budget that keeps drifting, and a go-live date that keeps slipping. For a growing business, that timeline isn't just inconvenient — it's a competitive disadvantage.",
      "SAP GROW Fast exists to remove that trade-off. And at In2IT EBS, we've built our entire GROW Fast practice around one idea: you shouldn't have to choose between moving fast and moving right.",
    ],
    sections: [
      {
        title: "What SAP GROW Fast Actually Is",
        icon: "lightbulb",
        body: "SAP GROW Fast uses a pre-defined, fit-to-standard scope covering Finance, Order-to-Cash and Procure-to-Pay. Scope, timeline and commercial terms are confirmed for each engagement.",
        bullets: [
          "What makes this a genuinely modern ERP rather than just a faster old one is Joule, SAP's AI copilot, active from day one. From your very first go-live, your team isn't learning a new system cold — they have an assistant that understands natural language, helps them navigate, and flags issues before they become problems.",
          'And "fast" doesn\'t mean "limited." SAP GROW Fast follows a land-and-expand model: your first wave gets you live with the essentials in one entity and one country, and every wave after that — additional countries, deeper integrations, industry-specific capability — happens on your timeline, not a vendor\'s.',
          "The packaged approach uses a defined scope, delivery method and commercial model intended to reduce avoidable project risk and disruption.",
        ],
      },
      {
        title: "Why In2IT EBS",
        icon: "check-circle",
        body: "Being SAP-qualified as a partner-packaged solution provider isn't a badge we point to — it's a discipline we deliver against. Our GROW Fast practice runs on a clear delivery methodology, RACI-defined roles, and the quality gates SAP itself recommends, so \"fast\" never comes at the expense of \"right.\" That's what Converged Intelligence means to us: bringing SAP's platform, AI, and our own delivery discipline together into one dependable outcome, not three separate risks.",
      },
      {
        title: "Three Packages. One Converged Core.",
        icon: "layers",
        body: "Every In2IT EBS GROW Fast offering starts from the same mandatory Cloud ERP backbone, then adds the specialization your business actually runs on.",
        bullets: [
          "In2IT Converge Pulse — Pairs Cloud ERP with Core HR, so finance and people operations run on one connected core instead of two disconnected systems — hire to pay, pay to close, with the same AI copilot supporting both sides of the business.",
          "In2IT Converge Momentum — Pairs Cloud ERP with Professional Services, built for consulting, engineering, and project-based businesses that need staffing, billing, and financial close to move at the same speed as client delivery — not a wave behind it.",
          "In2IT Converge Flow — Pairs Cloud ERP with Mill Products, and covers exactly what that name implies: sugar, rice, wheat, textile, and metal mills alike. One order-to-cash pattern, batch and lot traceability included, with no material-specific rebuild required to make it fit your operation.",
        ],
      },
      {
        title: "Ready When You Are",
        icon: "rocket",
        body: "SAP GROW Fast provides a structured basis for ERP modernisation, with agreed scope, governance and a phased adoption plan.",
      },
    ],
    closing: ["Talk to In2IT EBS about which GROW Fast package fits your business."],
  },
  {
    slug: "sap-concur",
    name: "SAP Concur",
    group: "sap-enterprise-solutions",
    icon: "receipt",
    heroObject: "pages/sap-concur",
    sourceUrl: "https://in2itebs.com/sap-concur-2/",
    metaTitle: "SAP Concur Implementation Services and Support",
    metaDescription:
      "SAP Concur is a leading travel, expense and invoice management solution that empowers organizations to simplify their financial operations.",
    intro: [
      "SAP Concur is a leading travel, expense, and invoice management solution that empowers organizations to simplify their financial operations. Through innovative technology, SAP Concur streamlines the entire expense management process, from booking business trips to managing reimbursements. By automating these tasks, organizations can enhance efficiency, gain better visibility into spending, and ensure compliance with policies. With its user-friendly interface and integration capabilities, SAP Concur transforms the way businesses handle expenses and travel, ultimately driving cost savings and enabling more strategic financial decision-making.",
      "At In2IT EBS, our profound understanding of SAP ERP and HXM uniquely equips us to empower our clients in the realm of travel, expense, and invoice management through SAP Concur. With our guidance, businesses can seamlessly integrate SAP Concur into their existing SAP ecosystem, creating a harmonized approach that optimizes financial operations. Our expertise ensures a smooth implementation and integration process, allowing organizations to fully leverage SAP Concur's capabilities while benefiting from our comprehensive knowledge of SAP solutions.",
    ],
    sections: [],
  },
  {
    slug: "ecc-prism",
    name: "ECC Prism™",
    title: "ECC Prism™ – SAP ECC Landscape Intelligence & Optimization Platform",
    group: "sap-enterprise-solutions",
    icon: "prism",
    heroObject: "pages/ecc-prism",
    sourceUrl: "https://in2itebs.com/ecc-prism/",
    metaTitle: "ECC Prism™ – SAP ECC Landscape Intelligence & Optimization Platform",
    metaDescription:
      "A comprehensive SAP ECC landscape audit and optimization platform that extends ECC life, reduces cost, mitigates risk and prepares for a future transition to S/4HANA.",
    intro: [
      "ECC Prism™ is a comprehensive SAP ECC landscape audit and optimization platform designed to help enterprises—especially large PSUs and ECC-heavy organizations—extend ECC life, reduce cost, mitigate risk, and prepare for a future transition to S/4HANA, without forcing premature migration decisions.",
      "ECC Prism™ goes beyond traditional technical audits. It combines system intelligence, usage analytics, configuration analysis, and financial impact assessment to deliver actionable, quantified recommendations across licenses, architecture, custom code, integrations, security, and operations.",
    ],
    sectionsHeading: "What ECC Prism™ Does",
    sections: [
      {
        title: "License & Usage Intelligence",
        icon: "key",
        iconImage: "/services/icons/ecc-1.png",
        bullets: [
          "Active vs inactive user licenses",
          "Unused or under-utilized licenses",
          "License type mismatch and optimization opportunities",
          "Estimated ₹-based license savings",
        ],
      },
      {
        title: "Functional & Technical Usage Analysis",
        icon: "search",
        iconImage: "/services/icons/ecc-2.png",
        bullets: [
          "Unused or rarely used configuration objects",
          "Custom developments never executed or redundant",
          "RICEF inventory health (used / unused / obsolete)",
          "Identification of RICEFs that should be rebuilt, retired, or modernized",
        ],
      },
      {
        title: "Architecture & Integration Health",
        icon: "layers",
        iconImage: "/services/icons/ecc-3.png",
        bullets: [
          "ECC system topology and environment sprawl",
          "Interfaces and integrations (SAP & non-SAP)",
          "Performance bottlenecks and stability risks",
          "Readiness for selective modernization (BI, dashboards, automation)",
        ],
      },
      {
        title: "Security, Compliance & Risk View",
        icon: "shield-alert",
        iconImage: "/services/icons/ecc-4.png",
        bullets: [
          "Authorization and role design issues",
          "Segregation of Duties (SoD) risks",
          "Audit red flags relevant for PSU and regulated environments",
        ],
      },
      {
        title: "What You Get – Actionable Outcomes",
        icon: "check-circle",
        iconImage: "/services/icons/ecc-5.png",
        body: "ECC Prism™ delivers clear, prioritized recommendations, not just observations. Each recommendation is tagged with business impact, risk criticality, estimated savings (₹) and implementation effort (low / medium / high).",
        bullets: [
          "Immediate cost take-out opportunities (licenses, support, infrastructure)",
          "ECC lifecycle extension roadmap (12–36 months)",
          "Technical debt reduction plan",
          "Risk heatmap highlighting high-impact operational and audit risks",
          "Investment vs value view for management decision-making",
        ],
      },
      {
        title: "Why ECC Prism™ is Different",
        icon: "sparkles",
        iconImage: "/services/icons/ecc-7.png",
        bullets: [
          "ECC-first, not migration-biased: built for organizations that want to stabilize and optimize ECC before 2027+, not rush into RISE or S/4.",
          "PSU-grade audit depth: designed to withstand CAG, internal audit, and statutory scrutiny.",
          "Business + IT lens: converts technical findings into CFO- and CXO-friendly insights.",
          "Tool-driven, not consultant-dependent: ensures repeatability, objectivity, and speed.",
        ],
      },
      {
        title: "Who Should Use ECC Prism™",
        icon: "target",
        iconImage: "/services/icons/ecc-8.png",
        bullets: [
          "Large ECC customers planning controlled S/4 migration later",
          "PSUs and regulated enterprises under cost, audit, and compliance pressure",
          "CIOs and CFOs seeking measurable ECC cost optimization",
          "Organizations with complex, long-running ECC customizations",
        ],
      },
    ],
    closing: [
      "ECC Prism™ turns your ECC landscape from a black box into a transparent, optimized, and future-ready platform—on your terms.",
    ],
  },

  // ---------------------------------------------------------------- Analytics
  {
    slug: "sap-sac",
    name: "SAP SAC",
    title: "SAP Analytics Cloud",
    group: "analytics",
    icon: "bar-chart",
    heroObject: "pages/sap-analytics-cloud",
    sourceUrl: "https://in2itebs.com/sap-sac/",
    metaTitle: "SAP Analytics Cloud (SAC)",
    metaDescription:
      "SAP Analytics Cloud combines business intelligence, enterprise planning and augmented analytics in a single cloud offering built on SAP Business Technology Platform.",
    image: { src: "/services/live/sap-analytics-cloud.png", alt: "SAP Analytics Cloud" },
    intro: [
      "SAP Analytics Cloud is a cloud-based solution that combines business intelligence, enterprise planning, and augmented analytics in a single solution. Built on SAP Business Technology Platform, it helps you eliminate point solutions and break down data silos with a secure, cloud-based approach. Rather than relying on standalone spreadsheets, or separate, disconnected reporting and planning tools, users have everything they need, embedded where they work, to make fast, confident decisions together.",
      "Intelligent decisions are part of a continuous process. All organizations must plan, discovery, analyze, predict, and act. There is significant advantage to doing this together and all in one place enabled by technology. The reality in many enterprises is that these activities are disconnected. Data engineers are tasked with data tracking, data analysts and data scientists are tasked with analyzing the data, and the results of the analysis are delivered to another group of decision makers, whose decisions are then passed along to employees who act based on the decisions. It is rare for one software package to support two or more of these activities. Without visibility across the whole process, it is difficult for an enterprise to learn. Missing functionality across this process often results in a lack of evaluating alternatives, understanding risk and constraints, and prescribing next best actions.",
    ],
    sectionsHeading: "Detailed features are described below.",
    sections: [
      {
        title: "With SAP Analytics Cloud, organizations can take advantage of",
        icon: "check-circle",
        body: "Make end-to-end decisions with all analytics capabilities in one place. Gain enterprise-ready insight and act within your business processes. Make smart decisions with AI-driven insights delivered to you naturally.",
        bullets: [
          "Complete, comprehensive, in-memory data management and analytics",
          "Contextual delivery of smart insights through natural-language processing",
          "Confident decision-making faster, without expert intervention",
          "Affordability, availability, and scalability",
        ],
      },
      {
        title: "Augmented Analytics",
        icon: "sparkles",
        body: "Reveal relevant, accurate, and actionable insights faster with artificial intelligence and machine learning technologies.",
        bullets: [
          "Data science for all – Focus on higher-value activities with machine intelligence embedded in business intelligence and planning workflows.",
          "Conversational analytics – Get answers instantly by creating visualizations and explanations with natural language querying and generation.",
          "Automated machine learning – Discover key influencers and relationships in your data to boost performance, detect anomalies, and take remedial actions.",
          "Intelligent predictions – Predict potential outcomes and forecasts you can trust with the push of a button and no data science skills required.",
        ],
      },
      {
        title: "Business Intelligence",
        icon: "line-chart",
        body: "Explore data across the organization and deliver insights at the point of decision with intuitive self-service analytics.",
        bullets: [
          "Data exploration and visualization – Inspire audiences with interactive visualizations and stories by filtering and drilling into data, regardless of volume size.",
          "Efficient modeling and preparation – Automate data cleansing to alert errors and categorize measures and dimensions to enhance your data and gain deeper insights.",
        ],
      },
      {
        title: "Enterprise Planning",
        icon: "target",
        body: "Link and create financial and operational plans seamlessly in one solution to drive better decisions with integrated plans.",
        bullets: [
          "Collaborative enterprise planning – Plan across all lines of business to turn real-time insight into action, ensure strategic alignment, and decide confidently.",
          "Intelligent planning – Understand your business today and tomorrow with predictive forecasting and machine learning tools.",
          "Integrated financial planning – Act in the moment and spend more time on strategy by combining transactions, analytics, and planning with SAP S/4HANA.",
          "Company-wide advanced analytics – Create and modify versions of a planning model for data-driven budgeting, forecasting, and analysis from one cloud interface.",
        ],
      },
      {
        title: "Design of Analytics Applications",
        icon: "layout",
        body: "Create centrally governable analytic content from guided analytics to sophisticated planning and smart applications.",
        bullets: [
          "Custom interactions – Unite business intelligence, planning, and predictive capabilities by developing state-of-the-art analytics applications.",
          "Rapid prototyping – Customize, integrate, and extend existing content, templates, or user stories with existing data models and widgets.",
          "Standardized analytics content – Foster a consistent and continuous user experience with reusable user interface elements and adjustable widget behaviors.",
          "Custom widgets – Enable custom, reusable functionalities with tailored widgets, centrally managed composites, and data-science capabilities.",
        ],
      },
      {
        title: "Mobile and Web Extensions",
        icon: "smartphone",
        body: "Access analytics with an iPhone or iPad to get the most recent information about your business anytime, anywhere.",
        bullets: [
          "Engaging connections – View and interact with mobile-ready stories and charts by using drill-down, filter on selection, and inspection capabilities.",
          "Productive collaboration – Collaborate with colleagues through chat and receive and manage notifications – such as a shared story – in an application.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Cloud HCM Solution
  {
    slug: "sap-successfactors",
    name: "SAP SuccessFactors",
    group: "cloud-hcm-solution",
    icon: "users",
    heroObject: "pages/sap-successfactors",
    sourceUrl: "https://in2itebs.com/sap-success-factors/",
    metaTitle: "SAP SuccessFactors",
    metaDescription:
      "SAP SuccessFactors HCM Suite offers individualised experiences and strategic solutions that empower employees to reach their potential.",
    image: { src: "/services/live/sap-sf-hcm.png", alt: "SAP SuccessFactors HCM Suite" },
    intro: [
      "SAP Human Capital Management (HCM) is a human resources management system that helps businesses manage their employees and workforce. This suite is designed around what people need, how they work, and what motivates and inspires them to be and do their best. It helps organizations make continuous improvements by embedding insights and action planning directly into HR systems and processes, which leads to employees who deliver more, build a positive culture, and advocate for your brand.",
    ],
    sections: [
      {
        title: "SAP SuccessFactors HCM Suite: The evolution of HCM software",
        icon: "sparkles",
        body: "One can change the world of work for good with the next generation of human capital management (HCM) software. SAP SuccessFactors Human Capital Management Suite (SAP SuccessFactors HCM Suite) offers individualised experiences and strategic solutions that empower employees to reach their potential.",
      },
      {
        title: "Employee experience management",
        icon: "heart",
        body: "Redefine the employee experience by better understanding their needs and wants and giving them a voice to feel connected, supported, and empowered.",
        bullets: [
          "Improve the employee experience",
          "Improve the digital employee experience",
          "Manage the employee lifecycle",
          "Holistically assess the performance",
          "Optimise employee benefits",
          "Improve the candidate experience",
        ],
      },
      {
        title: "Core HR and payroll",
        icon: "file-text",
        body: "Support your employees wherever they work with global solutions for core HR, cloud payroll, time tracking, benefits administration, and HR service delivery.",
        bullets: [
          "Optimise HR operations and people data",
          "Manage global payroll",
          "Simplify time and attendance management",
          "Streamline HR services",
          "Centralise document management",
          "An intuitive digital workplace experience",
        ],
      },
      {
        title: "Talent management",
        icon: "target",
        body: "Build the skills and agility needed for the future with solutions for recruiting, onboarding, performance, compensation, learning, succession, and development.",
        bullets: [
          "Attract the best talent to create a more diverse workforce",
          "Provide personalised opportunities for continuous learning and development",
          "Optimise performance by helping to ensure your people are rewarded and valued",
          "Provide guidance throughout the employee journey",
        ],
      },
      {
        title: "HR analytics and workforce planning",
        icon: "line-chart",
        body: "Get data-driven insights into your workforce, investigate trends with people analytics, and use powerful analysis to improve strategic workforce planning.",
        bullets: [
          "Make faster, more informed decisions based on data-driven insights",
          "Align HR with your corporate strategy to drive growth",
          "Identify risks and opportunities related to your workforce",
          "Use people data to plan, measure, and improve DE&I and well-being",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Cloud Infrastructure Services
  {
    slug: "cloud-infrastructure-services",
    name: "Cloud Infrastructure Services",
    title: "Cloud Services",
    group: "cloud-infrastructure-services",
    icon: "cloud",
    // The existing menu's "Cloud Infrastructure Services" heading opens this Cloud Services page.
    sourceUrl: "https://in2itebs.com/cyber-security-services-2/",
    metaTitle: "Cloud Infrastructure Services",
    metaDescription:
      "Our Cloud services facilitate organizations to achieve business efficiency and operational excellence on system administration, security, compliance, privacy, performance, sizing, management and monitoring.",
    image: { src: "/services/live/cloud-system-tablet.jpg", alt: "Cloud system tablet background smart technology" },
    intro: [
      "Cloud is the bedrock of a future-ready company. Cloud Technology is a growing trend in the technological sphere. It is here that In2IT EBS role come into play. Our Cloud services facilitates organizations to achieve business efficiency and operational excellence on system administration, security, compliance, privacy, performance, sizing, management, and monitoring.",
      "Businesses are benefited with constant development in IT space and we have seen quite a new technologies providing a completely paradigm shift the way IT is adopted as the main tool to enable business transformation. Cloud computing today has evolved as the most disruptive technologies in recent years.",
      "Organizations are embracing cloud to benefit from the scalability, responsiveness and cost-efficiencies that cloud computing offers. The transformation to a cloud environment is a significant enterprise undertaking that has a tremendous impact on the way IT organizations operate and the way services are delivered to business users.",
      "Cloud enables organizations to operate more efficiently, while also further enables a service-based IT delivery model, resulting in improved responsiveness to business needs.",
    ],
    sections: [
      {
        title: "Challenges",
        icon: "shield-alert",
        body: "The key business challenges to successful cloud adoption include the following:",
        bullets: [
          "Constantly evolving economic scenario and keep organisations agile for changes",
          "Assessing the capability and suitability of public, private or hybrid cloud solutions",
          "Managing vulnerabilities in cloud technologies and managing risks and governance matters",
          "Availability of the required skills and resources to efficiently implement cloud solutions",
          "Developing an organizational strategy to support cloud adoption",
          "Building a comprehensive migration strategy to ensure maximise business value",
        ],
      },
      {
        title: "Business Benefits",
        icon: "check-circle",
        bullets: [
          "Advisory services to understand which applications can be taken to Cloud",
          "Standardized framework for cloud adoption and migration from traditional IT systems",
          "Cloud CANVAS providing web based system to access IT Catalog, order, provision, monitor and manage the public, private and hybrid cloud",
          "Cloud CANVAS providing complete flexibility and visibility to integrate with third party cloud services and complete visibility on ROI",
        ],
      },
      {
        title: "Cloud Strategy",
        icon: "map",
        href: svc("cloud-strategy"),
        body: "A cloud strategy is a succinct statement of the cloud's function in the enterprise. It's a living document that serves as a link between a high-level business strategy and a cloud adoption/migration strategy.",
      },
      {
        title: "Cloud Migration",
        icon: "cloud-upload",
        href: svc("cloud-migration"),
        body: "We devise a strategy for full end-to-end migration without creating system gaps. Regardless of your business case and problem scenario, we can help you develop a cloud roadmap.",
      },
      {
        title: "Cloud Hosting Services",
        icon: "server",
        href: svc("cloud-hosting-services"),
        body: "The entire cloud architecture is aimed at providing the users with high bandwidth, uninterrupted access to data and applications, an on-demand agile network and, most importantly, network security.",
      },
    ],
  },
  {
    slug: "cloud-strategy",
    name: "Cloud Strategy",
    group: "cloud-infrastructure-services",
    icon: "map",
    sourceUrl: "https://in2itebs.com/cloud-strategy-2/",
    image: { src: "/services/live/cloud-strategy.jpg", alt: "Cloud Strategy" },
    metaTitle: "Cloud Strategy",
    metaDescription:
      "In2IT EBS enables your organizational journey to the cloud, helping you develop a clear strategy and prepare your team to meet your business-critical objectives.",
    intro: [
      "A cloud strategy is a succinct statement of the cloud's function in the enterprise. It's a living document that serves as a link between a high-level business strategy and a cloud adoption/migration strategy. A cloud strategy is distinct from a cloud migration or adoption strategy.",
      "In2IT EBS enables your organizational journey to the cloud by avoiding challenges/traps/risks and taking advantage of opportunities specific to your company. As a result, In2IT EBS helps your organization develop a clear strategy and prepare your team to meet your business-critical objectives.",
    ],
    sectionsHeading: "Modules included in your Organizational Cloud Strategy Journey",
    layout: "list",
    sections: [
      { title: "Finance", icon: "receipt" },
      { title: "Human Resources", icon: "users" },
      { title: "Operations", icon: "settings" },
      { title: "Enterprise Architecture", icon: "layers" },
      { title: "IT Infrastructure", icon: "server" },
      { title: "Sourcing and Procurement", icon: "handshake" },
      { title: "Manufacturing", icon: "building" },
      { title: "Supply Chain", icon: "link" },
      { title: "Sales & Services", icon: "trending-up" },
      { title: "Research & Development and Engineering", icon: "lightbulb" },
      { title: "Asset Management", icon: "folder" },
    ],
  },
  {
    slug: "cloud-migration",
    name: "Cloud Migration",
    group: "cloud-infrastructure-services",
    icon: "cloud-upload",
    sourceUrl: "https://in2itebs.com/cloud-migration-2/",
    image: { src: "/services/icons/cloud-migration.png", alt: "Cloud Migration" },
    metaTitle: "Cloud Migration",
    metaDescription:
      "We devise a strategy for full end-to-end cloud migration without creating system gaps, then plan, strategize and execute so you can utilize cloud services sooner.",
    introHeading: "Cloud migration becomes easier with us",
    intro: [
      "When you are migrating to the cloud, a lot of glitches and issues make you want to stop. However, you know cloud can help you scale and drive growth. Hence, you try to fill in the gaps that arise during the cloud migration.",
      "With us, you don't have to worry at all about filling the gaps. We devise a strategy for full end-to-end migration without creating system gaps. Regardless of your business case and problem scenario, we can help you develop a cloud roadmap. Then we plan, strategize, and execute migration activities to enable you to utilize cloud services sooner than later.",
      "Whether you require re-structuring, re-platforming, or re-architecture, our team has the right talent and skill to execute all this without any hassle. We further ensure that during this migration, your migration risk is majorly reduced and your organization is following compliance requirements under all circumstances.",
      "You may have difficult analytics and data use cases, complex data structure, and a massive amount of data flowing in every second. All your data pipelines may be exhausted. Even in a situation like this, we have the right power and knowledge to streamline your migration and help you access cloud features quickly. This implementation will help you reduce costs in the long-term and achieve success.",
    ],
    sections: [],
  },
  {
    slug: "cloud-hosting-services",
    name: "Cloud Hosting Services",
    group: "cloud-infrastructure-services",
    icon: "server",
    sourceUrl: "https://in2itebs.com/cloud-hosting-services/",
    image: { src: "/services/live/cloud-hosting-services.jpg", alt: "Cloud Hosting Services" },
    metaTitle: "Cloud Hosting Services",
    metaDescription:
      "In2IT EBS prescribes, deploys and maintains cloud solutions and architecture: SaaS, PaaS and IaaS, with solution acceleration for faster time to value.",
    introHeading: "Architecting the Digital Future",
    intro: [
      "In2IT EBS is proactively supporting various enterprises in Cloud technologies. As part of our commitment we have developed Cloud strategy, architectures and designs. Depending upon the business requirements and technology roadmap In2IT EBS prescribes, deploy and maintains various cloud solutions and architecture.",
      "The entire cloud architecture is aimed at providing the users with high bandwidth, allowing users to have uninterrupted access to data and applications, on-demand agile network with possibility to move quickly and efficiently between servers or even between clouds and most importantly network security.",
      "The In2IT EBS cloud services covers a wide range of resources that a service provider delivers to customers via the internet, which, in this context, has broadly become known as the cloud. Characteristics of cloud services include self-provisioning and elasticity; that is, customers can provision services on an on-demand basis and shut them down when no longer necessary.",
    ],
    sections: [
      {
        title: "Cloud Service Models",
        icon: "layers",
        iconImage: "/services/icons/cloud-hosting-1.png",
        body: "The various cloud-based services have their own distinct and unique cloud architectures:",
        bullets: [
          "Software as a Service (SaaS) involves software hosted and maintained on internet. With SaaS, users do not have to install the software locally.",
          "Platform as a Service (PaaS) provides users with application platforms and databases, equivalent to middleware services.",
          "Infrastructure as a Service (IaaS) provides for infrastructure and hardware such as servers, networks, storage devices, etc. running in the cloud, available to users against a pay per usage basis.",
        ],
      },
      {
        title: "Solution Acceleration",
        icon: "zap",
        iconImage: "/services/icons/cloud-hosting-2.png",
        body: "In2IT EBS solution accelerates Cloud for faster time to value through:",
        bullets: [
          "Innovation — Shift IT spend away from operations and focus on hybrid infrastructure innovations, such as software-defined and converged infrastructure to drive competitive advantage.",
          "Responsiveness — Simplify IT through rapid deployment of pre-packaged, workload-optimized systems.",
          "Hybrid IT — Establish the ideal foundation for hybrid IT computing, become the service broker, and decide how and where to deliver IT services.",
          "Disaster recovery — Enhance disaster recovery by moving workloads and data to new data centres.",
          "ROI — Drive higher efficiency and effectiveness, leverage existing investments, reduce energy costs, and enhance data center capacity.",
          "Utility Pricing — Utilize monthly subscription-based pricing for your infrastructure and services refresh through Flexible Capacity Services.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Other Enterprise Solutions
  {
    slug: "other-enterprise-solutions",
    name: "Other Enterprise Solutions",
    group: "other-enterprise-solutions",
    icon: "grid",
    sourceUrl: "https://in2itebs.com/other-enterprise-solutions/",
    metaTitle: "Other Enterprise Solutions",
    metaDescription:
      "Plan, implement and customise the leading enterprise platforms: SAP, Microsoft and Oracle, with consulting that improves working speed and reduces cost.",
    image: { src: "/services/other-enterprise-solutions.jpg", alt: "Other Enterprise Solutions" },
    intro: [
      "Enterprises need to keep changing according to the evolving demands of the market. As the technology landscape presents new opportunities every day, it becomes essential to anticipate how you will serve the future needs of your organization, customers, employees, and stakeholders.",
      "We help you take advantage of several leading platforms such as Oracle, Microsoft, and SAP. Our team assists you plan, implement, and customize the working using these tools so that you can ensure smooth functioning and enhanced performance in the long-term. Whenever you face system glitches or struggle with bottlenecks, our experts provide enterprise consulting to recover from the damage and reduce its impact.",
    ],
    sections: [
      {
        title: "SAP",
        icon: "boxes",
        href: svc("sap-enterprise-solutions"),
        body: "SAP solutions help you increase customer value and brand value of your business. These solutions assist you to execute enterprise functions in a simple manner in the digital world. However, implementation is not as easy as anticipated. Hence, we offer SAP consulting to improve working speed and reduce costs.",
      },
      {
        title: "Microsoft",
        icon: "grid",
        href: svc("microsoft"),
        body: "With Microsoft offering several desk and workplace solutions, it is possible for businesses to stay ahead of the market. These tools can be used for every business activity from communication to development. We have expertise in Microsoft products which allow us to guide you through the adoption of these tools.",
      },
      {
        title: "Oracle",
        icon: "database",
        href: svc("oracle"),
        body: "Our Oracle practice makes a positive difference to customers by helping them align their businesses with the latest in Information Technology. As a Gold partner of Oracle, we have demonstrated capabilities in the ever expanding Oracle ecosystems.",
      },
    ],
  },
  {
    slug: "oracle",
    name: "Oracle",
    group: "other-enterprise-solutions",
    icon: "database",
    heroObject: "pages/oracle",
    sourceUrl: "https://in2itebs.com/oracle-3/",
    metaTitle: "Oracle",
    metaDescription:
      "As a Gold partner of Oracle, In2IT EBS has demonstrated capabilities across Oracle E-Business Suite, Fusion Middleware, JD Edwards and Oracle Cloud ERP.",
    image: { src: "/services/live/oracle-logo.jpg", alt: "Oracle" },
    intro: [
      "Our Oracle practice makes a positive difference to customers by helping them align their businesses with the latest in Information Technology.",
      "As a Gold partner of Oracle, we have demonstrated capabilities in the ever expanding Oracle ecosystems, such as: Oracle E-Business Suite, Fusion Middle Ware, JD Edwards, Oracle Cloud ERP.",
      "In2IT EBS has over 100 Oracle resources. In2IT EBS has executed more than 50 Oracle engagements clients globally.",
    ],
    sections: [
      {
        title: "Oracle EBS Practice",
        icon: "boxes",
        iconImage: "/services/icons/oracle-ebs.png",
        bullets: [
          "Seasoned EBS Consultants",
          "Dedicated Centre of Excellence",
          "Vertical focus – Manufacturing, Hi-tech, Healthcare, CPG, E&U",
          "Over 15 projects delivered globally",
        ],
      },
      {
        title: "JD Edwards Practise",
        icon: "settings",
        iconImage: "/services/icons/oracle-jde.png",
        bullets: [
          "Adept JDE Consultants",
          "Dedicated Centre of Excellence",
          "Vertical focus – Mining, Manufacturing, Hi-tech, Healthcare, CPG, E&U",
          "Multiple projects delivered globally",
        ],
      },
      {
        title: "Database Practise",
        icon: "database",
        iconImage: "/services/icons/oracle-db.png",
        bullets: [
          "Database Experts",
          "Dedicated Oracle Core Tech Practice",
          "Focus – Oracle Database and Database Options",
          "Over 10 projects delivered globally",
        ],
      },
      {
        title: "Oracle Cloud ERP Services",
        icon: "cloud",
        iconImage: "/services/icons/oracle-cloud.png",
        bullets: [
          "Certified Oracle Cloud Consultants",
          "Dedicated Cloud Centre of Excellence",
          "Vertical focus – BFSI, E&U",
        ],
      },
      {
        title: "Value Proposition",
        icon: "lightbulb",
        body: "We created Oracle Innovation Hub to exclusively focus on all Solutions, Industrialization and Delivery Excellence requirement using Oracle platform and Technologies. The Services include:",
        bullets: [
          "Ready to use solutions, templates and accelerators",
          "Prototypes of your To-Be Business processes in our environment to help you firm up the decision making process",
          "Workshops and Demonstrations: Dedicated workshops and demonstration of our solutions",
          "These advantages reduce our development cycles. It helps to quickly deliver the solution enhancements, provide excellent support services, and enhance customer satisfaction.",
        ],
      },
      {
        title: "Key Differentiators",
        icon: "sparkles",
        body: "Here are some differentiators that make our Oracle practice stand out.",
        bullets: [
          "End-to-end capabilities in most of the Oracle ecosystem applications and technologies",
          "A wide range of solutions available in emerging areas like cloud and mobility",
          "Accelerated Delivery with proven methodologies and industry-specific frameworks",
          "Continuous innovation resulting in faster, better, steadier and cost-effective solutions",
          "Right proportion of project management specialists, technology specialists and enterprise applications specialists",
        ],
      },
    ],
  },
  {
    slug: "microsoft",
    name: "Microsoft",
    group: "other-enterprise-solutions",
    icon: "grid",
    heroObject: "pages/microsoft",
    sourceUrl: "https://in2itebs.com/microsoft/",
    image: { src: "/services/icons/microsoft.png", alt: "Microsoft" },
    metaTitle: "Microsoft",
    metaDescription:
      "As a Microsoft Gold Partner, In2IT EBS has proven capabilities in digital transformation of customers' mission-critical environments: Office 365, Dynamics 365, SharePoint and Azure.",
    intro: [
      "As a Microsoft Gold Partner, In2IT EBS has proven capabilities in Digital Transformation of customer's mission-critical environments.",
      "In2IT EBS's Microsoft offering includes Office 365 Migration Services, Enterprise Resource Planning (ERP), Customer Relationship Management (CRM), SharePoint Services (Intranet Portal, Document Management, and Enterprise Content Management (ECM) solution), Microsoft Azure Cloud offerings, and many more.",
    ],
    sectionsHeading: "Offerings",
    sections: [
      {
        title: "Office 365",
        icon: "monitor",
        iconImage: "/services/icons/office-365.png",
        href: svc("ms-office-365"),
        body: "Transforming your business to Cloud with the power of Office 365 solutions.",
      },
      {
        title: "Dynamics 365",
        icon: "layers",
        iconImage: "/services/icons/dynamics-365.png",
        href: svc("microsoft-dynamics-365"),
        body: "Offering cloud-based business solutions that comprises ERP and CRM solutions.",
      },
    ],
  },
  {
    slug: "ms-office-365",
    name: "MS Office 365",
    group: "other-enterprise-solutions",
    icon: "monitor",
    sourceUrl: "https://in2itebs.com/ms-office-365/",
    image: { src: "/services/live/ms-office-365.jpg", alt: "MS Office 365" },
    metaTitle: "MS Office 365",
    metaDescription:
      "Microsoft 365 is a suite of apps that help you stay connected and get things done: Word, Excel, PowerPoint, Teams, Outlook and OneDrive.",
    intro: [
      "Microsoft 365 is a suite of apps that help you stay connected and get things done. Connect and empower every employee, from the office to the frontline worker, with a Microsoft 365 solution that enhances productivity and drives innovation.",
    ],
    sectionsHeading: "Products covered in MS Office 365",
    sections: [
      {
        title: "MS Word",
        icon: "file-text",
        body: "Create impressive documents and improve your writing with built-in intelligent features.",
      },
      { title: "MS Excel", icon: "table", body: "Simplify complex data and create easy-to-read spreadsheets." },
      { title: "MS PowerPoint", icon: "presentation", body: "Easily create polished presentations that stand out." },
      {
        title: "MS Teams",
        icon: "message-square",
        body: "Bring everyone together in one place to meet, chat, call, and collaborate.",
      },
      {
        title: "MS Outlook",
        icon: "mail",
        body: "Manage your email, calendar, tasks, and contacts together in one place.",
      },
      {
        title: "MS OneDrive",
        icon: "folder",
        body: "Save, access, edit, and share files and photos wherever you are.",
      },
    ],
  },
  {
    slug: "microsoft-dynamics-365",
    name: "Microsoft Dynamics 365",
    group: "other-enterprise-solutions",
    icon: "layers",
    sourceUrl: "https://in2itebs.com/microsoft-dynamics-365/",
    image: { src: "/services/live/dynamics-365.jpg", alt: "Microsoft Dynamics 365" },
    metaTitle: "Microsoft Dynamics 365",
    metaDescription:
      "Microsoft Dynamics 365 offers software products for end-to-end business management, on-premises and in the cloud, across Sales, Marketing, Service, Finance, Commerce and Supply Chain.",
    intro: [
      "Microsoft Dynamics 365 offers a variety of software products for end-to-end business management available both on-premises and in the cloud. Choose one, some, or all. Dynamics 365 applications are made to work together—and with your existing systems—for a comprehensive solution that connects your entire business. So, you connect with every customer.",
    ],
    sections: [
      {
        title: "Sales",
        icon: "trending-up",
        body: "Turn customer insights into sales impact",
        bullets: [
          "Individualise selling at scale.",
          "Accelerate revenue with AI.",
          "Coach sellers with behavioural insights.",
        ],
      },
      {
        title: "Marketing",
        icon: "target",
        body: "Bring your customers into focus",
        bullets: ["Own your customer relationship.", "Create raving fans.", "Engage in new ways."],
      },
      {
        title: "Service",
        icon: "heart",
        body: "Reimagine the way you deliver customer service",
        bullets: [
          "Personalise service experiences.",
          "Elevate employee effectiveness.",
          "Optimise service operations.",
        ],
      },
      {
        title: "Finance",
        icon: "receipt",
        body: "Build finance and business operation agility",
        bullets: [
          "Adapt faster to avoid disruptions.",
          "Work smarter by driving efficiencies.",
          "Drive better performance with automation.",
        ],
      },
      {
        title: "Commerce",
        icon: "globe",
        body: "Delight shoppers every time, everywhere",
        bullets: [
          "Make shopping experiences seamless.",
          "Differentiate and automate with AI.",
          "Be more agile to adapt quickly.",
        ],
      },
      {
        title: "Supply Chain",
        icon: "link",
        body: "Adapt and thrive with a digital supply chain",
        bullets: [
          "Maximise asset performance.",
          "Transform manufacturing operations.",
          "Meet growing digital commerce needs.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Cyber Security & Enterprise Risk
  {
    slug: "cyber-security-enterprise-risk",
    name: "Cyber Security & Enterprise Risk",
    title: "Cyber Security Services",
    group: "cyber-security-enterprise-risk",
    icon: "shield",
    sourceUrl: "https://in2itebs.com/cyber-security-services/",
    metaTitle: "Cyber Security & Enterprise Risk",
    metaDescription:
      "We help you strengthen the security layer across your organization, from each office system to all the connected devices, with next-gen security architecture.",
    introHeading: "We help you create a secure network and organization.",
    intro: [
      "With all of our online devices at risk, cybersecurity is one of the most crucial tasks for every organization. If you have even a single customer, you need to ensure cybersecurity to offer safe, reliable services to your users. Further, in this era of online availability and anytime access, data privacy is the topmost concern of every organization.",
      "However, without the right approach, your data security structure may not be able to fulfill the need of the hour. You may end up risking the data of your customers without proper implementation of your security and data privacy layer.",
      "Hence, we help you strengthen the security layer across your organization. From each office system to all the connected devices, we assist you to implement measures for next-gen security architecture. These services can help you identify security loopholes, catch security attacks earlier, and take necessary preventive actions.",
      "Overall, we adopt a cohesive approach to utilize leading technologies such as machine learning, analytics, etc. to orchestrate a security layer for your organization. With us, you can have technological infrastructure that monitors your system, operational, and organizational security at all times.",
    ],
    sectionsHeading: "Our security services",
    sections: [
      {
        title: "Security and Risk Advisory",
        icon: "shield-alert",
        href: svc("security-and-risk-advisory"),
        body: "A strategic approach to prioritizing threats, so the most critical threats are handled in a timely manner.",
      },
      {
        title: "Cloud and Infra Security",
        icon: "lock",
        href: svc("cloud-and-infra-security"),
        body: "Securing resources deployed in a cloud environment and the systems that support them.",
      },
      {
        title: "Identity and Access Management",
        icon: "key",
        href: svc("identity-and-access-management"),
        body: "Ensuring that the right people and job roles in your organization can access the tools they need to do their jobs.",
      },
    ],
  },
  {
    slug: "security-and-risk-advisory",
    name: "Security and Risk Advisory",
    group: "cyber-security-enterprise-risk",
    icon: "shield-alert",
    sourceUrl: "https://in2itebs.com/security-and-risk-advisory-2/",
    image: { src: "/services/live/security-and-risk-advisory.jpg", alt: "Security and Risk Advisory" },
    metaTitle: "Security and Risk Advisory",
    metaDescription:
      "A strategic approach to prioritizing threats: identify, analyze, evaluate and address threats based on the potential impact each one poses.",
    intro: [
      "Security and Risk Advisory is a strategic approach to prioritizing threats. Organizations implement cybersecurity risk management to ensure the most critical threats are handled in a timely manner. This approach helps identify, analyze, evaluate, and address threats based on the potential impact each threat poses.",
      "A risk management strategy acknowledges that organizations cannot eliminate all system vulnerabilities or block all cyber-attacks. Establishing a cybersecurity risk management initiative helps organizations attend first to the most critical flaws, threat trends, and attacks.",
    ],
    layout: "steps",
    sections: [
      {
        title: "Identifying Risk",
        icon: "search",
        iconImage: "/services/icons/sra-identify.png",
        body: "Evaluating the organization's environment to identify current or potential risks that could affect business operations.",
      },
      {
        title: "Assess Risk",
        icon: "eye",
        iconImage: "/services/icons/sra-assess.png",
        body: "Analyzing identified risks to see how likely they are to impact the organization, and what the impact could be.",
      },
      {
        title: "Control Risk",
        icon: "shield",
        iconImage: "/services/icons/sra-control.png",
        body: "Define methods, procedures, technologies, or other measures that can help the organization mitigate the risks.",
      },
      {
        title: "Review Controls",
        icon: "refresh",
        iconImage: "/services/icons/sra-review.png",
        body: "Evaluating, on an ongoing basis, how effective controls are at mitigating risks, and adding or adjusting controls as needed.",
      },
    ],
  },
  {
    slug: "cloud-and-infra-security",
    name: "Cloud and Infra Security",
    group: "cyber-security-enterprise-risk",
    icon: "lock",
    sourceUrl: "https://in2itebs.com/cloud-and-infra-security/",
    image: { src: "/services/live/cloud-and-infra-security.jpg", alt: "Cloud and Infra Security" },
    metaTitle: "Cloud and Infra Security",
    metaDescription:
      "In2IT EBS facilitates its customers with technologies, policies, controls and services that protect cloud data, applications and infrastructure from threats.",
    intro: [
      "Cloud & Infrastructure security is the practice of securing resources deployed in a cloud environment and supporting systems. Cloud adoption continues to permeate throughout organizations as they embrace agile software development. While they are seeing great dividends in cost-effectiveness and flexibility, building security throughout the software development lifecycle is proving to be difficult, citing increased misconfigurations from user error. At the moment, there is a severe learning curve around DevSecOps and organizations are struggling to find the right expertise to plug this knowledge gap.",
    ],
    sections: [
      {
        title: "Overview",
        icon: "cloud",
        body: "The benefits of rapid deployment, flexibility, low up-front costs, and scalability have made cloud computing virtually universal among organizations of all sizes, often as part of a hybrid/multi-cloud infrastructure architecture. It also leads to security challenges, as there are multiple security concerns due to the highly automated nature of the environment, and numerous integration points with public cloud systems. In2IT EBS facilitates its customers with technologies, policies, controls, and services that protect cloud data, applications, and infrastructure from threats.",
      },
    ],
  },
  {
    slug: "identity-and-access-management",
    name: "Identity and Access Management",
    group: "cyber-security-enterprise-risk",
    icon: "key",
    sourceUrl: "https://in2itebs.com/identity-and-access-management-2/",
    image: { src: "/services/live/identity-and-access-management.jpg", alt: "Identity and Access Management" },
    metaTitle: "Identity and Access Management",
    metaDescription:
      "Identity and Access Management ensures that the right people and job roles in your organization can access the tools they need to do their jobs.",
    intro: [
      "Identity and Access Management ensures that the right people and job roles in your organization (identities) can access the tools they need to do their jobs. Identity management and access systems enable your organization to manage employee apps without logging into each app as an administrator. Identity and access management systems enable your organization to manage a range of identities including people, software, and hardware like robotics and IoT devices.",
      "Identity & Access Management is not just for employees anymore. Organizations must be able to provide secure access for contractors and business partners, remote and mobile users, and customers.",
    ],
    sections: [
      {
        title: "Manage user identities",
        icon: "users",
        iconImage: "/services/icons/iam-1.png",
        body: "Identity and Access Management systems can be the sole directory used to create, modify, and delete users, or it may integrate with one or more other directories and synchronize with them. Identity and access management can also create new identities for users who need a specialized type of access to an organization's tools.",
      },
      {
        title: "Provisioning and Deprovisioning Users",
        icon: "settings",
        iconImage: "/services/icons/iam-2.png",
        body: "Specifying which tools and access levels (editor, viewer, administrator) to grant a user is called provisioning. Identify and Access Management tools allow IT departments to provision users by role, department, or other groupings in consultation with the managers of that department.",
      },
      {
        title: "Multi-factor Authentication",
        icon: "lock",
        iconImage: "/services/icons/iam-3.png",
        body: "Adds another layer of protection by requiring users to present two or more identifying credentials in addition to a username to gain access to applications.",
      },
      {
        title: "Risk-based Authentication",
        icon: "shield-alert",
        iconImage: "/services/icons/iam-4.png",
        body: "Also known as adaptive authentication, a risk-based authentication solution prompts a user for Multi-factor Authentication only when it detects the presence of higher risk.",
      },
      {
        title: "Authorize Users",
        icon: "check-circle",
        iconImage: "/services/icons/iam-5.png",
        body: "Access management ensures a user is granted the exact level and type of access to a tool that they're entitled to. Users can also be partitioned into groups or roles so large cohorts of users can be granted the same privileges.",
      },
      {
        title: "Reporting",
        icon: "file-text",
        iconImage: "/services/icons/iam-6.png",
        body: "Identity and Access Management tools generate reports after most actions taken on the platform (like login time, systems accessed, and type of authentication) to ensure compliance and assess security risks.",
      },
    ],
  },

  // ---------------------------------------------------------------- Digital Services
  {
    slug: "digital-services",
    name: "Digital Services",
    group: "digital-services",
    icon: "sparkles",
    sourceUrl: "https://in2itebs.com/digital-services/",
    metaTitle: "Digital Services",
    metaDescription:
      "Our Digital Services are crafted to empower your business, streamline operations and enhance customer engagement through a comprehensive suite of offerings.",
    intro: [
      "In today's rapidly evolving digital landscape, staying ahead means leveraging cutting-edge technology and innovative solutions. Our Digital Services are crafted to empower your business, streamline operations, and enhance customer engagement through a comprehensive suite of offerings.",
    ],
    // The picture-icons are the existing page's own (wp-content/uploads/2024/07/Untitled-design-*.png).
    sections: [
      {
        title: "Digital Transformation",
        icon: "rocket",
        iconImage: "/services/icons/digital.png",
        href: svc("digital-transformation-services"),
        body: "Accelerate innovation and maintain competitiveness with our Digital Transformation services. We help you reimagine your business processes, culture, and customer experiences through strategic adoption of digital technologies. Our customized approach ensures seamless integration, enhanced operational efficiency, and sustained growth in the digital age.",
      },
      {
        title: "Application Development",
        icon: "code",
        iconImage: "/services/icons/digital-4.png",
        href: svc("application-development-maintenance-services-adms"),
        body: "Harness our expertise in custom application development to create robust, scalable, and user-friendly software solutions tailored to your business needs. From concept to deployment, we deliver high-performance applications that drive growth and efficiency.",
      },
      {
        title: "Business Intelligence (BI)",
        icon: "bar-chart",
        iconImage: "/services/icons/digital-1.png",
        body: "Turn your data into actionable insights with our Business Intelligence services. We provide advanced analytics, reporting, and visualization tools that empower you to make informed decisions and gain a competitive edge in your industry.",
      },
      {
        title: "Digital Content Creation",
        icon: "presentation",
        iconImage: "/services/icons/digital-6.png",
        body: "Engage your audience with compelling digital content crafted by our creative experts. From website copy and social media posts to video production and graphic design, we deliver high-quality content that resonates with your target audience and enhances your online presence.",
      },
      {
        title: "Cloud Solutions",
        icon: "cloud",
        iconImage: "/services/icons/digital-5.png",
        body: "Optimize your IT infrastructure with our comprehensive Cloud Solutions. We offer cloud migration, management, and security services that ensure seamless integration, enhanced performance, and scalability for your business operations.",
      },
      {
        title: "IT Consulting",
        icon: "briefcase",
        iconImage: "/services/icons/digital-3.png",
        body: "Maximize your IT investments with our strategic IT Consulting services. Our experts offer guidance on technology adoption, project management, and system optimization to help you achieve your business objectives efficiently and effectively.",
      },
      {
        title: "Managed IT Services",
        icon: "settings",
        iconImage: "/services/icons/digital-2.png",
        body: "Focus on your core business while we handle your IT needs with our Managed IT Services. From network management and technical support to software updates and hardware maintenance, we provide comprehensive solutions to keep your IT infrastructure running smoothly.",
      },
    ],
    closing: [
      "Our Digital Services are designed to help you harness the power of technology, improve operational efficiency, and achieve your business goals. Partner with us to drive innovation and stay competitive in the digital age.",
    ],
  },
  {
    slug: "digital-transformation-services",
    name: "Digital Transformation Services",
    group: "digital-services",
    icon: "rocket",
    sourceUrl: "https://in2itebs.com/digital-transformation-services/",
    metaTitle: "Digital Transformation Services",
    metaDescription:
      "Transform your business for the digital age: strategy, process automation, customer experience, data-driven decisions, cloud integration, change management and more.",
    intro: [
      "Transform your business for the digital age with our comprehensive Digital Transformation services. We help you leverage the latest technologies to enhance your processes, improve customer experiences, and drive innovation. Our tailored solutions are designed to meet your unique needs and ensure a seamless transition to a more agile, efficient, and competitive organization.",
    ],
    sections: [
      {
        title: "Digital Strategy Development",
        icon: "map",
        iconImage: "/services/icons/dts-1.jpg",
        body: "Craft a clear and effective digital strategy that aligns with your business objectives. Our experts work with you to identify opportunities for digital innovation, set strategic goals, and create a roadmap for digital transformation.",
      },
      {
        title: "Process Automation",
        icon: "bot",
        iconImage: "/services/icons/dts-2.jpg",
        body: "Streamline your operations with process automation. We implement advanced automation technologies to reduce manual tasks, increase efficiency, and improve accuracy across your business processes.",
      },
      {
        title: "Customer Experience Enhancement",
        icon: "heart",
        iconImage: "/services/icons/dts-3.jpg",
        body: "Enhance your customer interactions through personalized and engaging digital experiences. We help you leverage data analytics, artificial intelligence, and other technologies to understand customer needs and deliver tailored solutions that drive satisfaction and loyalty.",
      },
      {
        title: "Data-Driven Decision Making",
        icon: "bar-chart",
        iconImage: "/services/icons/dts-4.jpg",
        body: "Harness the power of data to make informed business decisions. Our services include implementing advanced analytics, big data solutions, and business intelligence tools to provide you with actionable insights and a competitive edge.",
      },
      {
        title: "Cloud Integration",
        icon: "cloud",
        iconImage: "/services/icons/dts-5.jpg",
        body: "Maximize the benefits of cloud computing with our cloud integration services. We assist you in migrating to the cloud, managing cloud resources, and ensuring seamless integration with your existing systems for improved scalability and flexibility.",
      },
      {
        title: "Digital Culture and Change Management",
        icon: "users",
        iconImage: "/services/icons/dts-6.jpg",
        body: "Foster a digital-first culture within your organization. We provide change management support to help your team adapt to new technologies and processes, ensuring a smooth and successful transformation.",
      },
      {
        title: "Cybersecurity and Risk Management",
        icon: "shield",
        iconImage: "/services/icons/dts-7.jpg",
        body: "Safeguard your digital assets with our comprehensive cybersecurity services. We offer risk assessments, security strategy development, and implementation of robust security measures to protect your data and ensure compliance with regulations.",
      },
      {
        title: "Innovation and Emerging Technologies",
        icon: "lightbulb",
        iconImage: "/services/icons/dts-8.jpg",
        body: "Stay ahead of the curve by exploring and adopting emerging technologies. We help you identify and implement cutting-edge solutions such as artificial intelligence, machine learning, blockchain, and the Internet of Things (IoT) to drive innovation and growth.",
      },
      {
        title: "IT Infrastructure Modernization",
        icon: "server",
        iconImage: "/services/icons/dts-9.jpg",
        body: "Upgrade your IT infrastructure to support your digital transformation initiatives. Our experts provide guidance on modernizing your hardware, software, and network resources to enhance performance, reliability, and scalability.",
      },
    ],
    closing: [
      "Our Digital Transformation services are designed to help you navigate the complexities of the digital landscape and achieve sustainable growth. Partner with us to unlock the full potential of digital technologies and transform your business for the future.",
    ],
  },
  {
    slug: "application-development-maintenance-services-adms",
    name: "Application Development & Maintenance Services (ADMS)",
    group: "digital-services",
    icon: "code",
    sourceUrl: "https://in2itebs.com/application-development-maintenance-services-adms-2/",
    metaTitle: "Application Development & Maintenance Services (ADMS)",
    metaDescription:
      "From requirements gathering to design, testing, implementation and integration, In2IT EBS supports your organization in every step of application development.",
    image: { src: "/services/live/adms.jpg", alt: "Application development" },
    intro: [
      "The process of developing computer software or a set of programs to accomplish the many functions that a business requires is known as application development. Applications help organizations automate operations and boost productivity by doing everything from calculating monthly budgets to arranging sales reports. Be it Requirements Gathering, Designing, Testing, Implementation, and Integration – In2IT EBS supports your organization in every step of Application Development.",
    ],
    sectionsHeading: "Types of Application Development We Offer",
    sections: [
      {
        title: "Custom Application Development",
        icon: "code",
        body: "Custom Application development is the process of designing, creating, and deploying software tailored to specific needs.",
      },
      {
        title: "Rapid Application Development",
        icon: "zap",
        body: "RAD (Rapid Application Development) emphasizes rapid prototyping and quick feedback over long, drawn-out development cycles.",
      },
      {
        title: "Low-Code / No-Code Application Development",
        icon: "layout",
        body: "Low-code / No-Code platforms provide intuitive visual interfaces that make it simple for non-programmers to create and run programs. To create automated workflows, you can drag and drop snippets of code and adjust them depending on business logic.",
      },
      {
        title: "Mobile Application Development",
        icon: "smartphone",
        body: "The design of software for mobile devices that is optimized to take advantage of the products' particular features and hardware is known as mobile app development.",
      },
      {
        title: "Web Application Development",
        icon: "globe",
        body: "Applications hosted on a web server are software developed for specific purposes. All internet-enabled devices, including phones, laptops, and desktops, can access them.",
      },
      {
        title: "Enterprise Application Development",
        icon: "building",
        body: "Applications developed for large-scale organizations are known as enterprise applications. They support enterprise-grade features, like massive data storage and automation of complex business processes.",
      },
    ],
  },
  {
    slug: "application-maintenance-support",
    name: "Application Maintenance & Support",
    group: "digital-services",
    icon: "wrench",
    sourceUrl: "https://in2itebs.com/application-maintenance-support/",
    metaTitle: "Application Maintenance & Support",
    metaDescription:
      "Our application support and maintenance services ensure that all types of applications are highly available, reliable and relevant to your business's constantly changing requirements.",
    image: {
      src: "/services/live/application-maintenance-support.jpg",
      alt: "Application maintenance and support services",
    },
    introHeading: "Make better future decisions.",
    intro: [
      "Our application support and maintenance services ensure that all types of applications are highly available, reliable, and relevant to your business's constantly changing requirements. In2IT EBS enables our clients' businesses to continuously reinvent system landscapes and achieve IT goals that align with business needs. By aligning IT with business value, we help clients push the envelope beyond cost and quality.",
      "We support our clients end-to-end be it On-Call Production Support, Proactive Maintenance, Bug Fixing, Future Enhancements, End User Support & Training.",
    ],
    sectionsHeading: "Types of Application Development we offer",
    layout: "list",
    sections: [
      { title: "Application Maintenance", icon: "wrench" },
      { title: "Performance Testing & Monitoring", icon: "eye" },
      { title: "Application Support", icon: "heart" },
      { title: "Re-Engineering of Legacy System", icon: "refresh" },
      { title: "Migration and Integration", icon: "cloud-upload" },
      { title: "Enhancement & Upgradation", icon: "trending-up" },
      { title: "Documentation", icon: "file-text" },
      { title: "Quality Testing", icon: "check-circle" },
      { title: "Extensive User Support", icon: "users" },
    ],
  },
  {
    slug: "development-maintenance",
    name: "Development & Maintenance",
    group: "digital-services",
    icon: "settings",
    sourceUrl: "https://in2itebs.com/development-maintenance/",
    metaTitle: "Development & Maintenance",
    metaDescription:
      "In2IT EBS's Application Development and Maintenance (ADM) Services include Application Development, Application Maintenance and Enhancements, Custom Solution Implementation, Legacy Modernization, Enterprise Application Integration and Data Transformation.",
    image: {
      src: "/services/live/adm-offerings.jpg",
      alt: "Application Development and Maintenance Services offerings",
    },
    introHeading:
      "Digitalization at its best. Designing applications and platforms with state-of-art infrastructure and foundation.",
    intro: [
      "In2IT EBS's Application Development and Maintenance (ADM) Services include Application Development, Application Maintenance and Enhancements, Custom Solution Implementation, Legacy Modernization, Enterprise Application Integration and Data Transformation. Our proprietary next generation ADM platform leverages extreme automation and DevOps-based agile software delivery practices.",
      "The digital world has compelled organizations to change, and application development must change accordingly.",
      "In2IT EBS's Application Development and Maintenance service enable an organization's IT architecture to keep pace with the growing business requirements. Our deep domain expertise allows us to work in complicated application environments and manage mission-critical applications efficiently.",
    ],
    sections: [
      {
        title: "We help our clients to",
        icon: "check-circle",
        bullets: [
          "Transform existing applications to leverage emerging technologies",
          "Conduct in-depth portfolio analysis to determine growth opportunities",
          "Implement agile, scalable, and efficient processes by migrating to cloud",
          "Develop highly customized workflows for multi-channel content distribution",
          "Boost digital capabilities to unlock the full potential of IoT, AI, and mobile solutions",
        ],
      },
    ],
    closing: [
      "In2IT EBS manages critical applications for leading companies, helping customers reduce cost with zero down time.",
    ],
  },
  {
    slug: "agile-devops",
    name: "Agile & Devops",
    title: "Agile & DevOps",
    group: "digital-services",
    icon: "git-branch",
    sourceUrl: "https://in2itebs.com/agile-devops-2/",
    image: { src: "/services/live/devops-graphic.jpg", alt: "Agile & DevOps" },
    metaTitle: "Agile & DevOps",
    metaDescription:
      "Our DevOps services use an agile methodology to bridge the gap in software development, IT operations and quality assurance.",
    introHeading: "Ensuring software-driven, cutting-edge innovative development",
    intro: [
      "Don't you wish to communicate, collaborate, automate, and integrate to remove bottlenecks from the system?",
      "Agile framework for software development is known to improve efficiency, feedback, and innovation in the software lifecycle. We can help you implement this framework. Our DevOps services use an agile methodology to bridge the gap in software development, IT operations, and quality assurance. With us, you can develop products quickly to improve the operational effectiveness of your software. Using the right processes and high-quality software can push you from processes to people.",
    ],
    sections: [],
  },

  // ---------------------------------------------------------------- Data Analytics & AI
  {
    slug: "data-analytics-ai",
    name: "Data Analytics & AI",
    group: "data-analytics-ai",
    icon: "brain",
    sourceUrl: "https://in2itebs.com/data-analytics-ai-2/",
    metaTitle: "Data Analytics & AI",
    metaDescription:
      "Business Analytics and Intelligence services that help you make quick decisions and enhance business performance with accurate information.",
    image: { src: "/services/data-analytics-ai.jpg", alt: "Data Analytics & AI" },
    intro: [
      'In today\'s hyper-connected world, data – structured, unstructured, semi-structured – carrying important information is rising in volume. The rapid growth of information is leading to the problem of extracting the required information from the variety of data. Business Analytics & Intelligence addresses these challenges. With the help of BI, organizations can monitor and track KPIs in the form of reports, dashboards – which can answer few questions like – "what had already happened?", "what will happen next?", "what is the best that can happen?" – Answer to these questions can help organization in forecasting about their business. Business Intelligence can help you in making data driven decisions to face the business challenges.',
      "Business Intelligence Solutions help in – improved decision-making process, knowing your business in metrics report, explaining business query fast, enabling real-time analysis, determining up-selling opportunities, making it easy to access & share information. In2IT EBS offers Business Analytics and Intelligence services that can help you to make quick decisions & enhance business performance with accurate information.",
      "Our Business Analytics Services help our customer in understanding the current trend, predicting the future and analyzing the risks in advance.",
    ],
    sectionsHeading: "Our data analytics and AI services",
    sections: [
      {
        title: "Database & Data Management",
        icon: "database",
        href: svc("database-data-management"),
        body: "Manage your data and increase productivity.",
      },
      {
        title: "Predictive Analysis",
        icon: "line-chart",
        href: svc("predictive-analysis"),
        body: "Driving business efficiency with intelligent machines.",
      },
      {
        title: "AI & Machine Learning",
        icon: "brain",
        href: svc("ai-machine-learning"),
        body: "Make better future decisions.",
      },
      {
        title: "Big Data",
        icon: "hard-drive",
        href: svc("big-data"),
        body: "Make enhanced decisions to improve performance.",
      },
      {
        title: "Blockchain",
        icon: "link",
        href: svc("blockchain"),
        body: "Empowering businesses with advanced blockchain services.",
      },
      {
        title: "Robotic Process Automation (RPA)",
        icon: "bot",
        href: svc("robotic-process-automation"),
        body: "Experience the ease and speed of no-code workflow management and robotic process automation.",
      },
    ],
  },
  {
    slug: "database-data-management",
    name: "Database & Data Management",
    group: "data-analytics-ai",
    icon: "database",
    sourceUrl: "https://in2itebs.com/database-data-management-2/",
    image: { src: "/services/live/database-data-management.jpg", alt: "Data Management" },
    metaTitle: "Database & Data Management",
    metaDescription:
      "Our team helps businesses manage, clean and extract their data for valuable information: accurate reports, data mining and data analysis.",
    introHeading: "Manage your data and increase productivity.",
    intro: [
      "As organizations produce tremendous amounts of data every day, management of this data is extremely essential. This data is related to customers, social media trends, market transactions, company transactions, product-related data, etc. It makes sense to manage this collected data to acquire actionable insights. Since most of this data is raw, it can't provide any value without management and cleaning.",
      "We help you achieve just that with our services. Our team helps the businesses to manage, clean, and extract this data for valuable information. Using this data, you know you can create several opportunities. We only lead you toward these opportunities.",
    ],
    sections: [
      {
        title: "Accurate Reports",
        icon: "file-text",
        body: "We help you create accurate reports to assist you in informed decision making. Using these reports, you can evaluate the past situation of your organization, which allows you to make healthy future decisions.",
      },
      {
        title: "Data Mining",
        icon: "search",
        body: "Our team holds years of expertise in data mining, which means we can help you predict data patterns with ease. Data has so much potential, we just help you extract this potential and solve complex business scenarios.",
      },
      {
        title: "Data Analysis",
        icon: "bar-chart",
        body: "With us, you can receive assistance for cleaning, structuring, transforming, and modeling collected data. Once we have achieved this together, you can extract crucial business insights for successful business execution.",
      },
    ],
  },
  {
    slug: "predictive-analysis",
    name: "Predictive Analysis",
    group: "data-analytics-ai",
    icon: "line-chart",
    sourceUrl: "https://in2itebs.com/predictive-analysis/",
    image: { src: "/services/live/predictive-analysis.jpg", alt: "Predictive Analysis" },
    metaTitle: "Predictive Analysis",
    metaDescription:
      "Cutting-edge, data-driven solutions that deep dive into existing processes, customer data and market data to offer smart, actionable information.",
    introHeading: "Driving business efficiency with intelligent machines.",
    intro: [
      "Predictive analysis allows you to optimize your functions, drive business, and create a better future for your organization. Making data-driven decisions and using informative insights for future business processes empower businesses to lead towards opportunities and growth.",
      "We help you grab these opportunities in a hassle-free manner. Our team creates cutting-edge, data-driven solutions that deep dive into existing processes, customer data, and market data. Using all this data, these solutions offer smart, actionable information so that you can make future-proof decisions.",
    ],
    sections: [
      {
        title: "Deeper Insights",
        icon: "eye",
        body: "Gain deep insights regarding your business, processes, functioning, and customer needs. With us, you can make everything better.",
      },
      {
        title: "Unknown Patterns",
        icon: "search",
        body: "Uncover the unknown industry patterns, adopt trends quickly, and grab new opportunities for enhanced, data-driven working.",
      },
      {
        title: "Customer Understanding",
        icon: "users",
        body: "With data, understand your customer, their needs, and the methods to fulfil these needs for enhanced customer engagement.",
      },
      {
        title: "High Business Performance",
        icon: "trending-up",
        body: "Data-driven insights allow organizations to drive high business performance and know what is right or wrong for your business.",
      },
      {
        title: "Strategic Decisions",
        icon: "target",
        body: "Data gives you the power to take strategic business decisions. You can understand the strategic needs of your organization.",
      },
      {
        title: "Predictive Behaviour",
        icon: "line-chart",
        body: "Predict the behaviour of new processes and procedures even before you implement it. Use data to enhance your functioning.",
      },
    ],
  },
  {
    slug: "ai-machine-learning",
    name: "AI & Machine Learning",
    group: "data-analytics-ai",
    icon: "brain",
    sourceUrl: "https://in2itebs.com/ai-machine-learning-2/",
    image: { src: "/services/icons/aiml-1.png", alt: "AI & Machine Learning" },
    metaTitle: "AI & Machine Learning",
    metaDescription:
      "Make your business applications and processes more intelligent with the power of AI and Machine Learning: process automation, predictive analytics and personalized experience.",
    introHeading: "Make better future decisions",
    intro: [
      "Make your business applications and processes more intelligent with the power of AI and Machine Learning Business Technology Platform. AI and Machine Learning provide strategic services & applications that automate and optimize corporate processes – and enrich customer experience across the intelligent suite.",
      "Help customers reduce manual repetitive tasks and enter the machine learning journey by using AI and the capabilities of these services to solve business problems in a wide range of different business processes.",
      "Artificial intelligence is the capability of a computer system to mimic human cognitive functions such as learning and problem-solving.",
      "Machine learning is an application of AI. It's the process of using mathematical models of data to help a computer learn without direct instruction. This enables a computer system to continue learning and improving on its own, based on experience.",
    ],
    sections: [
      {
        title: "Process Automation",
        icon: "bot",
        iconImage: "/services/icons/aiml-2.png",
        body: "Automate your business processes for operational efficiency. Help your team work in more strategic roles while artificial intelligence bots complete redundant and repetitive tasks. This can help you complete work in short turnaround time and cost-effective manner.",
      },
      {
        title: "Predictive Analytics",
        icon: "line-chart",
        iconImage: "/services/icons/aiml-3.png",
        body: "Who doesn't want a peek in the future? Whenever you are making a business decision, you don't have to guess the future outcome. We can help you use the potential of data mining, machine learning, and predictive modeling for understanding future outcomes.",
      },
      {
        title: "Knowledge-based Implementation",
        icon: "lightbulb",
        iconImage: "/services/icons/aiml-4.png",
        body: "Utilizing the power of data collected, we can help you mine insights and use it for business advantage. Based on the insights, you can optimize your workflow for end-to-end effectiveness and allow your business to make way for growth and opportunities.",
      },
      {
        title: "Personalized Customer Experience",
        icon: "heart",
        iconImage: "/services/icons/aiml-5.png",
        body: "Personalize your users' experience with AI. Understand market trends, evaluate user needs, and act accordingly. Modify your products to make them market-ready and customize your services to make them more user-friendly, which can together drive customer experience.",
      },
    ],
  },
  {
    slug: "big-data",
    name: "Big Data",
    group: "data-analytics-ai",
    icon: "hard-drive",
    sourceUrl: "https://in2itebs.com/big-data-2/",
    image: { src: "/services/live/big-data.jpg", alt: "Big Data" },
    metaTitle: "Big Data",
    metaDescription:
      "Big data consulting, infrastructure, support and insights: turn drawbacks to opportunities and process actionable insights for strategic business decisions.",
    introHeading: "Make enhanced decisions to improve performance",
    intro: [
      "Today, organizations collect millions and millions of data in an attempt to improve business processes, customer engagement, and business decisions. However, traditional storage methods are stagnant and it is impossible to analyze this data with old approaches.",
      "This is why we help you with big data analytics. Using our big data solutions, you can turn drawbacks to opportunities and process actionable insights for strategic business decisions. Our team delivers a solution which not only helps you meet the unique information needs but also benchmark performance, improve data-driven performance, increase collaboration, and enhance enterprise data management.",
    ],
    sections: [
      {
        title: "Big Data Consulting",
        icon: "briefcase",
        iconImage: "/services/icons/big-data.png",
        body: "We help our clients define their big data strategy, plan and implement it. With years of industry experience, our team has gained expertise in several big data tools. Using this knowledge, we can assist you with your big data infrastructure.",
      },
      {
        title: "Big Data Infrastructure",
        icon: "server",
        body: "Big data infrastructure is extremely essential for your organization. Our team installs and implements complex Hadoop architecture, maintains it, and optimizes it for optimum performance. We help you encounter your big data success.",
      },
      {
        title: "Big Data Support",
        icon: "wrench",
        body: "It is possible for you to face difficulties in big data functioning and implementation. But, don't worry, our team is always available to resolve your issues at earliest. We can assist you with custom application development and application integration.",
      },
      {
        title: "Big Data Insights",
        icon: "eye",
        body: "The final goal of big data services is to reap value from this data. We have industry experience of various big data tools such as SAS, Tableau, R, etc. Using these tools, we empower you to use data for modeling, predictive analysis, and visualization.",
      },
    ],
  },
  {
    slug: "blockchain",
    name: "Blockchain",
    group: "data-analytics-ai",
    icon: "link",
    sourceUrl: "https://in2itebs.com/blockchain/",
    image: { src: "/services/icons/blockchain.png", alt: "Blockchain" },
    metaTitle: "Blockchain",
    metaDescription:
      "Blockchain is the key to your transformation: a distributed ledger that lets businesses secure and encrypt transactions and make data transactions tamper-proof.",
    introHeading: "Empowering businesses with advanced blockchain services.",
    intro: [
      "Blockchain is the key to your transformation. This distributed ledger allows businesses to secure and encrypt transactions, which help you make your data transactions tamper-proof. The network formed by blockchain is chained together to exhibit security, reliability, and digital effectiveness.",
      "While originally blockchain was developed as a medium for using digital currency bitcoin, it is now being used by various organizations to improve the security of data. The data stored inside the blocks of the blockchain is practically impossible to modify or change, which is the reason behind the security structure of the blockchain.",
    ],
    sections: [
      {
        title: "Accelerated Growth",
        icon: "trending-up",
        body: "Blockchain provides a new way of carrying out transactions. When you implement this technology for transactions, your customers automatically generate trust in your organization. This can help you improve customer loyalty and ultimately accelerate growth.",
      },
      {
        title: "Secured Processes",
        icon: "lock",
        body: "With the advanced encryption offered by blockchain, it is not possible for hackers to get into your system. This allows you to maintain data integrity and customers' trust in the business. Further, you can create a safe place for your confidential and important business transactions.",
      },
      {
        title: "Improved ROI",
        icon: "receipt",
        body: "With blockchain, you can move towards a smarter, efficient, and modern method of conducting business. It helps you streamline your business tasks, tamper-proof your transactions, and offer reliable services. All these aspects together drive higher ROI.",
      },
      {
        title: "High Customer Engagement",
        icon: "heart",
        body: "Every customer wants to connect to a network which is not susceptible to fraud and hacker invasions. When they get this network and services with you, they engage more with your brand. It becomes easier to gain new customers and effectively retain existing customers.",
      },
    ],
  },
  {
    slug: "robotic-process-automation",
    name: "Robotic Process Automation (RPA)",
    title: "Robotic Process Automation",
    group: "data-analytics-ai",
    icon: "bot",
    sourceUrl: "https://in2itebs.com/robotic-process-automation-2/",
    image: { src: "/services/live/robotic-process-automation.jpg", alt: "Robotic Process Automation" },
    metaTitle: "Robotic Process Automation",
    metaDescription:
      "RPA solutions that help you innovate and adapt to change by making workflow management and task automation simpler and faster.",
    intro: [
      "Experience the ease and speed of no-code workflow management and robotic process automation (RPA). RPA is a software technique that makes it simple to create, deploy, and manage software robots that mimic human movements while dealing with digital systems and software.",
      "In2IT EBS provides you with RPA solutions that help you innovate and adapt to change by making workflow management and task automation simpler and faster.",
      "Logging into applications and systems, transferring files and folders, extracting, copying, and inserting data, filling in forms, and generating routine analysis and reports are all tasks that software robots execute instead of people.",
      "RPA can even execute cognitive tasks such as deciphering text, participating in chats and conversations, comprehending unstructured data, and making complicated decisions using advanced machine learning models.",
    ],
    sections: [
      {
        title: "Business Benefits of Robotic Process Automation",
        icon: "check-circle",
        bullets: [
          "Faster, simpler way to build workflows and adopt automation",
          "Enhanced ability to rapidly adapt, improve, and innovate business processes",
          "Simplified process automation using a unified developer experience",
          "Accelerate digital transformation",
          "Great resilience by matching workload peaks and by responding to big demand spikes",
          "Higher accuracy by reducing manual errors and automating repetitive tasks",
          "Operate with confidence by integrating all your business applications and IT Infrastructure",
          "Simplify projects with predefined process flows, forms, business rules, and process visibility dashboards",
          "Increase business flexibility in responding to changing economic and industry conditions",
        ],
      },
    ],
  },
];

export function getServicePage(slug: string) {
  return servicePages.find((page) => page.slug === slug);
}

export function getServiceGroup(slug: string) {
  return serviceGroups.find((group) => group.slug === slug);
}

/** Every leaf item in a group, nested ones included, in menu order. */
export function flattenItems(items: NavItem[]): NavItem[] {
  return items.flatMap((item) => [item, ...(item.children ? flattenItems(item.children) : [])]);
}
