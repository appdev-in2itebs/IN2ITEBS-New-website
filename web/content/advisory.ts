import type { AdvisoryVisual } from "@/components/sections/advisory-diagrams";
/**
 * ADVISORY — the hub's new sections and the four service pages (owner's production brief,
 * "In2IT EBS – Advisory pages, website content", 27 November 2026). Copy is final and is used as
 * written; build notes from the brief are kept here as comments, not published.
 *
 * ── URLs ─────────────────────────────────────────────────────────────────────────────────────
 * The brief publishes these four under /services/advisory/<page>/. That is a deliberate exception
 * to the flat-URL rule in content/nav.ts: Advisory is sold as four services under one hub, and the
 * brief fixes the addresses.
 *
 * ── FIGURES THAT NEED CONFIRMING ─────────────────────────────────────────────────────────────
 * The brief's figures register says nothing marked "Confirm" publishes until the evidence is in
 * the project file. Those outcomes carry `confirm: true`. Preview builds (the demo site) show them
 * with a "To confirm" tag so they can be reviewed; production builds leave them out until
 * ADVISORY_FIGURES_CONFIRMED is set to true below, by the person holding the evidence.
 *
 * ── MAILBOX ──────────────────────────────────────────────────────────────────────────────────
 * Calls to action are meant for advisory@in2itebs.com, which internal IT is creating. Until it is
 * live they use the site's main address (V2Closing), as the brief instructs.
 */

export const ADVISORY_FIGURES_CONFIRMED = false;

export type Outcome = { figure: string; detail: string; confirm?: boolean };

export type AdvisoryPage = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  standfirst: string;
  heroImage: string;
  glance: { label: string; text: string }[];
  problem: {
    eyebrow: string;
    heading: string;
    intro?: string;
    items: { title: string; body: string }[];
  };
  /** Optional block between the problem and the diagram (the DPDP jurisdictions strip). */
  jurisdictions?: { rows: { market: string; law: string }[]; note: string };
  diagram: {
    title: string;
    intro: string;
    /** Which live diagram to draw (components/sections/advisory-diagrams.tsx). */
    visual: AdvisoryVisual;
    alt: string;
    captionLeft: string;
    captionRight: string;
  };
  services: { heading: string; items: { title: string; body: string }[] };
  receive?: {
    heading: string;
    intro?: string;
    specimen?: boolean;
    columns: string[];
    rows: string[][];
  };
  howItRuns?: { heading: string; steps: { title: string; body: string }[] };
  caseStudy: {
    heading: string;
    glance: { label: string; text: string }[];
    situation: string[];
    whatWeDid: { title: string; body: string }[];
    outcomes: Outcome[];
    quote: string;
  };
  related: { label: string; group: string; body: string; href: string }[];
  cta: { heading: string; body: string };
};

const A = "/services/advisory/";

export const advisoryPages: AdvisoryPage[] = [
  // ════════════════════════════════════════════ 2 · Transformation strategy and governance
  {
    slug: "transformation-strategy-and-governance",
    name: "Transformation strategy and governance",
    metaTitle: "Transformation strategy and governance | In2IT EBS",
    metaDescription:
      "Roadmaps, governance charters and stage gates for ERP and digital programmes — set before the build starts, and run through it.",
    h1: "A transformation plan that tells you when to stop, not only when to start.",
    standfirst:
      "Most transformations fail on sequence and authority, not technology: nobody agreed the order of change, who decides, or what evidence moves the programme from one stage to the next. We settle those three things before the first module is configured — and we stay to run them.",
    heroImage: "/hero/advisory-transformation-strategy.webp",
    glance: [
      {
        label: "For",
        text: "CFOs, CIOs and sponsors facing a multi-year ERP or digital programme; multi-entity groups and joint ventures",
      },
      {
        label: "You leave with",
        text: "A sequenced roadmap, a governance charter with stage gates, one operating model, a change plan",
      },
      { label: "Platform", text: "Independent — we advise before the platform is chosen" },
      { label: "Proof", text: "Infrastructure project management consultancy, pan-India" },
    ],
    // BUILD NOTE: the write-up's four challenges kept, reworded as consequences a sponsor
    // recognises; "vendor-aligned" removed; vendor selection moved to Enterprise architecture.
    problem: {
      eyebrow: "The problem",
      heading: "Where programmes go wrong",
      intro: "Four failure patterns show up in almost every stalled programme we are asked to review.",
      items: [
        {
          title: "The scope outgrows the budget",
          body: "Every unplanned customisation is a decision nobody was asked to make. Added together, they are the overrun.",
        },
        {
          title: "Every site does it its own way",
          body: "Without one process template, a new system only automates the inconsistency you already have.",
        },
        {
          title: "Accountability is shared, so it is no one's",
          body: "When finance, operations and the integrator all own a problem, nobody fixes it.",
        },
        {
          title: "Compliance arrives in testing",
          body: "GST, e-invoicing, TDS and data-residency rules found late become rework, not requirements.",
        },
      ],
    },
    diagram: {
      title: "Every gate is a point where the programme can be stopped on purpose",
      intro:
        "Spend climbs slowly while a programme is being decided and designed, then fast once the build starts. Gates placed before the climb are where governance pays for itself.",
      visual: "stage-gates",
      alt: "Programme spend rising over time, with five stage gates; stopping early costs far less than stopping late",
      captionLeft: "Illustrative. Gate names and evidence are agreed for each programme.",
      captionRight: "Gate evidence is written down before the gate, not after.",
    },
    services: {
      heading: "Four services, one sequence",
      items: [
        {
          title: "Roadmap",
          body: "A review of your applications, processes and data against where the business is heading. Out of it comes a capability maturity view and a phased roadmap that puts early wins next to the foundational work, such as an S/4HANA move or a cloud migration.",
        },
        {
          title: "Governance",
          body: "A steering structure, a RACI that names people rather than departments, stage gates with entry and exit evidence, risk and escalation rules and a KPI scorecard. It covers your teams, your integrators and your vendors equally — including us.",
        },
        {
          title: "Target operating model",
          body: "One process template across sites, entities and joint ventures before anything is built: lead-to-cash, source-to-pay, project accounting and who owns which master data.",
        },
        {
          title: "Change readiness",
          body: "A role-by-role impact assessment, a network of champions in the business, and adoption measures tracked after go-live — not training attendance.",
        },
      ],
    },
    receive: {
      heading: "Outputs, and what each one settles",
      columns: ["Area", "You receive", "What it settles"],
      rows: [
        [
          "Assessment",
          "Current-state review · capability maturity matrix · three-year roadmap",
          "Where the money goes first, and why",
        ],
        [
          "Governance",
          "Programme charter · named RACI · gate criteria · risk and escalation playbook",
          "Who decides, on what evidence, by when",
        ],
        [
          "Process and data",
          "Standard end-to-end process maps · master data governance policy",
          "One version of the numbers across every entity",
        ],
        [
          "Change",
          "Stakeholder impact map · champion network · adoption measures",
          "Whether the system is used, not just installed",
        ],
      ],
    },
    howItRuns: {
      heading: "From diagnosis to value review",
      steps: [
        { title: "Diagnose", body: "Sites, processes and systems reviewed with the people who run them." },
        { title: "Design", body: "Roadmap, operating model and governance charter agreed with the sponsor." },
        {
          title: "Govern",
          body: "We run or support the programme office through the gates — with integrators held to the same evidence.",
        },
        {
          title: "Review value",
          body: "Results measured against the business case, and the roadmap re-sequenced.",
        },
      ],
    },
    // BUILD NOTE — FIGURES TO CONFIRM: kept 40+ sites, 1,200+ staff, 12 sites, 18-month roadmap,
    // 18 → under 5 days, within 4%. Removed "35% faster margin visibility" (contradicts the 72% cut)
    // and "zero critical scope overruns".
    caseStudy: {
      heading: "An infrastructure project management consultancy, pan-India",
      glance: [
        { label: "Industry", text: "Infrastructure, transport and real estate" },
        { label: "Scale", text: "1,200+ engineers, supervisors and corporate staff" },
        { label: "Footprint", text: "40+ active highway, urban transit and water sites" },
        { label: "Scope", text: "Strategy, governance and roadmap ahead of ERP" },
      ],
      situation: [
        "The firm's order book was growing quickly on central and state infrastructure tenders, and its project controls had not kept up. Site teams tracked budgets, subcontractor bills and physical milestones on separate spreadsheets. Corporate finance ran on a legacy accounting package.",
        "Leadership had no live view of project margin, retention money or the working capital tied up in each site. Joint-venture projects were governed differently from one another, and audits ran late.",
      ],
      whatWeDid: [
        {
          title: "Diagnosis and one template",
          body: "We reviewed 12 flagship sites and the head office, then brought work breakdown structures, subcontractor measurement books and milestone billing rules into a single enterprise template.",
        },
        {
          title: "Governance charter",
          body: "A two-tier charter with executive stage gates, a RACI across finance, procurement and site operations, and master data rules for vendor, material and project codes.",
        },
        {
          title: "Roadmap and business case",
          body: "An 18-month phased plan onto an integrated ERP and project portfolio platform, with GST e-invoicing, TDS, joint-venture accounting and mobile site reporting designed in from the start.",
        },
      ],
      outcomes: [
        {
          figure: "18 → under 5 days",
          detail: "Monthly cost-to-complete consolidation, through standard structures and governance reporting",
          confirm: true,
        },
        {
          figure: "40+ sites, one structure",
          detail:
            "Work breakdown and billing standardised across every active site and JV entity before the build began",
        },
        {
          figure: "Within 4%",
          detail: "Of the baseline budget for the ERP build that followed, as stage gates kept customisation in check",
          confirm: true,
        },
        {
          figure: "Audit trail in place",
          detail: "For retention money, statutory deductions and client milestone certification",
        },
      ],
      quote:
        "The cheapest place to fix a programme is before the build starts. Here, the template and the gates were in place before a single module was configured.",
    },
    related: [
      {
        label: "Enterprise architecture",
        group: "Advisory",
        body: "The target estate, the route to it, and the platform decisions that follow.",
        href: `${A}enterprise-architecture/`,
      },
      {
        label: "Data protection and privacy",
        group: "Advisory",
        body: "DPDP and its equivalents, built into the systems that hold the data.",
        href: `${A}data-protection-and-privacy/`,
      },
      {
        label: "AI governance",
        group: "Advisory",
        body: "Risk-tiered controls so safe AI moves faster and risky AI is caught.",
        href: `${A}ai-governance/`,
      },
      {
        label: "SAP",
        group: "Enterprise Platforms",
        body: "Where the roadmap is built — implementation, migration and managed service.",
        href: "/services/sap/",
      },
    ],
    cta: {
      heading: "Planning a programme you cannot afford to restart?",
      body: "We will look at your roadmap and governance and tell you, in one conversation, where it is most likely to break.",
    },
  },

  // ════════════════════════════════════════════ 3 · Enterprise architecture
  {
    slug: "enterprise-architecture",
    name: "Enterprise architecture",
    metaTitle: "Enterprise architecture | In2IT EBS",
    metaDescription:
      "Target architecture, independent platform selection, integration and master data design — an enterprise architecture built to be implemented.",
    h1: "Enterprise architecture that gets built, not framed.",
    standfirst:
      "Most enterprises do not lack software. They have too much of it, joined by interfaces nobody owns. We draw the target estate and the route to it, then make the platform decisions that follow — on the evidence, not on a partnership.",
    heroImage: "/hero/advisory-enterprise-architecture.webp",
    glance: [
      {
        label: "For",
        text: "Enterprises with many plants, entities or legacy systems; public bodies with audit obligations",
      },
      {
        label: "You leave with",
        text: "Current and target architecture, platform decision with total cost, integration and master data design, wave plan, review board",
      },
      { label: "Platform", text: "Independent — staying and optimising is always one of the options" },
      { label: "Proof", text: "Central public sector heavy engineering enterprise, India" },
    ],
    problem: {
      eyebrow: "The problem",
      heading: "Why estates get expensive",
      intro: "The cost of an estate is rarely in any one system. It is in the joins between them.",
      items: [
        {
          title: "Interfaces multiply faster than systems",
          body: "Every new point-to-point link has to be built, tested and kept alive through every upgrade.",
        },
        {
          title: "Every rule change breaks something",
          body: "A change in tax or procurement rules ripples through custom interfaces nobody fully understands.",
        },
        {
          title: "Simple questions take weeks",
          body: "Cost across plants or inventory across sites means manual reconciliation, so decisions wait.",
        },
        {
          title: "The platform is chosen before the design",
          body: "A product picked first sets the architecture, rather than the other way round.",
        },
      ],
    },
    diagram: {
      title: "Eight systems, joined two ways",
      intro:
        "Point to point, every pair of systems needs its own interface. Through one integration layer with shared master data, each system connects once.",
      visual: "eight-systems",
      alt: "Eight systems joined point to point need 28 interfaces; joined through one integration layer they need 8",
      captionLeft: "Illustrative estate of eight systems. Counts are exact: n(n−1)/2 against n.",
      captionRight: "The gap widens with every system you add.",
    },
    services: {
      heading: "Six services, from capability map to review board",
      items: [
        {
          title: "Target architecture and roadmap",
          body: "A capability and value-stream map, then current and target architecture across ERP, supply chain, customer and data — and the route between them.",
        },
        {
          title: "Platform selection and business case",
          body: "Total cost of ownership, licence exposure and an evaluation framework you can take to tender. Staying on what you have is always assessed alongside moving.",
        },
        {
          title: "Core modernisation",
          body: "A clean core for S/4HANA or any other system of record: standard where possible, extensions kept outside the core so upgrades stay routine.",
        },
        {
          title: "Integration and master data",
          body: "An API-led, event-driven integration layer and one master data model for materials, vendors, customers and project structures — with a named owner for every interface.",
        },
        {
          title: "Application portfolio rationalisation",
          body: "What to retire, consolidate or renegotiate across the estate. For a full estate inventory, see the Application Estate Review.",
        },
        {
          title: "Architecture governance",
          body: "An architecture review board, security-by-design guardrails, audit logging and data-residency rules for regulated and public-sector environments.",
        },
      ],
    },
    receive: {
      heading: "Documents a build team can work from",
      columns: ["Output", "What it contains"],
      rows: [
        ["Capability map", "Business capabilities and value streams, each mapped to the systems that serve it today"],
        [
          "Current and target architecture",
          "Applications, integrations, data flows and hosting — now, and at the end of the roadmap",
        ],
        [
          "Platform decision record",
          "Options considered, total cost over five years, licence exposure, and the reasoning for the choice",
        ],
        [
          "Integration catalogue",
          "Every interface: source, target, direction, frequency, owner and what happens when it fails",
        ],
        ["Master data model", "Ownership, golden source and quality rules for each master data object"],
        [
          "Wave plan and review board charter",
          "The order of migration, and who approves changes to the architecture afterwards",
        ],
      ],
    },
    // BUILD NOTE — removed "35% reduction in integration complexity" (no baseline or method).
    caseStudy: {
      heading: "A central public sector heavy engineering enterprise, India",
      glance: [
        { label: "Industry", text: "Manufacturing — engineered products" },
        { label: "Ownership", text: "Central public sector enterprise" },
        { label: "Footprint", text: "Multiple manufacturing units, regional project sites and central procurement" },
        { label: "Scope", text: "Enterprise architecture blueprint and modernisation roadmap" },
      ],
      situation: [
        "Decades of growth across plants and project offices had left engineering design, project execution, materials, finance and HR on separate databases and local ERP instances.",
        "Consolidating project cost and inventory across plants took weeks of manual reconciliation, delaying decisions on high-value turnkey projects. Meeting Central Vigilance Commission and CAG audit norms needed heavy manual effort because the audit trail broke at every system boundary. Custom point-to-point interfaces made upgrades costly and broke whenever tax or procurement rules changed.",
      ],
      whatWeDid: [
        {
          title: "One operating model",
          body: "We mapped engineer-to-order and procure-to-pay end to end across every division and project site, and agreed one standard model.",
        },
        {
          title: "Clean-core target",
          body: "A central ERP core integrated with engineering design (PLM), project management and e-procurement platforms.",
        },
        {
          title: "Integration and master data",
          body: "An API-first integration layer replacing point-to-point links, and one master data framework for materials, vendors and project work breakdown structures.",
        },
        {
          title: "Governance and security",
          body: "An architecture review board charter, role-based access, automated audit logging and data residency in line with public-sector security requirements.",
        },
        {
          title: "Wave plan",
          body: "A migration sequenced by business impact so that ongoing national infrastructure deliveries were not put at risk.",
        },
      ],
      outcomes: [
        {
          figure: "One master data model",
          detail: "For materials, vendors and project structures across every unit and site",
        },
        {
          figure: "APIs, not point-to-point",
          detail: "Reusable interfaces replace brittle custom links in the target design",
        },
        {
          figure: "Audit trail end to end",
          detail: "Designed across systems, so month-end and audit readiness no longer depend on manual stitching",
        },
        {
          figure: "Ready for what is next",
          detail: "A modular core able to take predictive maintenance, shop-floor data and AI forecasting",
        },
      ],
      quote:
        "In the public sector, an architecture is also an audit position. Here, the audit trail was designed in rather than reconstructed afterwards.",
    },
    related: [
      {
        label: "Transformation strategy and governance",
        group: "Advisory",
        body: "The order of change, and stage gates a programme can be stopped at.",
        href: `${A}transformation-strategy-and-governance/`,
      },
      {
        label: "Data protection and privacy",
        group: "Advisory",
        body: "DPDP and its equivalents, built into the systems that hold the data.",
        href: `${A}data-protection-and-privacy/`,
      },
      {
        label: "AI governance",
        group: "Advisory",
        body: "Risk-tiered controls so safe AI moves faster and risky AI is caught.",
        href: `${A}ai-governance/`,
      },
      {
        label: "Application Engineering",
        group: "Digital, Data & AI",
        body: "Where the integration layer and the applications around the core are built.",
        href: "/services/application-engineering/",
      },
    ],
    cta: {
      heading: "Paying to keep too many systems talking to each other?",
      body: "Send us your system list. We will show you where the interface count — and the cost — is coming from.",
    },
  },

  // ════════════════════════════════════════════ 4 · Data protection and privacy
  {
    slug: "data-protection-and-privacy",
    name: "Data protection and privacy",
    metaTitle: "Data protection and DPDP readiness | In2IT EBS",
    metaDescription:
      "DPDP Act, GDPR and ISO/IEC 27701 readiness built into the systems that hold personal data, ahead of the May 2027 obligations.",
    h1: "Privacy controls that live in your systems, not in a binder.",
    standfirst:
      "Privacy law is written in sections. Personal data lives in ERP tables, inboxes and shared drives. We translate one into the other — consent, retention, rights requests and breach response built into the systems you run, with evidence your auditors and clients can check.",
    heroImage: "/hero/advisory-data-protection.webp",
    glance: [
      {
        label: "For",
        text: "Organisations processing personal data in India or across our markets; firms facing client security due diligence",
      },
      {
        label: "You leave with",
        text: "Data inventory and record of processing, gap assessment, privacy charter, technical controls, vendor clauses, breach playbook",
      },
      { label: "Frameworks", text: "DPDP Act 2023 · GDPR · ISO/IEC 27701 · ISO/IEC 27001" },
      { label: "Proof", text: "Corporate law firm, India — 16 weeks" },
    ],
    // BUILD NOTE — NEW, TIME-SENSITIVE: dates from the MeitY notifications of 13 Nov 2025.
    // The diagram places "Today" from the build date and drops it once May 2027 has passed.
    problem: {
      eyebrow: "Why now",
      heading: "The DPDP deadline is close",
      intro:
        "Most of what the DPDP Act asks of a business — notices, consent, data principal rights, security safeguards and breach intimation — applies from May 2027.",
      items: [],
    },
    jurisdictions: {
      rows: [
        { market: "India", law: "DPDP Act 2023" },
        { market: "South Africa", law: "POPIA" },
        { market: "Kenya", law: "Data Protection Act 2019" },
        { market: "Singapore", law: "PDPA" },
        { market: "UAE", law: "PDPL" },
      ],
      note: "The laws of the markets where we have entities. One inventory and one control set, mapped to each.",
    },
    diagram: {
      title: "Where the DPDP timetable stands",
      intro:
        "The Rules were notified in November 2025 with an 18-month runway. The consent manager provisions have just taken effect. The core obligations follow in May 2027.",
      visual: "dpdp-timetable",
      alt: "DPDP timetable: Rules notified November 2025, consent manager provisions November 2026, core obligations May 2027",
      captionLeft: "Source: MeitY notifications under the DPDP Act, 13 November 2025.",
      captionRight: "Mapping your data is the step that takes longest.",
    },
    services: {
      heading: "Five services, from statute to system",
      items: [
        {
          title: "Regulatory readiness",
          body: "A gap assessment and roadmap against the DPDP Act, GDPR, ISO/IEC 27701 and ISO/IEC 27001 — then consent management, rights workflows and cross-border transfer controls put into operation.",
        },
        {
          title: "Data discovery and record of processing",
          body: "Where personal data actually sits across ERP systems including SAP, cloud storage and collaboration tools. A classification scheme, data lineage and a record of processing activities your auditor can test.",
        },
        {
          title: "Privacy by design",
          body: "Minimisation, encryption, masking and role-based access built into applications, APIs and every new programme from the start.",
        },
        {
          title: "Third-party governance",
          body: "Data processing agreements, vendor security assessments and ongoing monitoring across your suppliers and outsourcing partners.",
        },
        {
          title: "Breach preparedness",
          body: "Detection, a notification workflow aligned with CERT-In and DPDP timelines, and a response playbook rehearsed before it is needed.",
        },
      ],
    },
    receive: {
      heading: "A record of processing your auditor can test",
      intro:
        "The centre of the work is a record of every processing activity — what data, why, on what basis, for how long, shared with whom, and who owns it.",
      specimen: true,
      columns: ["Processing activity", "Personal data", "Purpose", "Basis", "Retention", "Shared with", "Owner"],
      rows: [
        [
          "Payroll",
          "Identity, bank account, salary, tax",
          "Pay and statutory deductions",
          "Legal obligation",
          "Set by statute",
          "Payroll processor",
          "Head of HR",
        ],
        [
          "Client onboarding",
          "KYC documents, contact details",
          "Conflict and identity checks",
          "Consent and legal obligation",
          "Life of matter + policy period",
          "None",
          "Compliance lead",
        ],
        [
          "Recruitment",
          "CV, contact details, interview notes",
          "Assessing candidates",
          "Consent",
          "Until role filled + policy period",
          "Assessment vendor",
          "Talent lead",
        ],
        [
          "Website enquiries",
          "Name, email, company",
          "Responding to the enquiry",
          "Consent",
          "Policy period",
          "CRM provider",
          "Marketing lead",
        ],
      ],
    },
    // BUILD NOTE — FIGURES TO CONFIRM: kept 16 weeks; "under half the time" (supplied as 60%) to
    // confirm. "100% DPDP readiness" → "aligned framework". "Zero uncontrolled exposure" removed.
    caseStudy: {
      heading: "A corporate law firm, India",
      glance: [
        { label: "Industry", text: "Professional services" },
        { label: "Work", text: "M&A due diligence, litigation and cross-border filings" },
        { label: "Duration", text: "16 weeks" },
        { label: "Scope", text: "DPDP and ISO/IEC 27701 programme, with technical controls" },
      ],
      situation: [
        "Cross-border mandates were growing, and international clients had started asking for evidence of alignment with ISO/IEC 27701, GDPR and the DPDP Act before they would onboard or renew.",
        "Client contracts, KYC records and personal data were spread across the document management system, email archives and local drives with no common classification. Retention schedules, access and erasure requests, and external counsel access were all tracked by hand.",
      ],
      whatWeDid: [
        {
          title: "Inventory",
          body: "We mapped client and employee data flows across the practice groups, built a central record of processing activities and introduced sensitivity tagging.",
        },
        {
          title: "Governance",
          body: "A privacy charter covering notices, consent, data principal rights workflows, and retention and archival rules set at matter level.",
        },
        {
          title: "Technical controls",
          body: "Matter-based access control, encryption at rest and in transit, and data loss prevention rules on external sharing of privileged documents.",
        },
        {
          title: "Vendors and breaches",
          body: "Standard data protection clauses for e-discovery and IT partners, and a breach escalation playbook aligned with CERT-In and DPDP timelines.",
        },
      ],
      outcomes: [
        {
          figure: "16 weeks",
          detail: "To a DPDP and ISO/IEC 27701-aligned framework — well ahead of the May 2027 obligations",
        },
        {
          figure: "Under half the time",
          detail: "To answer client security questionnaires, with standard audit-ready evidence",
          confirm: true,
        },
        {
          figure: "Privileged documents protected",
          detail: "External sharing now needs an approved route; lawyers still collaborate freely across practices",
        },
        {
          figure: "Rights requests on a workflow",
          detail: "Access and erasure requests handled through a defined route rather than by hand",
        },
      ],
      quote: "For a firm that sells confidentiality, privacy evidence has become part of winning the mandate.",
    },
    related: [
      {
        label: "Transformation strategy and governance",
        group: "Advisory",
        body: "The order of change, and stage gates a programme can be stopped at.",
        href: `${A}transformation-strategy-and-governance/`,
      },
      {
        label: "Enterprise architecture",
        group: "Advisory",
        body: "The target estate, the route to it, and the platform decisions that follow.",
        href: `${A}enterprise-architecture/`,
      },
      {
        label: "AI governance",
        group: "Advisory",
        body: "Risk-tiered controls so safe AI moves faster and risky AI is caught.",
        href: `${A}ai-governance/`,
      },
      {
        label: "Data Engineering and Analytics",
        group: "Digital, Data & AI",
        body: "Where classification and lineage are built into the data platform.",
        href: "/services/data-engineering-analytics/",
      },
    ],
    cta: {
      heading: "May 2027 is closer than the data mapping will take.",
      body: "Tell us where your personal data lives — or where you think it does. We will show you the gaps first.",
    },
  },

  // ════════════════════════════════════════════ 5 · AI governance
  {
    slug: "ai-governance",
    name: "AI governance",
    metaTitle: "AI governance | In2IT EBS",
    metaDescription:
      "Risk-tiered AI governance aligned with ISO/IEC 42001 and the DPDP Act: an inventory, decision rights, validation and human sign-off.",
    h1: "Let AI do the reading. Keep a person on the decision.",
    standfirst:
      "Most enterprises already have more AI in use than anyone has approved. We find it, rank it by what could go wrong, and give each tier the controls it needs — light for a drafting assistant, rigorous for anything that touches safety, money or a regulator.",
    heroImage: "/hero/advisory-ai-governance.webp",
    glance: [
      {
        label: "For",
        text: "Enterprises whose AI pilots are spreading faster than oversight; regulated and industrial operators",
      },
      {
        label: "You leave with",
        text: "AI inventory and risk tiers, governance committee and decision rights, policies, validation protocol, monitoring measures",
      },
      { label: "Frameworks", text: "ISO/IEC 42001 · NIST AI RMF · DPDP Act · EU AI Act where you operate in Europe" },
      { label: "Proof", text: "Integrated mining enterprise, India — 25+ use cases" },
    ],
    // BUILD NOTE: headline aligned with the Applied AI page; standards named as alignment only.
    problem: {
      eyebrow: "The problem",
      heading: "What ungoverned AI looks like",
      intro: "None of these is hypothetical. All four were present in the case below.",
      items: [
        {
          title: "Shadow AI",
          body: "Staff paste sensitive data into public tools because nobody has said what is allowed.",
        },
        {
          title: "Models nobody can explain",
          body: "A recommendation arrives with no reasoning, no confidence and no fallback when the inputs degrade.",
        },
        {
          title: "No one owns approval",
          body: "IT, operations, legal and safety each assume another function signed it off.",
        },
        {
          title: "The audit arrives first",
          body: "The board and the auditors ask for the framework before it exists.",
        },
      ],
    },
    diagram: {
      title: "Controls that scale with the risk",
      intro:
        "Every use case is tiered by its safety, financial and privacy impact. A low-risk assistant passes one check. A model advising on safety-critical machinery passes five — the last is a named person.",
      visual: "risk-tiers",
      alt: "Three risk tiers: low-risk AI passes one control, moderate three, high-risk five including a named person signing off each recommendation",
      captionLeft: "Illustrative examples, drawn from the kinds of use case in the mining case study below.",
      captionRight: "Low-risk tools stop waiting behind high-risk reviews.",
    },
    services: {
      heading: "Six services, from inventory to audit trail",
      items: [
        {
          title: "Readiness and use-case triage",
          body: "Your data, infrastructure, skills and risk posture assessed, and use cases ranked by value and by what could go wrong — each with a named owner.",
        },
        {
          title: "Governance framework",
          body: "An AI charter, principles, acceptable-use policy and a cross-functional committee with written decision rights.",
        },
        {
          title: "Standards alignment",
          body: "Controls mapped to ISO/IEC 42001, the NIST AI Risk Management Framework, the DPDP Act, sector guidance, and the EU AI Act where you operate in Europe.",
        },
        {
          title: "Model risk management",
          body: "Validation before release for bias, explainability, robustness and hallucination, with human-in-the-loop rules for predictive and generative models.",
        },
        {
          title: "Data and LLM security",
          body: "Access control, defences against prompt injection, personal data redaction, and secure connection to ERP and operational systems.",
        },
        {
          title: "Monitoring and audit trail",
          body: "Drift, performance and incident measures, with logs an internal or statutory auditor can follow.",
        },
      ],
    },
    // BUILD NOTE — FIGURES TO CONFIRM: 25+ use cases and three tiers kept; "about 40% faster" to
    // confirm. "100% visibility" and "eliminated unauthorised LLM usage" → plain statements.
    caseStudy: {
      heading: "An integrated mining enterprise, India",
      glance: [
        { label: "Industry", text: "Metals, mining and steel" },
        {
          label: "Operations",
          text: "Open-cast and underground mines, processing plants and logistics across several states",
        },
        { label: "AI in scope", text: "25+ active and planned use cases" },
        { label: "Scope", text: "Enterprise AI governance framework, designed and put into operation" },
      ],
      situation: [
        "The company had several AI initiatives running at once: predictive maintenance for heavy earth-moving machinery, ore-grade estimation, fleet dispatch and generative assistants for technical documents.",
        "Site teams were using external generative AI tools with geological surveys, mine plans and vendor pricing. Maintenance and safety models had no formal validation, and no fallback when sensor data degraded. IT, operations, legal and safety had no shared ownership of what went into production — and board and statutory audits were approaching.",
      ],
      whatWeDid: [
        {
          title: "Inventory and tiers",
          body: "We catalogued more than 25 use cases across mining, supply chain and corporate functions, and placed each in a low, moderate or high-risk tier by safety, financial and privacy impact.",
        },
        {
          title: "Operating model",
          body: "An AI steering committee across IT, operations, safety, legal and business heads, with stage gates from proof of concept to production.",
        },
        {
          title: "Policies and boundaries",
          body: "A responsible AI policy, generative AI acceptable-use guidelines and a vendor checklist, with hard boundaries on geological and operational data.",
        },
        {
          title: "Validation and sign-off",
          body: "Tests for drift, sensor noise and explainability before release, and a named person signing off every safety-critical or high-capex maintenance recommendation.",
        },
        {
          title: "Standards and monitoring",
          body: "Controls mapped to ISO/IEC 42001 and the DPDP Act, with measures for model performance, incident escalation and logging.",
        },
      ],
      outcomes: [
        {
          figure: "One register",
          detail:
            "Every AI initiative governed in a single register; sensitive operational data kept out of external tools",
        },
        {
          figure: "About 40% faster",
          detail: "Approval to production for validated models, once tiered gates replaced case-by-case reviews",
          confirm: true,
        },
        {
          figure: "Higher adoption",
          detail:
            "Engineers and planners used the maintenance models more readily because they could see the reasoning and override it",
        },
        {
          figure: "Audit-ready",
          detail: "Aligned with ISO/IEC 42001 and the DPDP Act ahead of board and statutory review",
        },
      ],
      quote: "Governance that speeds up the safe models is the only kind that survives contact with the business.",
    },
    related: [
      {
        label: "Transformation strategy and governance",
        group: "Advisory",
        body: "The order of change, and stage gates a programme can be stopped at.",
        href: `${A}transformation-strategy-and-governance/`,
      },
      {
        label: "Enterprise architecture",
        group: "Advisory",
        body: "The target estate, the route to it, and the platform decisions that follow.",
        href: `${A}enterprise-architecture/`,
      },
      {
        label: "Data protection and privacy",
        group: "Advisory",
        body: "DPDP and its equivalents, built into the systems that hold the data.",
        href: `${A}data-protection-and-privacy/`,
      },
      {
        label: "Applied AI",
        group: "Digital, Data & AI",
        body: "Where governed AI is built: the assistant reads and drafts, a person decides.",
        href: "/services/applied-ai/",
      },
    ],
    cta: {
      heading: "More AI in use than anyone has approved?",
      body: "Start with an inventory. We will help you find what is running, and tier it, before the auditors ask.",
    },
  },
];

export function getAdvisoryPage(slug: string) {
  return advisoryPages.find((page) => page.slug === slug);
}

// ════════════════════════════════════════════ 1 · The hub's new sections

export const advisoryHub = {
  metaTitle: "Advisory — In2IT EBS",
  metaDescription:
    "Four advisory services from In2IT EBS — transformation strategy, enterprise architecture, data protection and AI governance — each with a client case.",
  h1: "Advice that has to survive being built.",
  standfirst:
    "Advice that is never followed by delivery is a deck. Delivery without advice is order-taking. We do both — so every recommendation we make has to hold up when someone sits down to build it.",
  glance: [
    { label: "Services", text: "Four, each sold on its own" },
    { label: "Case studies", text: "One per service, anonymised by sector and region" },
    { label: "Independence", text: "We name the option that doesn't need us" },
  ],
  services: {
    heading: "Four services, each with work behind it",
    intro: "Choose by the question you are trying to answer. Each page shows what you receive and a client case.",
    items: [
      {
        title: "Transformation strategy and governance",
        body: "Decide the order of change and govern it through stage gates.",
        caseStudy: "Infrastructure project management consultancy, pan-India",
        href: `${A}transformation-strategy-and-governance/`,
      },
      {
        title: "Enterprise architecture",
        body: "The target estate, the route to it, and the platform decisions that follow.",
        caseStudy: "Central public sector heavy engineering enterprise",
        href: `${A}enterprise-architecture/`,
      },
      {
        title: "Data protection and privacy",
        body: "DPDP and its equivalents, built into the systems that hold the data.",
        caseStudy: "Corporate law firm, India — 16 weeks",
        href: `${A}data-protection-and-privacy/`,
      },
      {
        title: "AI governance",
        body: "Risk-tiered controls, with a person on every high-stakes decision.",
        caseStudy: "Integrated mining enterprise — 25+ use cases",
        href: `${A}ai-governance/`,
      },
    ],
  },
  lifecycle: {
    heading: "Across the life of a programme",
    intro: "Strategy and architecture lead; privacy and AI governance run alongside and carry on after go-live.",
    phases: ["Before a programme", "Designing it", "Building it", "Running it"],
    caption: "Select a bar to open that service.",
    alt: "Where each Advisory service sits across the life of a programme",
    rows: [
      {
        lane: "Decide",
        label: "Transformation strategy and governance",
        from: 0,
        to: 3,
        strong: true,
        slug: "transformation-strategy-and-governance",
      },
      {
        lane: "Design",
        label: "Enterprise architecture",
        from: 0,
        to: 2,
        strong: false,
        slug: "enterprise-architecture",
      },
      {
        lane: "Protect",
        label: "Data protection and privacy",
        from: 0,
        to: 4,
        strong: true,
        slug: "data-protection-and-privacy",
      },
      { lane: "Control", label: "AI governance", from: 1, to: 4, strong: false, slug: "ai-governance" },
    ],
  },
  rules: {
    heading: "Three rules we hold ourselves to",
    items: [
      {
        title: "We name the option that doesn't need us.",
        body: "If the right answer is to stay on what you have, buy a product, or use another firm, that is what the recommendation says.",
      },
      {
        title: "Advice written to be built.",
        body: "Every recommendation names who builds it, in what order and what it depends on — because we may be the ones held to it.",
      },
      {
        title: "Standards your auditors know.",
        body: "We work to frameworks your auditors already recognise — ISO/IEC 27001, 27701 and 42001, the DPDP Act — so the output survives an audit, not just a steering committee.",
      },
    ],
  },
  cta: {
    heading: "Not sure which of the four you need?",
    body: "Describe the decision in front of you. We will tell you which service fits — or that you don't need one.",
  },
};
