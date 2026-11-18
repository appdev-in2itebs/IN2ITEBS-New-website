// Industry body content for the /industries/[slug]/ pages.
// Overviews and capability sub-sections are reworded from the old-site bodies
// (docs/copy/industries/*.md + scraped/industries/*.md). No invented facts.

export const industryBodies: Record<
  string,
  {
    overview: string;
    features: { title: string; body?: string; bullets?: string[] }[];
  }
> = {
  automobiles: {
    overview:
      "Carmakers, suppliers and dealerships are transforming for a future of electric, connected and shared mobility. We help automotive businesses extend the value of RISE with SAP across the vehicle lifecycle — from design and manufacturing to sales, service and new mobility models.",
    features: [
      {
        title: "Research, Development & Engineering",
        body: "Design innovative vehicles and get them to market first, collaborating across the automotive ecosystem and ensuring compliance with industry standards.",
        bullets: [
          "Collaborative, agile product development informed by vehicle data and customer feedback",
          "What-if simulation for better engineering and downstream decisions",
          "Global product safety management and compliance",
          "Integrated R&D, manufacturing, aftermarket and mobility",
        ],
      },
      {
        title: "Smart Mobility",
        body: "Create value and monetise new business models for autonomous, connected, electric and shared vehicles, shifting towards mobility as a service.",
        bullets: [
          "Connected-vehicle data hub",
          "Urban and remote EV charge-point operations",
          "End-to-end fleet management",
          "Subscription billing and invoicing for MaaS",
        ],
      },
      {
        title: "Responsive Supply Networks",
        body: "Build a fast, responsive and resilient supply chain that senses disruption, reduces carbon footprint and delivers ahead of demand.",
        bullets: [
          "Real-time demand management and order promising",
          "Response, supply, inventory and operations planning",
          "Smart warehousing, transportation and logistics",
          "Green and sustainable supply chain management",
        ],
      },
      {
        title: "Sales & Marketing",
        body: "Deliver personalised, differentiated automotive experiences by connecting data from sales, service, marketing and connected cars.",
        bullets: [
          "360-degree customer profiles and personalised engagement",
          "Digital retailing and omnichannel sales",
          "Robust sales performance management",
          "Optimised vehicle distribution chains",
        ],
      },
      {
        title: "Manufacturing & Outbound Logistics",
        body: "Run agile, autonomous manufacturing with Industry 4.0 and smart-factory technologies, combining business and industrial IoT data.",
        bullets: [
          "Smart manufacturing systems in the cloud",
          "Full visibility into shop-floor and top-floor operations",
          "Environment, health and safety management",
          "Integration with the extended supply chain",
        ],
      },
      {
        title: "Aftermarket Service",
        body: "Grow revenue and drive brand loyalty with aftermarket services that exceed customer expectations.",
        bullets: [
          "Omnichannel customer service management",
          "Aftermarket parts management",
          "Warranty claims management",
          "Complaint handling",
        ],
      },
    ],
  },

  fmcg: {
    overview:
      "Transforming consumer packaged goods for the digital era is about more than direct-to-consumer models. We help businesses use new technology — including IoT and AI — to revolutionise internal processes and maximise speed and scale across product, manufacturing, supply chain and consumer experience.",
    features: [
      {
        title: "Product Innovation",
        body: "Use rich insights and ongoing consumer feedback to guide product design, adapt formulation to sustainability goals, and build a regenerative business.",
        bullets: [
          "Collaborative product design for faster time to market",
          "Adaptive product development and recipe formulation",
          "Feedback-inspired innovation and product experiences",
          "Improved product safety, compliance and environmental insight",
        ],
      },
      {
        title: "Goods Manufacturing",
        body: "Run smart, agile and autonomous manufacturing that adapts to changing demand, delivers personalised products at scale and reduces waste.",
        bullets: [
          "Smart manufacturing execution and Industry 4.0 capabilities",
          "Full visibility across supply, production, inventory and demand",
          "Predictive asset analytics and preventive maintenance",
          "Sustainable manufacturing and reduced resource consumption",
        ],
      },
      {
        title: "CPG Supply Chain",
        body: "See further down the chain and react in real time, so disruption is absorbed rather than passed on, and orders survive the handoffs that usually lose them.",
        bullets: [
          "Integrated supply chain planning and execution",
          "Smart warehouse and transportation management",
          "Open, collaborative supplier and logistics networks",
          "End-to-end transparency and track-and-trace",
        ],
      },
      {
        title: "Marketing, Sales & Consumer Experience",
        body: "Unify consumer insights from every touchpoint to deliver hyper-personalised, exceptional experiences across all channels and brands.",
        bullets: [
          "360-degree customer view and real-time analytics",
          "Omnichannel commerce and customer service",
          "Micro-segmentation, and a journey that survives a change of channel",
          "Value-added services and subscription billing management",
        ],
      },
    ],
  },

  "healthcare-life-sciences": {
    overview:
      "Our Healthcare & Life Sciences practice enhances the efficiency of physicians, hospitals, ancillary facilities, clinics, government health bodies and research organisations. With deep industry expertise across the healthcare ecosystem, we help pharmaceutical and medical-device companies, providers and payers achieve measurable results.",
    features: [
      {
        title: "More efficient, virtualised business models",
        body: "We enable healthcare organisations to create more efficient, effective, innovative and virtualised business models — arming the enterprise with the strategic thinking to respond wherever the industry's evolution leads.",
      },
      {
        title: "Deep industry expertise",
        body: "Our experience across the healthcare ecosystem helps organisations address challenges and seize opportunities by improving processes, creating efficiencies and unlocking innovation.",
      },
      {
        title: "End-to-end integrated solutions",
        body: "Innovative, end-to-end integrated solutions for healthcare providers, payers and life-sciences companies across the care continuum.",
      },
    ],
  },

  "textiles-apparel": {
    overview:
      "We provide SAP solutions that help textile and apparel businesses drive new growth, deliver digital services and become intelligent enterprises — through deep industry process expertise and integration across the value chain.",
    features: [
      {
        title: "End-to-end Planning",
        body: "Plan production resources finitely beyond classic MRP, accounting for capacity and material constraints.",
        bullets: [
          "Material requirement planning",
          "Master production scheduling",
          "Production process definition",
          "Integrated routings and bills of materials",
        ],
      },
      {
        title: "Production & Configuration",
        body: "Streamline scheduling across global production with detailed, constraint-aware planning.",
        bullets: [
          "Bill of materials, engineering change requests and notes",
          "Block, campaign, shelf-life and model-mix scheduling",
          "Detailed scheduling with setup matrix and sequence constraints",
        ],
      },
      {
        title: "Quality Management",
        bullets: ["Material inward quality check", "In-process quality check", "Finished-goods quality check"],
      },
      {
        title: "Inventory Management",
        bullets: ["Inventory planning", "Warehouse management", "Bin management"],
      },
      {
        title: "CRM, Finance & Purchase",
        bullets: [
          "Lead, opportunity and order management",
          "Sch VI and IFRS compliance, automated TDS and tax, multi-dimensional reporting",
          "Supplier evaluation, request for quote and quote comparison",
        ],
      },
      {
        title: "Retail & E-commerce",
        body: "Practical solutions across supply chain, merchandising, e-commerce and store management for apparel retail.",
      },
    ],
  },

  "metals-mining": {
    overview:
      "Heavy engineering and industrial manufacturers face the challenge of profitable sustainability — reducing emissions in their own operations while helping customers do the same. We deliver individualised, sustainable and smart machinery and components, at scale and as a service.",
    features: [
      {
        title: "Digital Product Innovation",
        bullets: [
          "Integrated product design and development",
          "Real-time insights for risk detection and decision-making",
          "Collaboration and change management",
          "Product safety, regulatory compliance and manufacturing PLM",
        ],
      },
      {
        title: "Marketing & Sales",
        bullets: [
          "Targeted industrial B2B marketing",
          "Sales-force automation and real-time insights",
          "One e-commerce platform for all go-to-market models",
          "Dynamic configuration, pricing and subscription billing",
        ],
      },
      {
        title: "Supply Chain",
        bullets: [
          "Synchronised demand, inventory and operations planning",
          "Streamlined transportation management",
          "Collaborative logistics and supplier networks",
          "Advanced warehouse automation and emissions compliance",
        ],
      },
      {
        title: "Smart Manufacturing",
        bullets: [
          "Embedded Industry 4.0 technologies and intelligence",
          "Continuous engineering-to-manufacturing collaboration",
          "Plant and asset performance management",
          "Environment, health, safety and risk management",
        ],
      },
      {
        title: "Servitisation & Aftermarket",
        bullets: [
          "Service management with detailed financial analysis",
          "Digital-twin technology for customer assets",
          "Omnichannel customer service and field-service optimisation",
          "Service-parts planning, sales and execution",
        ],
      },
    ],
  },

  "chemicals-fertilizers": {
    overview:
      "Create safe, sustainable chemicals through digital transformation. RISE with SAP is a stepping stone to the Intelligent Enterprise: SAP S/4HANA delivers automation around best-practice process standards, giving you the flexibility to optimise and transform amid mergers, divestitures, changing regulation and innovation.",
    features: [
      {
        title: "Sell business outcomes, not just products",
        body: "Collaborate with customers and suppliers, become part of their value chains, and use digital technologies to deliver innovative, outcome-based services.",
      },
      {
        title: "Simplify to shrink cycle times",
        body: "Run simulations and predictive models for real-time sense-and-respond, reducing time to market, streamlining operations and maximising asset performance.",
      },
      {
        title: "Compete as an ecosystem",
        body: "Capitalise on open co-innovation and extended manufacturing networks, redesigning relationships in line with market dynamics.",
      },
      {
        title: "Strategic agility",
        body: "Adjust strategy and portfolio dynamically in response to market opportunities, grow into new markets and segments, and capitalise on M&A and spin-offs.",
      },
    ],
  },

  "engineering-construction": {
    overview:
      "RISE with SAP and S/4HANA bring best-practice automation and the flexibility to optimise and transform engineering and construction businesses — building the intelligent enterprise across the full construction lifecycle.",
    features: [
      {
        title: "Pre-Construction",
        bullets: [
          "Opportunity and proposal management",
          "Pre-manufacturing operations",
          "Source and contract",
          "Virtual design and construction",
        ],
      },
      {
        title: "Construction Supply Chain",
        bullets: [
          "Track-and-trace and logistics networks",
          "Warehouse management",
          "Transportation management",
          "Response and supply planning",
        ],
      },
      {
        title: "Project Delivery",
        bullets: [
          "Contract and invoice management",
          "Mobile safety, quality and productivity enablement",
          "Buy and deliver goods and services",
          "Project management and collaboration",
        ],
      },
      {
        title: "Asset Management",
        bullets: [
          "Asset maintenance and facility operations",
          "Intelligent buildings",
          "Real-estate lifecycle management",
        ],
      },
    ],
  },

  "real-estate": {
    overview:
      "Intelligent ERP and asset-management solutions for developers, owners and operators — removing operational barriers across the real-estate lifecycle.",
    features: [
      {
        title: "Real-estate lifecycle management",
        body: "Leasing, operations and portfolio management across the full real-estate lifecycle.",
      },
      {
        title: "Asset maintenance & intelligent buildings",
        body: "Asset maintenance and facility operations with intelligent building services.",
      },
      {
        title: "Project & contract management",
        body: "Project management, contract and invoice management for developments.",
      },
    ],
  },

  bfsi: {
    overview:
      "Banking, financial services and insurance is one of our strategic verticals. We help firms build solutions that drive efficiency, effectiveness, innovation and virtualisation — managing risk, complying with regulations and enhancing product features.",
    features: [
      {
        title: "Application development & support",
        body: "Application development, maintenance and support, with implementation support, customisations, interfaces and testing.",
      },
      {
        title: "Risk & regulatory compliance",
        body: "Deep industry expertise to help manage risk and comply with the regulations that govern financial services.",
      },
      {
        title: "Product practices & consulting",
        body: "Product practices and consulting to enhance product features and meet business-transformation challenges.",
      },
    ],
  },

  "government-psu": {
    overview:
      "We partner with governments, public-sector entities and semi-government agencies on IT-based governance that promotes efficiency, transparency and policy effectiveness — enabling smart governance in the areas that matter most to citizens and consumers.",
    features: [
      {
        title: "Key focus areas",
        bullets: [
          "Effective, regionally tailored delivery of services to citizens and consumers",
          "Greater efficiency of government machinery and optimal use of public resources",
          "Transparent, responsive service delivery and outcome measurement",
          "Transparent public-expenditure management",
        ],
      },
      {
        title: "Domain experience",
        body: "Comprehensive solutions across governments and public-sector entities worldwide — enabling anytime, anywhere citizen services, improved efficiency and lower cost and wastage.",
      },
      {
        title: "Management plus technology",
        body: "Value-added solutions blending management and technical know-how, delivered end-to-end in the shortest possible time frame.",
      },
      {
        title: "Ready-to-use assets",
        body: "Frameworks that reduce total cost of ownership, accelerate implementation cycles and lower business risk.",
      },
    ],
  },

  "professional-services": {
    overview:
      "Firms are rethinking business models to drive growth and engage the best talent. We provide SAP solutions that help them deliver digital services and become intelligent enterprises — through deep process expertise and integration across the value chain.",
    features: [
      {
        title: "Project & Managed-Services Business",
        bullets: [
          "Billing and revenue innovation, service-centric billing",
          "Customer project management",
          "Travel-to-reimburse and field service management",
          "Customer experience management",
        ],
      },
      {
        title: "Total Talent Management",
        bullets: [
          "Core HR and service delivery",
          "External workforce management",
          "Payroll, time and attendance",
          "Talent acquisition, management, learning and analytics",
        ],
      },
      {
        title: "Business Development & Sales",
        bullets: [
          "Commerce personalisation and consent-based marketing",
          "Omnichannel commerce and optimised marketing",
          "Sales-force automation and sales performance management",
          "Single customer view and digital-services monetisation",
        ],
      },
      {
        title: "Core Finance",
        bullets: [
          "Record-to-report and invoice-to-pay",
          "Treasury and financial planning and analysis",
          "Real-estate management and invoice-to-cash",
          "Governance, risk and compliance",
        ],
      },
    ],
  },

  "energy-utilities": {
    overview:
      "RISE with SAP and S/4HANA bring best-practice automation and the flexibility to optimise and transform energy and utility businesses — driving operational excellence and unlocking new revenue.",
    features: [
      {
        title: "Operational excellence",
        body: "Cost-efficient, compliant and safe generation with smart asset operations and maintenance, and fully digital allocation of spare parts, work and logistics.",
      },
      {
        title: "Regulatory compliance & security",
        body: "Embedded market communication for timely, accurate regulatory compliance, with optimised CAPEX and OPEX and secured revenue.",
      },
      {
        title: "New revenue streams",
        body: "Sell new services and create energy communities, turning traditional customers into prosumers and increasing project profitability.",
      },
      {
        title: "Customer intimacy",
        body: "Holistic customer service with faster new offers, a single invoice and partner-network revenue.",
      },
      {
        title: "Digitalised production & ecosystem value",
        body: "Adapt the supply chain in real time, eliminate siloed operations and make data a strategic asset for real-time operational insight and transparency.",
      },
    ],
  },

  "media-telecom": {
    overview:
      "We partner with leading telecom companies to develop next-generation solutions that offer cost advantage and faster time-to-market — executing large-scale engagements with flexible consulting, systems integration and rollout across multiple sourcing models.",
    features: [
      {
        title: "Integrated, efficient operations",
        body: "Operations integrated end to end, so a change in one function shows up in the next without a reconciliation step in between.",
      },
      {
        title: "Superior decision support",
        body: "Superior decision-support systems for better, faster decisions.",
      },
      {
        title: "Vertical integration & value chains",
        body: "Support for vertical integration, mergers and acquisitions, and stronger value-chain linkages.",
      },
      {
        title: "Sustainable, optimised procurement",
        body: "Reduced energy intensity and optimised procurement of essential supplies.",
      },
    ],
  },
};

export function getIndustryBody(slug: string) {
  return industryBodies[slug];
}
