/**
 * INDUSTRY PAGES — nine, down from fourteen.
 *
 * An industry page with no client work behind it is an assertion with a navigation entry. Every
 * page here has at least one named engagement evidenced by a purchase order or a signed contract.
 * The five that were retired had navigation entries and nothing else.
 *
 * "14+ industry verticals" remains an approved fact and stays on the About page as a statement of
 * reach. The PAGES exist where there is something to show.
 *
 * Client names on this page are published only where written consent exists. Where it does not,
 * the engagement is described by sector and region and the name is withheld — never implied.
 */

export interface IndustryOffering {
  label: string;
  body?: string;
}

export interface IndustrySection {
  title: string;
  body?: string;
  bullets?: string[];
  offerings?: IndustryOffering[];
  image?: string;
}

export interface LegacyIndustry {
  slug: string;
  name: string;
  title?: string;
  intro: string[];
  image?: string;
  sectionsHeading?: string;
  sections: IndustrySection[];
  /** Logo files under /public/industries/<slug>/. Empty until client consent is confirmed. */
  customers: string[];
  metaDescription: string;
  sourceUrl: string;
}

const src = (slug: string) => `https://www.in2itebs.com/industries/${slug}/`;

export const legacyIndustries: LegacyIndustry[] = [
  {
    slug: "metals-mining-steel",
    name: "Metals, mining and steel",
    title: "Where the tonnage and the ledger have to be the same number",
    sourceUrl: src("metals-mining-steel"),
    metaDescription:
      "SAP for mining and metals — grade-based contract pricing, gate and weighbridge control, fleet integration and statutory levies, delivered at Navratna public sector undertakings.",
    customers: [],
    intro: [
      "Volume leakage in mining is rarely a single fraud event. It is small, unrecorded discrepancies at the gate, repeated daily — and a commercial system that learns about them weeks later, if at all.",
      "Our deepest evidenced industry book. Three Navratna public sector undertakings among the references, and a mine-to-dispatch design running in production.",
    ],
    sectionsHeading: "What we have built here",
    sections: [
      {
        title: "Grade-based pricing, built into the contract",
        body: "Iron ore is sold on quality, not a flat unit price. Sales are booked against contractual quality parameters and, after dispatch, laboratory results are compared automatically against the contracted band — a debit memo where the grade is better, a credit memo where it is worse. The calculation runs off the same quality record the lab and the plant metallurgist have already signed off, so commercial and quality data never diverge.",
      },
      {
        title: "Weight and identity, checked at the truck",
        body: "A gate control module running identically at mine gates, plant boundaries and pellet plants, from parking through weighment to check-out. It connects natively to static weighbridges for trucks and in-motion weighbridges for rakes, and checks vehicle fitness, insurance, permit and driver licence validity before entry is granted. Every gate movement is tied to a delivery, shipment or stock transport document — there is no gate event outside the transactional record.",
      },
      {
        title: "Production confirmed from the plant, not the logbook",
        body: "Drilling, blasting and excavation data feed into SAP from the manufacturing execution system for automatic production confirmation. Stockpile figures used for planning and stockpile figures used for financial valuation are the same number, because they come from the same confirmation.",
      },
      {
        title: "Fleet on the same system of record",
        body: "Plant maintenance linked to the fleet management system across excavators, dumpers, haul trucks, drills and crushing plant. A fault raises a maintenance notification automatically; hour-meter readings trigger preventive maintenance on actual equipment hours rather than a calendar estimate; and fuel is costed to the machine that used it rather than at a fleet-wide average.",
      },
      {
        title: "A levy engine inside the transaction",
        body: "Statutory levies calculated as a function of quantity and grade extracted, from the same transactional data used for sales and production reporting — not a period-end spreadsheet reconciled afterwards. The gate-printed invoice carries a digital signature and code, so compliance is verified before a vehicle leaves the site.",
      },
      {
        title: "Permit to work, where it matters most",
        body: "Plant Maintenance with Work Clearance Management — the module that sits between a maintenance order and a person with a spanner, and stops an isolation being lifted while someone is still inside the equipment. Unglamorous, rarely demonstrated, and in a Government of India enterprise under statutory audit it is also a record somebody will ask to see.",
      },
    ],
  },
  {
    slug: "power-utilities",
    name: "Power and utilities",
    title: "Meters installed is not revenue collected",
    sourceUrl: src("power-utilities"),
    metaDescription:
      "SAP for power generation, transmission, distribution and water — meter-to-cash, contract accounting, asset management and the first utility RISE migration in India.",
    customers: [],
    intro: [
      "Six pressures are reshaping how utilities run, and every one of them lands on the ERP core: revenue and water losses, ageing ERP estates, asset reliability, the energy transition, affordability and collections, and scrutiny from regulators, lenders and investors.",
      "Our most evidenced sector by named references, across distribution, transmission, generation and water.",
    ],
    sectionsHeading: "Across the value chain",
    sections: [
      {
        title: "Distribution",
        body: "ECC to RISE with SAP S/4HANA, integration to geographic, billing, metering and attendance systems, and real-time operational reporting. Our distribution reference covers eighteen districts and a network serving more than fifteen million people.",
      },
      {
        title: "Transmission",
        body: "Network asset maintenance, project systems for grid capital expenditure, and finance, materials and human resources on one core — with annual application support across the full estate at two state transmission utilities.",
      },
      {
        title: "Generation and equipment",
        body: "Plant maintenance and asset performance, capital projects and procurement, and multi-plant templates — including a global template rolled out to 126 plants across 26 countries.",
      },
      {
        title: "Water and wastewater",
        body: "Treatment works, pump and network maintenance, and the full engineering, procurement and construction lifecycle from concept to commissioning. S/4HANA Utilities runs electricity, water and sewerage on one data model, so contract accounting, billing and network-maintenance experience carries straight across.",
      },
      {
        title: "Meter to cash",
        body: "Closing the gap from meter read to collected cash, with one partner accountable for the whole flow rather than five suppliers each meeting their own target while the revenue sits between them.",
      },
      {
        title: "Where SAP meets the network",
        body: "A utility never runs on SAP alone. We design the core together with the operational systems around it — metering head-ends and meter data management, geographic systems, control and outage management, prepaid vending and mobile money — so meter, network and customer data flow without manual hand-offs. Integration to operational technology follows IEC 62443 zones and conduits: there are no direct paths from a control system to the ERP.",
      },
    ],
  },
  {
    slug: "government-public-sector",
    name: "Government and public sector",
    title: "Built for the buyer who has to show their working",
    sourceUrl: src("government-public-sector"),
    metaDescription:
      "SAP for public sector undertakings, state utilities and state-owned enterprises — delivered under open tender, national audit and statutory reporting obligations.",
    customers: [],
    intro: [
      "A large part of our work is for public sector undertakings, state utilities and state-owned enterprises operating under national audit. That shapes how we build, not just what we say.",
      "Five named references across three countries, three of them state-owned enterprises, and every one of them won on open tender.",
    ],
    sectionsHeading: "What we understand about this buyer",
    sections: [
      {
        title: "Procurement that is designed to make favouritism difficult",
        body: "Our public sector engagements were won separately, each against a published request for proposal, several through central procurement portals. There is no framework to sit inside and no incumbency to rely on. You do the small thing well, and you are allowed to bid for the next one.",
      },
      {
        title: "Change control with a named approver",
        body: "Every configuration change and workflow approval logged, reviewable and mapped to a person — built for statutory audit rather than retrofitted for it.",
      },
      {
        title: "Segregation of duties that holds commercially",
        body: "On our mining estate, no single role can move a lot from contract through laboratory result and usage decision to invoice. That is a design choice, and it is the kind of control an auditor asks about.",
      },
      {
        title: "Data residency by design",
        body: "For Indian public sector workloads we deliver on MeitY-compliant hosting with data centre and disaster recovery inside Indian jurisdiction, aligned to the DPDP Act and the IT Act. In our other markets we deliver against the equivalent local requirement.",
      },
      {
        title: "Beyond SAP",
        body: "For one state mining corporation we have delivered three separately tendered contracts in four years: an AI facial-recognition attendance system, a twelve-month infrastructure managed service across servers, operating systems, databases, endpoints, applications and network security, and an integration layer between SAP and the corporation's management information systems. Firms that describe themselves as SAP partners do not usually also run the servers.",
      },
      {
        title: "Transport and logistics",
        body: "A greenfield SAP implementation inside an African state rail corporation, delivered in ten months across finance, procurement, sales, production, transport and human resources, with workflow-based approvals and reporting into the relevant ministries. And a brownfield conversion to S/4HANA on RISE inside a national freight rail, port and pipeline operator of more than fifty-five thousand people.",
      },
    ],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    title: "Where the shop floor and the ledger have to agree",
    sourceUrl: src("manufacturing"),
    metaDescription:
      "SAP for manufacturing and industrial engineering — S/4HANA conversions, RISE migrations, engineering project lifecycles and plant maintenance.",
    customers: [],
    intro: [
      "Manufacturers do not buy ERP. They buy the ability to know what a product costs, where a batch went, and whether the plant can commit to a date — and to still know it after the system changes.",
    ],
    sectionsHeading: "What we deliver here",
    sections: [
      {
        title: "Migration without losing the plant",
        body: "A brownfield ECC to S/4HANA conversion and move to RISE on Azure delivered in five months for a steam turbine manufacturer serving customers in more than eighty countries — covering sourcing and procurement, traceability for recalls, demand forecasting and supply chain planning, parts interchangeability, quality control and production scheduling.",
      },
      {
        title: "The engineering project lifecycle",
        body: "A greenfield S/4HANA implementation across nine modules — finance, controlling, project systems, materials, sales, production planning, quality, maintenance and customer service — covering the full engineering, procurement and construction lifecycle from concept through commissioning to after-sales service.",
      },
      {
        title: "The cloud route for the mid-market",
        body: "S/4HANA Cloud Public Edition for manufacturers who need a real ERP without a multi-year programme — on pre-configured industry processes and a quarterly release cadence.",
      },
      {
        title: "Keeping it running",
        body: "Specialist engineers placed inside manufacturing IT teams on long-running engagements, and managed support under published severity bands — including for estates we did not implement.",
      },
    ],
  },
  {
    slug: "consumer-goods-distribution",
    name: "Consumer goods and distribution",
    title: "One business, and a different tax authority in every market",
    sourceUrl: src("consumer-goods-distribution"),
    metaDescription:
      "SAP and SuccessFactors for consumer goods, food and beverage and retail — global HR platforms, statutory e-invoicing integrations and cloud migrations across Asia and Africa.",
    customers: [],
    intro: [
      "A multinational consumer business does not have one compliance problem. It has one per country, and each one arrives with a statutory deadline and no glamour.",
      "Six named references across food and beverage, retail and agri-commerce, with delivery into seven countries.",
    ],
    sectionsHeading: "What we deliver here",
    sections: [
      {
        title: "One people platform across many entities",
        body: "A single Employee Central deployment with SAP HCM underneath it — payroll, organisation management, personnel administration and time management — implemented across six legal entities in four countries on a fixed price and a five-month plan, then extended into recruiting, onboarding, performance and goals.",
      },
      {
        title: "The statutory integrations nobody puts in a brochure",
        body: "Revenue authority integrations across southern and eastern Africa: electronic signature devices, virtual fiscal devices, e-invoicing dashboards for sales and purchase registers, smart invoicing for imports and procurement, and an e-invoicing solution for a plant in a special economic zone. Work with a legal deadline and a direct consequence if it is late.",
      },
      {
        title: "Retail and footwear",
        body: "SuccessFactors Employee Central with Performance and Goals delivered in six months for a national footwear retailer with more than thirteen hundred stores — centralising employee data, automating HR operations and introducing a structured performance framework.",
      },
      {
        title: "Procurement at scale",
        body: "Sourcing, supplier collaboration, contract management and spend visibility for a beverage business operating across fourteen countries.",
      },
      {
        title: "Cloud for the digitally native brand",
        body: "S/4HANA Cloud Public Edition for online-first consumer brands — covering finance, sourcing and procurement, sales and manufacturing, with compliance reporting and integration to the goods and services tax network and to commerce platforms.",
      },
    ],
  },
  {
    slug: "pharma-healthcare-life-sciences",
    name: "Pharma, healthcare and life sciences",
    title: "The implementation is a project. The audit trail is forever.",
    sourceUrl: src("pharma-healthcare-life-sciences"),
    metaDescription:
      "SAP SuccessFactors and S/4HANA for pharmaceutical manufacturers, hospital groups, biotech and diagnostics — eight evidenced engagements across the sector.",
    customers: [],
    intro: [
      "People systems carry more regulatory weight here than in most industries. Training records, qualification currency and who was certified to do what on which date are not HR niceties in a plant making sterile antibiotics or a hospital running theatres — they are evidence in an inspection.",
      "Eight clients in this sector, every one of them evidenced by a purchase order.",
    ],
    sectionsHeading: "What we see in this sector",
    sections: [
      {
        title: "Why most of this book is support, not implementation",
        body: "Seven of our eight engagements in this sector are SuccessFactors, and most are support contracts rather than implementations. The implementation is a project. The audit trail is forever, and it only holds if somebody keeps the system current through every statutory change and every reorganisation. Our longest-running engagement in this sector has been live for six years. Our newest runs to 2027.",
      },
      {
        title: "Hospital groups",
        body: "A two-phase SuccessFactors implementation for one of India's largest private hospital networks, structured across six payment milestones with the final tenth released only after hypercare closed. A hospital group runs continuous shifts across clinical and non-clinical staff, with credentialing requirements and leave patterns no standard template anticipates.",
      },
      {
        title: "Pharmaceutical manufacturing",
        body: "SuccessFactors implementation and managed support across capsule and packaging manufacture, sterile antibiotics, listed formulations businesses and ophthalmic specialty producers — covering recruiting, onboarding, employee central, performance and learning.",
      },
      {
        title: "Biotech and life sciences",
        body: "Multi-year SuccessFactors terms for biotechnology and active pharmaceutical ingredient producers, and SAP premium application support for herbal and animal health ingredient manufacture.",
      },
      {
        title: "Diagnostics and medical devices",
        body: "RISE with SAP implementation for diagnostics and medical device operations.",
      },
    ],
  },
  {
    slug: "technology-digital-natives",
    name: "Technology and digital natives",
    title: "A real ERP, before the spreadsheets become the risk",
    sourceUrl: src("technology-digital-natives"),
    metaDescription:
      "SAP S/4HANA Cloud and SuccessFactors for technology businesses, digital natives and scale-ups — including internet, edtech, data science and IT services companies.",
    customers: [],
    intro: [
      "Companies growing faster than their systems. Finance is closing the month by hand, the business has outgrown what it started on, and nobody has the appetite for a multi-year programme.",
      "Seven references across internet platforms, education technology, data science, engineering consultancy and IT services.",
    ],
    sectionsHeading: "What we deliver here",
    sections: [
      {
        title: "Cloud ERP on standard processes",
        body: "S/4HANA Cloud Public and Private Edition across finance, sourcing and procurement, sales and professional services — implemented against pre-configured industry processes rather than rebuilt around however the business currently works.",
      },
      {
        title: "Scale that has to hold",
        body: "Platforms sized for real volume — including an education technology business handling more than a hundred thousand student transactions a day, with cloud storage integration and unified sales booking across online and offline channels.",
      },
      {
        title: "Telecommunications and subscription businesses",
        body: "Subscription billing, advanced variant configuration and IFRS 15 revenue recognition for a European telecommunications operator — three of the harder things to get right in that sector.",
      },
      {
        title: "People systems for distributed firms",
        body: "SuccessFactors across multi-country professional services businesses, consolidating fragmented HR systems into a single source of employee data, and integrated with travel and expense management.",
      },
      {
        title: "The integration a growing company forgets",
        body: "Commerce platforms, payment gateways, statutory e-invoicing and the customer relationship system — connected to the ERP so that two systems cannot quietly disagree about what a customer ordered.",
      },
    ],
  },
  {
    slug: "banking-financial-services",
    name: "Banking and financial services",
    title: "Development finance, with the audit scrutiny that comes with it",
    sourceUrl: src("banking-financial-services"),
    metaDescription:
      "SAP S/4HANA for development finance institutions and lenders — brownfield conversion on RISE, with public-sector financial process and compliance alignment.",
    customers: [],
    intro: [
      "A short page, deliberately. We have one evidenced reference in this sector and we would rather say so than pad it.",
    ],
    sectionsHeading: "What we have delivered",
    sections: [
      {
        title: "A state-established development finance institution",
        body: "A brownfield conversion of an ECC 6.0 estate to S/4HANA on RISE for a government-established development finance institution with more than five hundred employees, providing loans, equity, lease and property finance alongside training and business advisory services. Readiness assessment, system conversion, custom code remediation and data validation, with a deliberate move away from legacy customisation toward standard practice.",
      },
      {
        title: "Why it transfers",
        body: "A regulated lender with a loan book, a compliance regime and state establishment has the same shape of problem as a commercial bank's back office: financial transparency, auditable process and a core that cannot be disrupted while lending continues. We are not claiming a retail banking practice. We are claiming this.",
      },
    ],
  },
  {
    slug: "real-estate-infrastructure",
    name: "Real estate and infrastructure",
    title: "Workspace and property operations on a cloud core",
    sourceUrl: src("real-estate-infrastructure"),
    metaDescription:
      "SAP S/4HANA Cloud for real estate, workspace and property operations — implementation, managed support and licensing.",
    customers: [],
    intro: ["A short page, deliberately. One evidenced reference, and we would rather say so than pad it."],
    sectionsHeading: "What we have delivered",
    sections: [
      {
        title: "Flexible workspace operations",
        body: "RISE with SAP S/4HANA Cloud — implementation, managed support and licensing — for the Indian operation of a flexible workspace business, in partnership with one of India's largest commercial real estate developers.",
      },
      {
        title: "Why it transfers",
        body: "Property and workspace operations run on long-lived assets, multi-entity structures, recurring revenue and heavy capital project accounting. That combination is closer to our utilities and engineering project work than it looks.",
      },
    ],
  },
];

export function getLegacyIndustry(slug: string) {
  return legacyIndustries.find((industry) => industry.slug === slug);
}
