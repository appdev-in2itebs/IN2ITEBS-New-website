import type { ExplainerSpec } from "@/components/explainers/explainer";

/**
 * The explanatory diagrams, as content. Each entry used to be a hand-drawn SVG in /public/diagrams
 * (the key is that file's name, kept so the history is traceable); it is now a spec that one of the
 * explainer kinds renders as live, scroll-choreographed HTML. Edit the words here; the look is in
 * components/explainers.
 */
export const EXPLAINERS = {
  "p1-accelerators": {
    kind: "cards",
    eyebrow: "Accelerators and IP",
    title: "What we bring",
    titleAccent: "that is ours.",
    summary:
      "Six accelerators of our own: the Utility Billing QPPS package, a migration toolkit, a process library, a test automation pack, a KPI dashboard pack and a Fiori app pack. Each one can be demonstrated in a working system.",
    columns: 3,
    cards: [
      {
        label: "Offer",
        title: "Utility Billing QPPS",
        body: "Our own pre-configured utility billing package. Shortens the time to a first bill run.",
      },
      {
        label: "Delivery",
        title: "Migration toolkit",
        body: "Pre-built migration objects, validation rules and reconciliation reports for ECC and IS-U estates.",
      },
      {
        label: "Design",
        title: "Process library",
        body: "Fit-to-standard flows for power, water and sewerage, ready for process mining.",
      },
      {
        label: "Run",
        title: "Test automation pack",
        body: "Regression scripts for billing, contract accounting, asset and finance processes, built for quarterly cloud releases.",
      },
      {
        label: "Run",
        title: "KPI dashboard pack",
        body: "Analytics Cloud dashboards for loss, non-revenue water, billing and collection efficiency, asset availability.",
      },
      {
        label: "Delivery",
        title: "Fiori app pack",
        body: "Repair tracking, material tracking and real-time monitoring apps, first built for a state distribution utility.",
      },
    ],
    note: {
      title: "An accelerator is a thing, not a word.",
      body: "Each of these can be demonstrated. If we cannot show it to you in a working system, it does not belong on this list and we will take it off.",
    },
  },

  "d1-where-it-sits": {
    kind: "cards",
    eyebrow: "The picture",
    title: "Where application engineering",
    titleAccent: "sits.",
    summary:
      "Four columns from left to right: the channels and users, the applications we build and run, the integration spine, and the system of record. Everything has to agree with the ledger on the right.",
    columns: 4,
    variant: "columns",
    cards: [
      {
        title: "Channels and users",
        body: "The people and systems that touch the business every day",
        bullets: [
          "Customer and citizen portals",
          "Mobile apps, iOS and Android",
          "Dealer, retailer and partner portals",
          "Field and shop-floor users",
        ],
      },
      {
        title: "Applications we build and run",
        body: "The layer that carries the process the ERP does not",
        bullets: [
          "Custom web and enterprise apps",
          "Workflow and approval platforms",
          "Line-of-business applications",
          "Legacy systems still in service",
        ],
      },
      {
        title: "The integration spine",
        body: "Governed, two-way, documented",
        bullets: ["APIs and middleware", "SAP BTP", "Event and batch interfaces", "Master-data alignment"],
      },
      {
        title: "The system of record",
        body: "Where the transaction finally lands",
        bullets: ["SAP S/4HANA", "SAP SuccessFactors", "or another ERP of record"],
        tone: "navy",
      },
    ],
    closing: {
      title: "Everything has to agree with the ledger.",
      body: "We build and run the applications on the left, and we are accountable for the fact that what they record still reconciles with what sits on the right.",
    },
  },

  "m1-sap-estate": {
    kind: "layers",
    eyebrow: "The SAP hub",
    title: "What we",
    titleAccent: "actually run.",
    summary:
      "Four tiers of the SAP estate we configure and run: the core (S/4HANA, ECC, Business Suite), people (SuccessFactors, HCM, Payroll), spend and supply (Ariba, SRM, procurement) and platform and data (BTP, Integration, Analytics, AI). Every module named is one we have configured in production for a named client.",
    layers: [
      {
        label: "The core",
        sub: "S/4HANA · ECC · Business Suite",
        tone: "navy",
        chips: ["FI / CO", "MM", "SD", "PP", "QM", "PM / EAM", "PS", "ABAP"],
      },
      {
        label: "People",
        sub: "SuccessFactors · HCM · Payroll",
        tone: "steel",
        chips: ["Employee Central", "Payroll", "Rec & Onboard", "Perf & Goals", "Comp", "LMS", "Time", "ESS / MSS"],
      },
      {
        label: "Spend and supply",
        sub: "Ariba · SRM · Procurement",
        tone: "light",
        chips: ["Sourcing", "e-Tendering", "Direct Materials", "Contracts", "Supplier", "SRM → Ariba"],
      },
      {
        label: "Platform and data",
        sub: "BTP · Integration · Analytics · AI",
        tone: "plain",
        chips: [
          "BTP extensions",
          "Integration Suite",
          "Analytics Cloud",
          "Business Data Cloud",
          "Joule",
          "Basis & Security",
          "Fiori UX",
        ],
      },
    ],
    closing: {
      title: "Depth is a number and a name, not an adjective.",
      body: "Every module above is one we have configured in production for a named client. The ones we do not do are listed too.",
    },
  },

  "m3-grow-fast": {
    kind: "steps",
    eyebrow: "GROW FAST",
    title: "A fixed scope, a fixed date,",
    titleAccent: "a fixed price.",
    summary:
      "Sixteen weeks in five phases: prepare, explore, realize, deploy, run. Scope, duration and price are fixed before signing; anything outside the listed scope becomes a change request with its own price and date.",
    steps: [
      { badge: "01", label: "Weeks 1–2", title: "Prepare", body: "Access, project team, data templates issued" },
      {
        badge: "02",
        label: "Weeks 3–6",
        title: "Explore",
        body: "Fit-to-standard against SAP Best Practices. Gaps are decisions, not change requests",
      },
      {
        badge: "03",
        label: "Weeks 7–12",
        title: "Realize",
        body: "Configuration, data load, two test cycles, user training",
      },
      { badge: "04", label: "Weeks 13–14", title: "Deploy", body: "Cutover rehearsal, go-live" },
      {
        badge: "05",
        label: "Weeks 15–16",
        title: "Run",
        body: "Hypercare, then handover to managed service or to you",
      },
    ],
    cards: [
      {
        title: "What is fixed",
        bullets: [
          "Scope: the SAP Best Practice processes listed on this page",
          "Duration: sixteen weeks from kick-off",
          "Price: one figure, stated before you sign",
        ],
      },
      {
        title: "What is not included",
        bullets: [
          "Processes outside the listed scope",
          "Custom development beyond the stated extension allowance",
          "Integration to systems not on the published list",
        ],
      },
      {
        title: "What happens if scope moves",
        bullets: [
          "It becomes a change request with its own price and its own date.",
          "We will say so at the time, in writing, before any work starts.",
        ],
        tone: "navy",
      },
    ],
    cardsColumns: 3,
  },

  "m7-ecc-prism-economics": {
    kind: "cards",
    eyebrow: "The commercial case",
    title: "Where the money",
    titleAccent: "comes back from.",
    summary:
      "Four places an ECC estate leaks money: licences nobody uses, custom code nobody runs, data that should be archived, and reporting on the wrong platform. We do not sell what we recommend, so the findings earn us no margin.",
    columns: 4,
    cards: [
      {
        title: "Licences nobody uses",
        body: "Dormant accounts, users classified above what they actually do, and indirect access found before SAP's own measurement finds it.",
        foot: "Recurring, annual",
        tone: "light",
      },
      {
        title: "Custom code nobody runs",
        body: "Objects that have not executed in a year still cost you to maintain, to test and eventually to migrate. Retiring them is the cheapest work in the estate.",
        foot: "Recurring, and again at migration",
      },
      {
        title: "Data that should be archived",
        body: "A smaller database is faster, cheaper to host and cheaper to copy. The constraint is never technical: it is proving an auditor can still reach the record.",
        foot: "Infrastructure and performance",
      },
      {
        title: "Reporting on the wrong platform",
        body: "Heavy reporting against the transaction system is a performance cost paid every day. Moving it off is usually possible without buying a new SAP licence.",
        foot: "Performance, and licence avoidance",
      },
    ],
    note: {
      title: "We do not sell what we recommend.",
      body: "No licence resale, no product commission, no analytics vendor we are paid to name. The findings are worth something precisely because nothing in them earns us a margin.",
    },
  },

  "x1-prism-licence": {
    kind: "ledger",
    eyebrow: "Sample output",
    title: "What the licence pass",
    titleAccent: "finds, and what the report says to do.",
    summary:
      "A page of a sample ECC Prism report: four licence findings (inactive users, over-classified users, shared IDs, indirect access) paired with the four recommendations, and the estimated impact.",
    strip: { left: "Report section 05", title: "Licence position", right: "ECC Prism sample output" },
    leftLabel: "What the pass found",
    rightLabel: "What the report recommends",
    rows: [
      {
        marker: "a",
        finding: "Named users inactive for more than twelve months",
        measure: "18% of the licensed population",
        action: "Decommission or reassign inactive users",
      },
      {
        marker: "b",
        finding: "Users classified above the role they actually perform",
        measure: "22%, across three licence types",
        action: "Reclassify users to lower-cost licence types",
      },
      {
        marker: "c",
        finding: "Shared user IDs in operational locations",
        measure: "Observed at multiple sites",
        action: "Eliminate shared IDs to reduce audit exposure",
      },
      {
        marker: "d",
        finding: "Indirect access indicators on logistics interfaces",
        measure: "Two interfaces flagged for review",
        action: "Run a LAW correction after the cleanup",
      },
    ],
    impact: {
      title: "Estimated impact",
      body: "Annual licence cost reduction potential: high. SAP audit exposure: medium, falling to low after remediation.",
    },
    footnote:
      "Illustrative figures from a sample report. Your own figures come from your own estate, and every one of them cites the system it came from.",
  },

  "m2-achieve": {
    kind: "steps",
    eyebrow: "How we deliver",
    title: "ACHIEVE:",
    titleAccent: "seven stages, seven sign-offs.",
    summary:
      "Seven delivery stages, Assess, Configure, Harmonize, Integrate, Execute, Validate, Evolve, each closed by a client sign-off. Aligned to SAP Activate with clean core as a standing constraint.",
    steps: [
      {
        badge: "A",
        title: "Assess",
        body: "As-is landscape, customisation inventory, master-data quality",
        sub: { label: "Sign-off", text: "Acceptance of the As-Is report" },
      },
      {
        badge: "C",
        title: "Configure",
        body: "Fit-to-standard workshops, to-be design, configuration baseline",
        sub: { label: "Sign-off", text: "Business blueprint sign-off" },
      },
      {
        badge: "H",
        title: "Harmonize",
        body: "Process redesign across sites; clean-core posture",
        sub: { label: "Sign-off", text: "Harmonised process sign-off" },
      },
      {
        badge: "I",
        title: "Integrate",
        body: "Interfaces, API strategy, extensions, identity",
        sub: { label: "Sign-off", text: "Integration design sign-off" },
      },
      {
        badge: "E",
        title: "Execute",
        body: "Build, data cleansing, migration, test, UAT",
        sub: { label: "Sign-off", text: "UAT completion sign-off" },
      },
      {
        badge: "V",
        title: "Validate",
        body: "Cutover rehearsal, go-live, hypercare",
        sub: { label: "Sign-off", text: "Stabilisation sign-off" },
      },
      {
        badge: "E",
        title: "Evolve",
        body: "New scope, managed operation, SLA reporting",
        sub: { label: "Sign-off", text: "Monthly service acceptance" },
      },
    ],
    note: {
      title: "No stage closes without the client signing it.",
      body: "Aligned to SAP Activate (Discover, Prepare, Explore, Realize, Deploy, Run) with clean core as a standing constraint, not a phase.",
    },
  },

  "y1-health-check-decisions": {
    kind: "cards",
    eyebrow: "Health Check 360",
    title: "Every finding becomes",
    titleAccent: "one of six decisions.",
    summary:
      "Six decisions a SuccessFactors health check can reach for each finding: retain, fix, optimise, complete, adopt, retire. Retain is a finding too.",
    columns: 3,
    cards: [
      {
        title: "Retain",
        label: "Working, and delivering value",
        body: "Protect it. The first job of an assessment is to identify what must not be disturbed.",
        tone: "navy",
      },
      {
        title: "Fix",
        label: "Configured wrongly, or failing",
        body: "Correct it quickly. These are the findings that reach payroll and the ones users feel.",
      },
      {
        title: "Optimise",
        label: "Works, but more complex than it needs to be",
        body: "Simplify it. Complexity you are maintaining for no reason is a cost with no owner.",
      },
      {
        title: "Complete",
        label: "Licensed, partially implemented",
        body: "Finish it. Capability you have already paid for and stopped halfway through.",
      },
      {
        title: "Adopt",
        label: "Built correctly, not being used",
        body: "Address the process, the interface or the training, not the configuration.",
      },
      {
        title: "Retire",
        label: "No longer earning its place",
        body: "Remove it. Every object kept alive is tested, supported and migrated again later.",
        tone: "light",
      },
    ],
    closing: {
      title: "Retain is a finding too.",
      body: "An assessment that returns only problems has not looked properly. Knowing what is working, and why, is what makes the rest of the list safe to act on.",
    },
  },

  "n2-meter-to-cash": {
    kind: "steps",
    eyebrow: "Smart meter to cash",
    title: "The revenue is lost",
    titleAccent: "at the hand-offs.",
    summary:
      "Five steps from meter to revenue (meter, meter data, billing, collections, revenue) with the four gaps between them where revenue leaks, and the three services that close them: connect, bill, collect.",
    steps: [
      { badge: "01", title: "Meter", body: "Smart, conventional, bulk and DMA" },
      { badge: "02", title: "Meter data", body: "Validation, estimation, exceptions" },
      { badge: "03", title: "Billing", body: "Tariffs, rating, bill print" },
      { badge: "04", title: "Collections", body: "FI-CA, mobile money, dunning" },
      { badge: "05", title: "Revenue", body: "Ledger, regulator KPIs, loss balance" },
    ],
    gaps: [
      "Meters installed but not communicating",
      "Reads not reaching billing on time",
      "Customers on estimated bills",
      "Manual follow-up, slow cash",
    ],
    note: {
      title: "Every one of those gaps sits between two suppliers.",
      body: "The meter vendor, the head-end, the MDM provider, the billing team and the collections agency each hold up their own SLA while the revenue sits in the space between them.",
    },
    cards: [
      {
        label: "01",
        title: "Connect",
        body: "Head-end, AMR and smart-meter integration · read validation and estimation rules · exception workflows · meter-health dashboards",
      },
      {
        label: "02",
        title: "Bill",
        body: "Utility Billing QPPS, our own pre-configured package · prepaid and postpaid on one platform · energy, water, sewerage and lifeline tariffs · bill-quality checks before release",
      },
      {
        label: "03",
        title: "Collect",
        body: "FI-CA, bank and mobile-money channels · dunning and disconnection rules · prepaid token and top-up integration · collection-propensity analytics",
      },
    ],
    cardsColumns: 3,
    closing: {
      title: "One partner accountable for the whole flow.",
      body: "Starts as a pilot on one circle, zone or division. Part of the fee can be tied to the KPIs it is meant to move.",
    },
  },

  "m4b-severity": {
    kind: "layers",
    eyebrow: "Managed services",
    title: "What happens when",
    titleAccent: "something breaks.",
    summary:
      "Four severity levels with response and resolution targets: S1 critical, 30 minutes and same business day; S2 high, 2 hours and 1 working day; S3 medium, 8 hours and 3 working days; S4 low, 1 working day and a monthly-reviewed backlog.",
    layers: [
      {
        label: "S1 · Critical",
        tone: "navy",
        body: "Production down. Multiple modules unusable. A payroll run blocked, or a statutory deadline at risk.",
        cols: [
          { label: "Response", text: "30 minutes" },
          { label: "Resolution", text: "Same business day" },
        ],
      },
      {
        label: "S2 · High",
        tone: "steel",
        body: "A major function unavailable. A workaround exists but the financial close is at risk.",
        cols: [
          { label: "Response", text: "2 hours" },
          { label: "Resolution", text: "1 working day" },
        ],
      },
      {
        label: "S3 · Medium",
        tone: "light",
        body: "A limited function affected. A few users. A non-critical report or screen.",
        cols: [
          { label: "Response", text: "8 hours" },
          { label: "Resolution", text: "3 working days" },
        ],
      },
      {
        label: "S4 · Low",
        tone: "plain",
        body: "Cosmetic issues, how-to questions, minor master-data edits, enhancement requests.",
        cols: [
          { label: "Response", text: "1 working day" },
          { label: "Resolution", text: "Backlog, reviewed monthly" },
        ],
      },
    ],
    closing: {
      title: "The clock stops only for reasons we both agree on.",
      body: "Waiting on your approval, your access or your business input. Every pause is visible in the ticket. Miss the targets two months running and service credits apply.",
    },
  },

  "d2-five-services": {
    kind: "steps",
    eyebrow: "What we do",
    title: "One way in, five services,",
    titleAccent: "one accountable team.",
    summary:
      "A fixed-price estate review is the way in, followed by five services: build, integrate, modernise, assure and run. What we learn running it goes back into what we build.",
    anchor: {
      badge: "00",
      title: "Discover",
      body: "A fixed-price estate review. What you have, what it is worth, what to do with each application.",
      label: "The way in",
      tone: "navy",
    },
    steps: [
      {
        badge: "01",
        title: "Build",
        body: "New web, mobile and enterprise applications, designed around the process rather than the other way round.",
      },
      {
        badge: "02",
        title: "Integrate",
        body: "APIs, middleware and SAP BTP, so a figure is entered once and reconciles everywhere it appears.",
      },
      {
        badge: "03",
        title: "Modernise",
        body: "Retain, rehost, replatform, refactor, replace or retire, judged on business value, not technology age.",
      },
      {
        badge: "04",
        title: "Assure",
        body: "Functional, regression, performance and security testing, automated where that lowers cost and risk.",
      },
      {
        badge: "05",
        title: "Run",
        body: "L1 to L3 against agreed service levels, with monthly reporting on what recurred and what we changed.",
      },
    ],
    closing: { title: "What we learn running it goes back into what we build." },
  },

  "e2-portfolio-map": {
    kind: "scatter",
    eyebrow: "What the estate review gives you",
    title: "Every application,",
    titleAccent: "placed and dispositioned.",
    summary:
      "A specimen portfolio map: each application placed by value to the business against cost and risk to change, sized by what it costs to run, and coloured by its disposition: refactor, replatform, rehost, retain or retire.",
    yLabel: "Value to the business",
    xLabel: "Cost and risk to change",
    legend: [
      { label: "Refactor", swatch: "navy" },
      { label: "Replatform", swatch: "light" },
      { label: "Rehost", swatch: "steel" },
      { label: "Retain", swatch: "pale" },
      { label: "Retire", swatch: "sand" },
    ],
    points: [
      { x: 73.1, y: 20.4, r: 17, swatch: "navy" },
      { x: 73.6, y: 22.2, r: 13, swatch: "navy" },
      { x: 62.4, y: 22.1, r: 14, swatch: "navy" },
      { x: 86.7, y: 36.7, r: 11, swatch: "navy", label: "Order-to-cash portal" },
      { x: 58.6, y: 11.7, r: 15, swatch: "navy" },
      { x: 56.7, y: 5.6, r: 17, swatch: "navy" },
      { x: 81.2, y: 18.4, r: 9, swatch: "navy" },
      { x: 55.6, y: 21.5, r: 8, swatch: "navy" },
      { x: 62.6, y: 31.5, r: 8, swatch: "navy" },
      { x: 26.6, y: 26.6, r: 13, swatch: "light" },
      { x: 28.8, y: 19.6, r: 10, swatch: "light" },
      { x: 34.5, y: 26.0, r: 9, swatch: "light" },
      { x: 47.9, y: 7.2, r: 13, swatch: "light" },
      { x: 36.3, y: 31.0, r: 9, swatch: "light" },
      { x: 19.6, y: 39.5, r: 12, swatch: "light", label: "Claims engine" },
      { x: 24.0, y: 12.4, r: 10, swatch: "light" },
      { x: 46.3, y: 12.3, r: 7, swatch: "light" },
      { x: 52.5, y: 63.5, r: 7, swatch: "steel" },
      { x: 67.9, y: 80.7, r: 8, swatch: "steel" },
      { x: 53.2, y: 76.4, r: 10, swatch: "steel" },
      { x: 73.3, y: 75.5, r: 10, swatch: "steel" },
      { x: 53.2, y: 73.0, r: 10, swatch: "steel" },
      { x: 67.8, y: 81.2, r: 10, swatch: "steel" },
      { x: 59.6, y: 85.9, r: 10, swatch: "steel" },
      { x: 54.3, y: 92.8, r: 7, swatch: "steel" },
      { x: 56.7, y: 78.2, r: 8, swatch: "steel" },
      { x: 13.1, y: 58.0, r: 9, swatch: "pale" },
      { x: 27.4, y: 62.3, r: 8, swatch: "pale" },
      { x: 12.0, y: 69.6, r: 9, swatch: "pale" },
      { x: 15.4, y: 75.2, r: 12, swatch: "pale" },
      { x: 6.2, y: 74.9, r: 8, swatch: "pale" },
      { x: 39.3, y: 74.9, r: 7, swatch: "pale" },
      { x: 9.0, y: 77.0, r: 11, swatch: "sand" },
      { x: 31.8, y: 84.1, r: 8, swatch: "sand" },
      { x: 9.4, y: 86.0, r: 10, swatch: "sand", label: "Intranet (three of them)" },
      { x: 16.4, y: 91.1, r: 12, swatch: "sand" },
      { x: 23.1, y: 90.2, r: 6, swatch: "sand" },
      { x: 9.2, y: 83.6, r: 8, swatch: "sand" },
      { x: 38.9, y: 88.4, r: 9, swatch: "sand" },
      { x: 15.0, y: 80.0, r: 13, swatch: "sand" },
      { x: 39.0, y: 87.3, r: 7, swatch: "sand" },
    ],
    caption:
      "Specimen output. Each circle is one application; the circle is sized by what it costs to run. Every one carries a written reason.",
  },

  "n1-data-layers": {
    kind: "layers",
    eyebrow: "Enterprise data management",
    title: "Three layers,",
    titleAccent: "bought separately or together.",
    summary:
      "Three layers of data work: advise (strategy, governance, retention, S/4HANA readiness), transform (profiling, cleansing, migration, archiving) and operate (master data operations, replication monitoring, compliance evidence), each with its own commercial model.",
    layers: [
      {
        label: "Advise",
        title: "Set direction before anything moves",
        tone: "navy",
        bullets: [
          "Data strategy and target state",
          "Governance operating model",
          "Retention and ILM policy",
          "S/4HANA data-readiness and sizing",
        ],
        foot: { label: "How it is bought", text: "Fixed-scope assessment, three to six weeks" },
      },
      {
        label: "Transform",
        title: "Execute it, wave by wave, with evidence at every gate",
        tone: "steel",
        bullets: [
          "Profiling, cleansing, de-duplication",
          "Master data governance build",
          "Migration: every transition pattern",
          "Archiving, ILM and decommissioning",
        ],
        foot: { label: "How it is bought", text: "Fixed price per wave, or per object, per cycle, per system retired" },
      },
      {
        label: "Operate",
        title: "Keep it trusted after the programme closes",
        tone: "light",
        bullets: [
          "Master data operations and upkeep",
          "Scheduled delta archiving",
          "Replication and pipeline monitoring",
          "Compliance and audit evidence",
        ],
        foot: { label: "How it is bought", text: "Managed service against published SLAs, with a monthly scorecard" },
      },
    ],
    closing: {
      title: "Each layer stands alone. Most clients start at the top.",
      body: "A three-week assessment that concludes you should do nothing yet is a successful assessment, and it is priced as one.",
    },
  },

  "p2-where-we-are": {
    kind: "cards",
    eyebrow: "Where we are",
    title: "Registered, staffed",
    titleAccent: "and delivering.",
    summary:
      "Headquarters in Bengaluru, legal entities in five countries, staffed delivery centres in eight cities, and clients in thirty-plus countries. A delivery centre is somewhere you can visit.",
    columns: 4,
    cards: [
      {
        label: "Headquarters",
        big: "Bengaluru, India",
        title: "Registered office",
        body: "Registered office and headquarters: In2IT Enterprise Business Services Private Limited",
        tone: "navy",
      },
      {
        label: "Legal entities",
        big: "Five countries",
        title: "Where you contract",
        bullets: ["India", "South Africa", "Singapore", "United Arab Emirates (Dubai)", "Kenya"],
        tone: "steel",
      },
      {
        label: "Delivery centres",
        big: "Eight cities",
        title: "Where the people are",
        bullets: ["Bengaluru · Delhi", "Bhubaneswar · Hyderabad", "Singapore · Dubai", "Nairobi · Johannesburg"],
        tone: "light",
      },
      {
        label: "Clients",
        big: "Thirty-plus countries",
        title: "Where the work is",
        bullets: [
          "India and South Asia",
          "Africa",
          "Middle East",
          "Southeast Asia and ANZ",
          "Europe and North America",
        ],
      },
    ],
    closing: {
      title: "A delivery centre is somewhere you can visit.",
      body: "Every city on that list has people in it. An entity without a staffed office is listed as an entity, not as a delivery centre.",
    },
  },

  "z4-footprint-layers": {
    kind: "matrix",
    eyebrow: "Where we are",
    title: "Four different things,",
    titleAccent: "often drawn as one.",
    lede: "An office is not a delivery centre and a legal entity is not either. Most footprint maps show one set of pins; these are four separate questions with four different answers.",
    summary:
      "Five markets across (India, South Africa, Kenya, Singapore, United Arab Emirates), four layers down: staffed delivery centres exist only in India; offices, legal entities and data-residency arrangements exist in all five.",
    columns: [
      { title: "India" },
      { title: "South Africa" },
      { title: "Kenya" },
      { title: "Singapore" },
      { title: "United Arab Emirates" },
    ],
    rows: [
      {
        label: "Staffed delivery centre",
        hint: "People who build and run your systems. Visitable.",
        cells: [
          { text: "Bengaluru · Hyderabad · Delhi NCR · Bhubaneswar", tone: "navy" },
          { empty: "none" },
          { empty: "none" },
          { empty: "none" },
          { empty: "none" },
        ],
      },
      {
        label: "Office",
        hint: "A place of business. Not a delivery centre.",
        cells: [
          { text: "Bengaluru (HQ and registered office)", tone: "light" },
          { text: "Johannesburg", tone: "light" },
          { text: "Nairobi", tone: "light" },
          { text: "Singapore", tone: "light" },
          { text: "Dubai", tone: "light" },
        ],
      },
      {
        label: "Legal entity",
        hint: "Who you contract with, and who carries the liability.",
        cells: [
          { text: "In2IT Enterprise Business Services Pvt Ltd", tone: "light" },
          { text: "In2IT Enterprise Business Services (Pty) Ltd", tone: "light" },
          { text: "In2IT Enterprise Business Services Kenya Limited", tone: "light" },
          { text: "In2IT Enterprise Business Services Pte Ltd", tone: "light" },
          { text: "In2IT EB Solutions L.L.C.", tone: "light" },
        ],
      },
      {
        label: "Data residency",
        hint: "Where your data sits, and under which law.",
        cells: [
          {
            text: "MeitY-compliant hosting for government workloads, data centre and DR inside Indian jurisdiction. DPDP Act and IT Act 2000.",
          },
          { text: "Aligned to the Protection of Personal Information Act (POPIA)." },
          { text: "Aligned to the Kenyan Data Protection Act." },
          { text: "Aligned to the Personal Data Protection Act (PDPA)." },
          { text: "Aligned to the UAE Personal Data Protection Law." },
        ],
      },
    ],
    note: {
      title: "Four delivery centres, all of them in India.",
      body: "Singapore, Dubai, Nairobi and Johannesburg are offices and legal entities. Real, and not the same thing, which is why they are on a different row.",
    },
  },

  "z1-depth-profile": {
    kind: "matrix",
    eyebrow: "Where we stand",
    title: "Depth, drawn to scale,",
    titleAccent: "including where there is none.",
    lede: "The vertical axis is evidence, not volume. The lower and darker a block sits, the more we can prove about it.",
    summary:
      "The capability register as a grid: four areas across (SAP, engineering and data, run and operations, other platforms) and four evidence levels down (delivered, with a partner, building, ahead of us). Five of nineteen capabilities are things we do not do.",
    columns: [
      { title: "SAP", sub: "5 of 8 in production" },
      { title: "Engineering and data", sub: "3 of 4 in production" },
      { title: "Run and operations", sub: "1 of 4 in production" },
      { title: "Other platforms", sub: "0 of 3 in production", subTone: "muted" },
    ],
    rows: [
      {
        label: "Delivered",
        hint: "In production at a named client, signed off, with a named person here accountable",
        cells: [
          {
            items: [
              "S/4HANA conversion and RISE migration",
              "SuccessFactors across the module set",
              "Application management and support",
              "Utilities meter-to-cash and contract accounting",
              "Plant maintenance and work clearance",
            ],
            tone: "navy",
          },
          {
            items: [
              "Application development and maintenance",
              "Data migration, reconciled on every load",
              "Analytics and reporting platforms",
            ],
            tone: "navy",
          },
          { items: ["Infrastructure managed services"], tone: "navy" },
          { empty: "nothing at this level" },
        ],
      },
      {
        label: "With a partner",
        hint: "Delivered alongside a partner we name before you sign, not after",
        cells: [
          { empty: "nothing at this level" },
          { empty: "nothing at this level" },
          { items: ["Cloud hosting on hyperscaler regions"], tone: "steel" },
          { empty: "nothing at this level" },
        ],
      },
      {
        label: "Building",
        hint: "Invested in, some of it live. Ask what is running today",
        cells: [
          { items: ["Ariba and source-to-procure", "SAP Business AI and Joule agents"], tone: "light" },
          { items: ["Applied AI inside enterprise processes"], tone: "light" },
          { empty: "nothing at this level" },
          { items: ["Salesforce", "Workday"], tone: "light" },
        ],
      },
      {
        label: "Ahead of us",
        hint: "We do not do this. If you need it we will say so and point you elsewhere",
        cells: [
          { items: ["RISE Validated Partner designation"] },
          { empty: "nothing at this level" },
          { items: ["24×7 network and security operations", "Operational technology and historians"] },
          { items: ["Oracle, ServiceNow, Dynamics, Adobe"] },
        ],
      },
    ],
    note: {
      title: "Five of our nineteen capabilities are things we do not do.",
      body: "They are on this page for the same reason the rest are: so that one conversation settles whether we are the right firm, instead of four.",
    },
  },

  "z2-claim-lifecycle": {
    kind: "steps",
    eyebrow: "How this site works",
    title: "How a claim gets onto this site,",
    titleAccent: "and how it leaves.",
    lede: "Four checks run on every build. Any one of them failing stops the whole site publishing, not just the line that failed.",
    summary:
      "Four stages left to right (evidence, recorded, published, expires) above the four checks that run on every build: the capability register, the corporate facts, the house style and the outcome figures. If any one fails, nothing publishes.",
    steps: [
      {
        badge: "01",
        label: "Evidence",
        title: "A piece of evidence",
        body: "A purchase order, a statement of work, a measurement taken from the system, or SAP's own partner profile.",
        sub: { text: "Never another case study, and never a deck." },
        tone: "navy",
      },
      {
        badge: "02",
        label: "Recorded",
        title: "Written into a content file",
        body: "With the date a person last checked it, and, for a figure, what it is a number of, the window and who measured it.",
        sub: { text: "The record carries the provenance, not the prose." },
      },
      {
        badge: "03",
        label: "Published",
        title: "The claim appears",
        body: "With its review date beside it, and the date it stops publishing.",
        sub: { text: "Two fixed dates. Never “verified recently”." },
      },
      {
        badge: "04",
        label: "Expires",
        title: "A person re-checks it",
        body: "Against the evidence, or it comes off the site.",
        sub: { text: "Editing the date without doing the check is the one failure this cannot catch." },
        tone: "navy",
      },
    ],
    cardsLabel: "Every build runs these four",
    cards: [
      {
        title: "The capability register",
        body: "Stops if nobody has re-checked it in 90 days",
        foot: "content/capability-status.ts",
      },
      {
        title: "The corporate facts",
        body: "Stops if nobody has re-checked them in 200 days",
        foot: "content/site.ts",
      },
      {
        title: "The house style",
        body: "Stops on an adjective with no possible test",
        foot: "scripts/house-style.mjs",
      },
      {
        title: "Outcome figures",
        body: "Stops on a percentage with no recorded baseline",
        foot: "scripts/figures.mjs",
      },
    ],
    cardsColumns: 4,
    note: {
      title: "If any one of them fails, nothing publishes.",
      body: "Not a warning in a backlog and not a flag on the offending line: the build stops, and the whole site stays on its previous version until a person fixes it.",
    },
    closing: {
      title: "And then it starts again.",
      body: "Every claim on this site is provisional. The only question is whether the date on it is still good.",
    },
  },

  "q1-reference-book": {
    kind: "layers",
    eyebrow: "Client work",
    title: "The reference book,",
    titleAccent: "by sector.",
    summary:
      "Twenty-one named clients by sector: power, utilities and energy; metals, mining and heavy industry; consumer, retail and food; government, transport and logistics; technology, telecom and services. Each one has a written engagement behind it.",
    layers: [
      {
        label: "Power, utilities and energy",
        tone: "navy",
        entries: [
          { name: "TGNPDCL", text: "State discom · ECC to RISE with S/4HANA" },
          { name: "APTRANSCO", text: "Transmission · three-year onsite AMS" },
          { name: "Delhi Transco", text: "Transmission · full-estate AMS" },
          { name: "POWERGRID", text: "Maharatna PSU · SuccessFactors succession" },
          { name: "A global energy major", text: "Global template · 126 plants, 26 countries" },
        ],
      },
      {
        label: "Metals, mining and heavy industry",
        tone: "steel",
        entries: [
          { name: "NMDC Limited", text: "Iron ore, Navratna · S/4HANA and AMS" },
          { name: "NMDC Steel", text: "Integrated steel · S/4HANA" },
          { name: "NALCO", text: "Aluminium, Navratna · Plant Maintenance, 13 months" },
          { name: "Welspun Group", text: "Line pipes and textiles · Analytics Cloud" },
          { name: "Triveni Turbines", text: "Steam turbines · ECC to RISE in five months" },
          { name: "Wipro Infrastructure Engineering", text: "Water and EPC · greenfield S/4HANA, nine modules" },
        ],
      },
      {
        label: "Consumer, retail and food",
        tone: "light",
        entries: [
          { name: "Hero MotoCorp", text: "Two-wheelers · SuccessFactors, 14,000 staff" },
          { name: "Bata India", text: "Footwear retail · SuccessFactors in six months" },
          { name: "Varun Beverages", text: "Beverages · Ariba across 14 countries" },
          { name: "WayCool Foods", text: "Agri-commerce · RISE in eight weeks" },
          { name: "VAHDAM India", text: "Tea · GROW with SAP, one year" },
        ],
      },
      {
        label: "Government, transport and logistics",
        tone: "plain",
        entries: [
          { name: "Transnet SOC Ltd", text: "State freight, ports and pipelines · ECC 6.0 to S/4HANA on RISE" },
          { name: "Kenya Railways Corporation", text: "State rail · greenfield SAP ECC, ten months" },
          { name: "CEDA, Botswana", text: "Development finance · ECC 6.0 to S/4HANA on RISE" },
        ],
      },
      {
        label: "Technology, telecom and services",
        tone: "plain",
        entries: [
          { name: "Proximus", text: "Belgian telecoms · S/4HANA Public Cloud, IFRS 15" },
          { name: "Tredence", text: "Data science · SuccessFactors, seven countries" },
          { name: "Livspace", text: "Digital design · SuccessFactors and Concur" },
          { name: "AVASO Technology", text: "Global IT services · GROW, RISE and SuccessFactors" },
          { name: "An EdTech unicorn", text: "Education · GROW with SAP" },
          { name: "A global engineering consultancy", text: "Infrastructure · GROW, SuccessFactors and C4C" },
        ],
      },
    ],
    closing: {
      title: "Twenty-one named clients. Not a logo wall.",
      body: "Each one has a written engagement behind it. Each one publishes only with that client's consent: name, figures and logo asked for separately.",
    },
  },

  "z3-anatomy-number": {
    kind: "compare",
    eyebrow: "How we publish numbers",
    title: "What a figure has to carry",
    titleAccent: "before it goes on this site.",
    lede: "A percentage without its baseline is not merely unproven. It is worth less than no number at all, because it costs the reader a unit of trust and gives their procurement team something to discount.",
    summary:
      "Two panels compared: the usual form of an outcome claim, a large percentage with four empty slots, against the form we publish, where what it is a number of, the period it covers, who did the arithmetic and what is not counted are all filled in.",
    left: {
      label: "The usual form",
      value: "40%",
      caption: "faster resolution",
      slots: [
        { label: "What it is a number of", text: "not stated" },
        { label: "The period it covers", text: "not stated" },
        { label: "Who did the arithmetic", text: "not stated" },
        { label: "What is not counted", text: "not stated" },
      ],
      footnote: "Checked against two competitor case studies, November 2026.",
    },
    right: {
      label: "What we publish",
      value: "70–75%",
      caption: "met by standard",
      slots: [
        {
          label: "What it is a number of",
          text: "More than 700 catalogued requirements across finance, quote-to-bill and fulfilment",
        },
        { label: "The period it covers", text: "The fit-to-standard assessment, tested requirement by requirement" },
        {
          label: "Who did the arithmetic",
          text: "Measured by us, against a baseline recorded before the work started",
        },
        { label: "What is not counted", text: "Requirements the client withdrew during the workshops" },
      ],
      footnote: "From a 2026 S/4HANA Public Cloud assessment for a Belgian B2B ICT operator.",
    },
    note: {
      title: "A number that cannot fill all four slots does not appear as a number.",
      body: "It is a build failure here, not a style preference, which is why several of our case studies carry no percentage at all.",
    },
  },

  "r1-welspun-account": {
    kind: "figures",
    eyebrow: "Client work · Welspun Group",
    title: "What an account looks like",
    titleAccent: "after seven years.",
    summary:
      "The Welspun account after seven years: eighty-nine purchase orders across thirteen group companies, five service types under one account, the share each kind of work takes, and the entities it spread to.",
    stats: [
      { value: "89", label: "purchase orders and change requests" },
      { value: "13", label: "group companies in the register" },
      { value: "7 years", label: "of continuous engagement, 2018 to 2025" },
      { value: "5", label: "service types under one account" },
    ],
    breakdown: {
      label: "What the work was",
      items: [
        { value: 45.3, label: "Resource and specialist engagements" },
        { value: 31.1, label: "Managed support" },
        { value: 18.2, label: "Implementation" },
        { value: 5.4, label: "Licence and other" },
      ],
    },
    names: {
      label: "The entities it spread to",
      items: [
        "Welspun Living",
        "Welspun Corp",
        "Welspun Advanced Textiles",
        "Welspun Transformation Services",
        "Welspun Global Brands",
        "Welspun Global Services",
        "Welspun Flooring",
        "Welspun Enterprises",
        "Welspun DI Pipes",
        "Welspun Metallics",
        "Welspun Specialty Solutions",
        "Welspun Steel",
        "Welspun UK",
      ],
    },
    closing: {
      title: "One entity bought first. Twelve followed.",
      body: "No account grows like that on a pitch. It grows because the first delivery held, and the next business unit asked who did it.",
    },
  },
} satisfies Record<string, ExplainerSpec>;

export type ExplainerKey = keyof typeof EXPLAINERS;
