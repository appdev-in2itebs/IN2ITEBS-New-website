/**
 * The fourteen Industries pages as the existing in2itebs.com site presents them, in its menu
 * order, with that site's own copy (fetched and checked on 2026-09-19). Only the theme is this
 * site's. Photographs and the "Our Customers" logo strips are the same files those pages serve,
 * under /public/industries/<slug>/.
 */

export interface IndustryOffering {
  /** The offering's name, e.g. "SAP Product Lifecycle Costing". */
  label: string;
  body?: string;
}

export interface IndustrySection {
  title: string;
  body?: string;
  bullets?: string[];
  /** Numbered offerings ("i) … ii) …") the existing page lists under this heading. */
  offerings?: IndustryOffering[];
  /** A photograph the existing page places beside this section. */
  image?: string;
}

export interface LegacyIndustry {
  slug: string;
  /** Menu label, exactly as the existing menu prints it. */
  name: string;
  /** The page's own H1, where it differs from the menu label. */
  title?: string;
  intro: string[];
  image?: string;
  /** A heading the existing page places above its sections ("Solutions we provide", …). */
  sectionsHeading?: string;
  sections: IndustrySection[];
  /** Logo files under /public/industries/<slug>/, in the order the page shows them. */
  customers: string[];
  metaDescription: string;
  sourceUrl: string;
}

export const legacyIndustries: LegacyIndustry[] = [
  {
    slug: "automobiles",
    name: "Automobiles",
    sourceUrl: "https://in2itebs.com/automobiles/",
    metaDescription: "Connect planning, production, supply chain and customer processes across automotive operations.",
    intro: [
      "The race for automotive digital transformation – Carmakers, suppliers, and dealerships are under intense pressure to transform their businesses and prepare for the future of mobility. The automotive industry is racing toward a new world that's driven by sustainability and changing consumer behaviour, encompassing electric vehicles, connected cars, mobility fleet sharing, onboard sensors, new business models, and always-on connectedness.",
    ],
    sections: [
      {
        title:
          "You can derive incremental value from your RISE with SAP solution by expanding business innovation with",
        offerings: [
          {
            label: "SAP Product Lifecycle Costing",
            body: "Improve profits by managing costs accurately in the early design phase.",
          },
          {
            label: "SAP Digital Manufacturing Cloud",
            body: "Boost manufacturing performance with integrated cloud MES and analytics.",
          },
          {
            label: "SAP Digital Vehicle Hub",
            body: "Leverage a common central vehicle repository to support new business models in the mobility as a service space.",
          },
          {
            label: "SAP Returnable Packaging Management",
            body: "Manage the inventory and logistics of returnable packaging in the supply chain.",
          },
          { label: "SAP Self-Billing Cockpit", body: "Streamline and automate your self-billing processes." },
          {
            label: "SAP Supplier Problem-Solving",
            body: "Participate in problem-solving processes in collaboration with external suppliers.",
          },
        ],
      },
      {
        title: "Research, Development, and Engineering",
        body: "Design innovative vehicle products and services – and get them to market first – with SAP solutions. Collaborate with partners across the automotive ecosystem, accelerate product development, and help ensure compliance with auto industry standards.",
        bullets: [
          "Innovations based on actual vehicle data, incidents, customer feedback, and market analysis",
          "What-if simulation for better decision-making – in auto engineering and downstream",
          "Integrated, collaborative, and agile product development",
          "Global product safety management and compliance",
          "Integrated everything – from R&D and manufacturing to aftermarket services and mobility",
        ],
      },
      {
        title: "Smart Mobility and Transformation",
        body: "Create value and monetize new business models for autonomous, connected, electric and shared vehicles with SAP. Our solutions can help you personalise in-car services, support subscription-based contracts, manage e-fleets, build and run EV charging networks, and more. Embrace change in the industry and shift toward mobility as a service (MaaS).",
        bullets: [
          "Connected vehicle data hub",
          "Urban and remote EV charge-point operations",
          "End-to-end fleet management",
          "IoT-based logistics and transportation management",
          "Subscription billing and invoicing",
        ],
      },
      {
        title: "Responsive Supply Networks",
        body: "Create a fast, responsive, and resilient automotive supply chain. Our solutions support collaborative supply chain planning; digitalized operations; and smart warehousing, inventory, and logistics, enabling you to proactively sense disruptions, reduce your carbon footprint, deliver ahead of demand, and more.",
        bullets: [
          "Real-time demand management and order promising",
          "Response, supply, inventory, and operations planning",
          "Smart warehousing, transportation, and logistics",
          "Supply network collaboration",
          "Green and sustainable supply chain management",
        ],
      },
      {
        title: "Sales and Marketing",
        body: "Deliver personalized, differentiated automotive experiences that create customers for life. Connect data from all sources – sales, service, marketing, and connected cars – to get deeper insights and proactively meet customer needs on every channel, and leverage solutions for real-time contextual marketing, omnichannel sales, billing, and more.",
        bullets: [
          "360-degree customer profiles and personalized engagements",
          "Digital automotive retailing and omnichannel sales",
          "Smooth billing and buying experiences",
          "Robust sales performance management",
          "Optimised vehicle distribution chains",
        ],
      },
      {
        title: "Manufacturing and Outbound Logistics",
        body: "Run agile, highly autonomous automotive manufacturing, production, and assembly processes using Industry 4.0 and smart factory technologies from SAP. Combine business data with industrial IoT data to maximise manufacturing efficiency, improve sustainability, and cut costs.",
        bullets: [
          "Smart auto manufacturing systems in the cloud",
          "Modular production and Industry 4.0 scenarios",
          "Full visibility into shopfloor and top-floor operations",
          "Environment, health, and safety management",
          "Integration with the extended supply chain and outbound logistics network",
        ],
      },
      {
        title: "Aftermarket Service",
        body: "Grow revenue and drive brand loyalty by offering automotive aftermarket services that exceed customer expectations. SAP solutions support omnichannel customer service, parts management, warranty claims processing, and complaint handling.",
        bullets: [
          "Omnichannel customer service management",
          "Aftermarket auto parts management",
          "Warranty claims management",
          "Complaint handling",
        ],
      },
    ],
    customers: [
      "avtec-1.png",
      "denso-1.png",
      "gbsprings-1.png",
      "hero-1.png",
      "jcb.png",
      "kawasaki-1.png",
      "lohiya-corp-1.png",
      "lumax-1.png",
      "maini-1.png",
      "mg-motors-1.png",
      "napino-1.png",
      "ola-1.png",
      "ola-electric-1.png",
      "padmini-vns-1.png",
      "psa-avtec-1.png",
      "sany-1.png",
      "unominda-1.png",
    ],
  },
  {
    slug: "fmcg",
    name: "FMCG",
    sourceUrl: "https://in2itebs.com/fmcg-2/",
    metaDescription:
      "Support packaged goods businesses with connected planning, production, distribution and analytics.",
    image: "istockphoto-1314035333-612x612-1.jpg",
    intro: [
      "Exceed the diverse expectations of consumers and enable your company to grow in an uncertain world sustainably and profitably. Transforming consumer packaged goods (CPG) for the digital era isn't just about moving to direct-to-consumer models. It's about using new technology – like the Internet of Things (IoT) and AI – to revolutionize internal processes and maximize speed and scalability.",
    ],
    sections: [
      {
        title: "Product Innovation",
        image: "innovation-561388_640.jpg",
        body: "Use rich insights and ongoing consumer feedback to guide CPG product design; rapidly adapt formulation, ingredients, raw materials, and packaging to align with sustainability goals; and build a regenerative business by facilitating product reuse and recycling.",
        bullets: [
          "Collaborative product design for faster time to market",
          "Adaptive product development and recipe formulation",
          "Feedback-inspired innovation and product experiences",
          "Improved product safety and compliance",
          "Insight into the environmental impact and zero-waste commitments",
        ],
      },
      {
        title: "Goods Manufacturing",
        image: "worker-4395772_1280-768x512.jpg",
        body: "Run smart, agile, and autonomous CPG manufacturing processes that can dynamically adapt to trends and changing demand and help you deliver personalized products at scale, reduce waste, and carbon emissions, and tightly orchestrate manufacturing with supply networks and design.",
        bullets: [
          "Smart manufacturing execution and Industry 4.0 capabilities",
          "Full visibility across supply, production, inventory, and demand",
          "Reduced environment, health, and safety (EHS) risks",
          "Predictive asset analytics and preventive maintenance",
          "Sustainable manufacturing and reduced resource consumption",
        ],
      },
      {
        title: "CPG Supply Chain",
        image: "depositphotos_86834594-stock-photo-businessman-writing-supply-chain-and.webp",
        body: "Maximize CPG supply chain visibility and agility to ensure that the products consumers want are always available and collaborate with partners in real-time to mitigate disruption, shore up resilience, and deliver seamless B2B, B2C, and B2B2C order fulfilment.",
        bullets: [
          "Integrated supply chain planning and execution",
          "Smart warehouse and transportation management",
          "Open, collaborative supplier and logistics networks",
          "End-to-end supply chain transparency and track and trace",
          "Reduced carbon footprint and improved supply chain sustainability",
        ],
      },
      {
        title: "Marketing, Sales, and Consumer Experience",
        image: "istockphoto-1287247972-170667a.jpg",
        body: "Unify consumer insights from all touchpoints to hyper-personalized engagement and deliver exceptional experiences on all channels – for all brands and markets – while improving e-commerce and extending transactions into social, video, and streaming services.",
        bullets: [
          "360-degree customer view and real-time CPG analytics",
          "Omnichannel commerce and customer service",
          "Intelligent micro-segmentation and seamless consumer journeys",
          "CPG marketing performance and spend management",
          "Value-added services and subscription billing management",
        ],
      },
    ],
    customers: ["aachi_logo.png", "mrbectors.png", "rjcorp.png", "vahdam.png", "varun.png"],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    sourceUrl: "https://in2itebs.com/manufacturing/",
    metaDescription: "Connect manufacturing planning, production, quality and maintenance data to improve operations.",
    image: "industrial-worker-working-production-line-factory-scaled.jpg",
    intro: [
      "We help makers of durable and non-durable products harness technology to adapt their operations for new markets, roll out new collaboration platforms, and refine their production and engineering management systems.",
      "We provide assistance to companies that manufacture raw materials, helping them increase their plant efficiencies, better coordinate their supply chains, and more effectively manage the demands of global trade and environmental compliance.",
    ],
    sections: [],
    customers: ["eastpipes-2.png", "etg-2.png", "grohe-2.png", "karam-2.png", "welspun-daretocommit-2.png"],
  },
  {
    slug: "textiles",
    name: "Textiles",
    sourceUrl: "https://in2itebs.com/textiles-2/",
    metaDescription: "Connect material planning, production, quality, inventory and finance in textile operations.",
    image: "pexels-pixabay-236748-1024x615.jpg",
    intro: [
      "Textile and apparel businesses can connect material planning, production, quality, inventory, sales, finance and purchasing in one operating model.",
    ],
    sectionsHeading: "Solutions we provide",
    sections: [
      {
        title: "Comprehensive end to end Planning",
        bullets: [
          "Material Requirement Planning",
          "Master Production Scheduling",
          "Production Process Definition",
          "Plan production resources finitely beyond classic MRP functionality",
          "Consider capacity and material availability constraints in your planning model",
          "Integrate manufacturing master data, such as routings and bills of materials, to define the basis for production planning data structure",
        ],
      },
      {
        title: "Production & Configuration",
        bullets: [
          "Bill Of Material",
          "Engineering Change Request",
          "Engineering Change Note",
          "Streamline scheduling processes throughout global production environments",
          "Use an industry scheduling repository for block, campaign, shelf-life, and model-mix planning",
          "Perform detailed scheduling with a setup matrix, sequence constraints, minimum and maximum distances, and alternative modes",
        ],
      },
      {
        title: "Quality Management",
        bullets: ["Process Quality Check", "Finish Goods Quality Check", "Material Inward Quality Check"],
      },
      {
        title: "Dashboard and Alerts",
        bullets: ["Department-wise Dashboard", "Business Intelligence Tool", "Document Management System"],
      },
      {
        title: "Inventory Management",
        bullets: [
          "Inventory Planning",
          "Warehouse Management",
          "Bin Management",
          "Instant access to the warehouse keeps item details up to date saving time on the stock monitoring.",
        ],
      },
      {
        title: "CRM & Order Processing",
        bullets: [
          "Lead Management",
          "Opportunity Management",
          "Order Management",
          "Consumption of raw materials to its stipulated production is observed so that estimation of completion time occurs easily.",
        ],
      },
      {
        title: "Finance Management",
        bullets: ["Compliance with Sch VI & IFRS", "Automatic TDS & Tax Calculation", "Multi- Dimensional Reporting"],
      },
      {
        title: "Purchase Management",
        bullets: ["Supplier Evaluation", "Request for Quote", "Quote Comparison"],
      },
    ],
    customers: [
      "eastpipes-1.png",
      "etg-1.png",
      "grohe-1.png",
      "hafele-1.png",
      "himatsingka-1.png",
      "karam-1.png",
      "lixil-1.png",
      "synaptics-2.png",
      "vardhman-1.png",
      "welspun-daretocommit-1.png",
      "Welspun-group-1.png",
    ],
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    title: "Professional Services",
    sourceUrl: "https://in2itebs.com/professional-services-2/",
    metaDescription:
      "Manage projects, resources, billing and finance with connected systems for professional services firms.",
    image: "istockphoto-841180016-170667a.jpg",
    intro: [
      "Run Projects More Profitably with Professional Services Solutions Firms are rethinking business models to drive growth and engage the best talent. In2IT EBS provides SAP solution that enables firms to drive new growth, deliver digital services, engage the best talent, and become intelligent enterprises through our deep industry process expertise, next-gen best practices, and integration across the industry value chain.",
    ],
    sectionsHeading: "Solutions we provide",
    sections: [
      {
        title: "Project and Managed Services Business",
        offerings: [
          {
            label: "Billing and Revenue Innovation Management",
            body: "Monetize digital transformation through high-volume, subscription billing and revenue management.",
          },
          {
            label: "Service-Centric Billing and Accounting",
            body: "Accurate and timely billing solutions built around projects and services.",
          },
          {
            label: "Customer Project Management",
            body: "Integrated processes for selling and delivering projects and engagements to customers. Deliver results efficiently to satisfy the expectations of your clients.",
          },
          {
            label: "Travel-to-Reimburse",
            body: "Engage in travel and expense management to simplify billing, enhance the employee experience, and increase control of margin and compliance.",
          },
          {
            label: "Field Service Management",
            body: "Support customer and field service from every angle with optimized workforce scheduling and mobile apps",
          },
          {
            label: "Customer Experience Management",
            body: "Manage your customers' experience across the entire engagement cycle.",
          },
        ],
      },
      {
        title: "Total Talent Management",
        offerings: [
          {
            label: "Core Human Resources and Service Delivery",
            body: "Simplify core HR and service delivery processes to deliver efficiency, help ensure global compliance, and improve everyday work life.",
          },
          {
            label: "External Workforce Management",
            body: "Streamline how you find, source, and manage flexible workers with external workforce management.",
          },
          {
            label: "Payroll and Time and Attendance Management",
            body: "Optimise payroll and time and attendance management processes to ensure the workforce is paid accurately and on time.",
          },
          {
            label: "Talent Acquisition",
            body: "Secure the world's best talent by using embedded engagement and automation throughout the hiring process.",
          },
          {
            label: "Talent Management and Learning",
            body: "Simplify talent management to engage, develop, and retain the right talent.",
          },
          {
            label: "Workforce Planning and Analytics",
            body: "Improve your ability to lead your workforce, accelerate change, and drive results with powerful, personalized people analytics.",
          },
          {
            label: "Employee Experience Management",
            body: "Manage your employees' experience across all phases of an engagement.",
          },
        ],
      },
      {
        title: "Business Development and Sales",
        offerings: [
          {
            label: "Commerce Personalisation",
            body: "Deliver relevant and impactful commerce experiences with real-time personalization.",
          },
          {
            label: "Consent-Based Marketing",
            body: "Deliver the experiences that customers expect by recognizing them during engagements and ensuring consent-based marketing practices.",
          },
          {
            label: "Omnichannel Commerce Management",
            body: "Drive your business and win with an industry-leading omnichannel commerce platform.",
          },
          {
            label: "Optimised Marketing",
            body: "Gain visibility and control of the entire closed-loop marketing process. Make data-driven decisions to increase the marketing ROI.",
          },
          {
            label: "Sales Force Automation",
            body: "Enable your sales teams to act faster and sell more effectively with sales force automation.",
          },
          {
            label: "Sales Performance Management",
            body: "Turn strategy into action with solid sales performance management to boost revenue and exceed quotas.",
          },
          {
            label: "Single Customer View",
            body: "Gain insight from a single view of your customers and deliver personalized experiences across the entire customer journey.",
          },
          {
            label: "Digital Services Monetization",
            body: "Meet the needs of the outcome-focused consumer with an agile billing solution designed to monetize any consumption model.",
          },
        ],
      },
      {
        title: "Core Finance",
        offerings: [
          {
            label: "Record-to-Report",
            body: "Gain greater financial insight and control through a faster, compliant financial close with less cost and effort.",
          },
          { label: "Invoice-to-Pay", body: "Automated and integrated payables management processes." },
          {
            label: "Treasury Management",
            body: "Greater insight and control over complex processes for managing cash, liquidity, and risk.",
          },
          {
            label: "Financial Planning and Analysis",
            body: "Management of financial performance to control costs and execute organizational strategies.",
          },
          {
            label: "Real Estate Management",
            body: "Remove operational barriers across the full real-estate management lifecycle.",
          },
          {
            label: "Travel-to-Reimburse",
            body: "Engage in travel and expense management to simplify billing, enhance the employee experience, and increase control of margin and compliance.",
          },
          {
            label: "Invoice-to-Cash",
            body: "Automated, integrated, and collaborative receivable management processes.",
          },
          {
            label: "Governance, Risk, and Compliance",
            body: "Reap the rewards of effective enterprise, risk, and compliance management with improved transparency and less effort and expense.",
          },
        ],
      },
    ],
    customers: [
      "accionlab-1.png",
      "aurigo-1.png",
      "bookmyshow-1.png",
      "chargebee-1.png",
      "evoke-technologies-1.png",
      "greyorange-1.png",
      "infogix-1.png",
      "iris-1.png",
      "ivalue-1.png",
      "medianet-1.png",
      "mxplayer-1.png",
      "redington-1.png",
      "sharechat-1.png",
      "sify-1.png",
      "smartcube-1.png",
      "tredence-1.png",
      "avaya-2.png",
      "niit-2.png",
    ],
  },
  {
    slug: "heavy-engineering",
    name: "Heavy Engineering",
    sourceUrl: "https://in2itebs.com/heavy-engineering-2/",
    metaDescription:
      "Support complex engineering and industrial manufacturing with connected planning and delivery systems.",
    image: "close-up-hand-holding-smartphone-scaled.jpg",
    intro: [
      "Deliver individualized, sustainable, and smart machinery and components – at scale and as a service – with heavy engineering and industrial manufacturing solutions. Heavy Engineering and Industrial manufacturers are facing the biggest challenge to date: profitable sustainability. Not only do you need to reduce emissions in your own operations and supply chains – but you also need to provide products and services that help your customers do the same.",
    ],
    sectionsHeading: "Services we offer",
    sections: [
      {
        title: "Digital Product Innovation",
        bullets: [
          "Integrated product design and development",
          "Real-time insights for risk detection and decision-making",
          "Collaboration and change management",
          "Product safety and regulatory compliance",
          "Manufacturing PLM processes",
        ],
      },
      {
        title: "Manufacturing Marketing & Sales",
        image:
          "businessman-holding-tablet-touching-icon-digital-marketing-global-network-conncetion-analyzing-business-sales-data-172987702.jpg",
        bullets: [
          "Targeted industrial B2B marketing",
          "Sales force automation and real-time insights",
          "One e-commerce platform for all go-to-market models",
          "Dynamic configuration and pricing for complex solutions",
          "High-volume subscription billing and revenue management",
        ],
      },
      {
        title: "Manufacturing Supply Chain",
        image:
          "supply-chain-businessman-hologram-concept-supply-chain-businessman-hologram-concept-futuristic-177137895.jpg",
        bullets: [
          "Synchronised planning for demand, inventory, and operations",
          "Streamlined transportation management and vehicle insights",
          "Collaborative logistics and supplier networks",
          "Advanced warehouse automation",
          "Tools to reduce emissions and help ensure compliance",
        ],
      },
      {
        title: "Smart Manufacturing",
        image: "istockphoto-1171902434-170667a.jpg",
        bullets: [
          "Embedded Industry 4.0 technologies and intelligence",
          "Continuous collaboration between engineering and manufacturing",
          "Smart manufacturing integration, monitoring, and control",
          "Plant and asset performance management",
          "Environment, health, safety, and risk management",
        ],
      },
      {
        title: "Servitization and After Market",
        image: "finance-economics-work-male-discussion-laptop-scaled.jpg",
        bullets: [
          "Service management with detailed financial analysis",
          "Digital twin technology for customer assets",
          "Omnichannel customer service and support",
          "Field service optimisation for first-time resolution",
          "Service parts planning, sales, and execution",
        ],
      },
    ],
    customers: [
      "arjas-steel-1.png",
      "jindal-steel-1.png",
      "jsw-2.png",
      "pmc-1.png",
      "rmg-1.png",
      "vedanta-1.png",
      "welspun-steel-1.png",
    ],
  },
  {
    slug: "retail-ecommerce",
    name: "Retail & Ecommerce",
    sourceUrl: "https://in2itebs.com/retail-ecommerce-2/",
    metaDescription:
      "Connect merchandising, supply chain, commerce and store operations with practical digital systems.",
    image: "pexels-nataliya-vaitkevich-6214478-600x540.jpg",
    intro: [
      "Combining top-notch business expertise with state-of-the-art technology, we create practical solutions to complex challenges in supply chain management, merchandising, eCommerce and store management.",
      "Equipped with extensive industry, technology and delivery capabilities, we work with you to provide solutions and services that address strategic and operational challenges, optimize business performance, align technology with business priorities, reduce cost, improve margins and constantly sharpen competitive advantage. We have invested in a rich set of solution offerings, assets and accelerators to increase ROI and decrease the time-to-value of your business and IT programs.",
    ],
    sections: [],
    customers: ["bata.png", "rasasi.png", "relaxo.png", "rp-apparels.png", "welspun-flooring.png"],
  },
  {
    slug: "energy-and-utilities",
    name: "Energy and Utilities",
    sourceUrl: "https://in2itebs.com/energy-and-utilities/",
    metaDescription:
      "Support energy and utilities operations with connected planning, assets, field work and customer processes.",
    intro: [
      "In times of economic crises, winning companies are those that are quick to innovate business processes, advance new business models, and create differentiating outcomes for their customers. Intelligent enterprises that cope best with uncertainty will come out on top in the next normal. The RISE with SAP offering is a stepping stone on the journey to the Intelligent Enterprise. In2IT EBS offering SAP S/4HANA, the Intelligent ERP in the cloud, delivers unprecedented automation around best-practice and next-practice business process standards that give you the flexibility to optimize and transform your business",
      "Energy and utility organisations focus on seven operational and technology priorities:",
    ],
    sectionsHeading: "What are the strategic priorities in your industry?",
    sections: [
      {
        title: "Drive Operational Excellence",
        body: "Create cost-efficient, compliant, and safe power generation with smart asset operations and maintenance enabling a fully digital allocation of spare parts, work, and logistics services",
      },
      {
        title: "Support Regulatory Compliance and Security",
        body: "Enable timely and accurate support of regulatory compliance through embedded market communication processes while optimizing capital expenditure (CAPEX) and operating expenditure (OPEX) projects and securing revenue",
      },
      {
        title: "Explore New Revenue Streams",
        body: "Sell new services and create energy communities by developing traditional customers into prosumers and increase project profitability through increased customer focus and increased insight and control",
      },
      {
        title: "Build Customer Intimacy",
        body: "Enable utilities to provide holistic customer service by reducing time to market to build new energy offers, send one invoice to customers and leveraging partner network to increase revenue",
      },
      {
        title: "Digitalize Production and Delivery",
        body: "Quickly react and adapt your supply chain to changing market conditions in real-time; enable automation and touchless transactions",
      },
      {
        title: "Compete as an Ecosystem",
        body: "Eliminate siloed operations and deliver end-to-end visibility for your employees, business partners, and customers.",
      },
      {
        title: "Unlock Value with Technology",
        body: "Make data a strategic asset and fast-track innovation; gain real-time operational insights and data transparency for improved project and operations effectiveness, safety, and profitability",
      },
    ],
    customers: ["jindal-steelpower.png", "jsw-1.png"],
  },
  {
    slug: "chemical-fertilizers",
    name: "Chemical & Fertilizers",
    sourceUrl: "https://in2itebs.com/chemical-fertilizers-2/",
    metaDescription: "Connect chemical production, supply chain, compliance and asset data with enterprise systems.",
    intro: [
      "Chemical and fertiliser businesses coordinate production, quality, safety, procurement and distribution while responding to changing demand and regulation.",
      "In2IT EBS supports these operations with enterprise planning, integration and application services that connect plant data with business workflows.",
      "Four priorities shape this work:",
    ],
    sectionsHeading: "What are the strategic priorities in your industry?",
    sections: [
      {
        title: "Sell Business Outcomes Instead of Just Products",
        body: "Collaborate with customers and suppliers, become part of their value chains, and leverage digital technologies to deliver innovative services involving business outcomes",
      },
      {
        title: "Simplify to Shrink Cycle Times",
        body: "Run simulations & predictive models to enable real-time sense & response, and reduce time to market, streamline operations, and maximize asset performance",
      },
      {
        title: "Compete as an Ecosystem",
        body: "Capitalize on open co-innovation and leverage extended manufacturing networks, and redesign networks and relationships in line with market dynamics",
      },
      {
        title: "Adopt Strategic Agility in Response to Market Dynamics",
        body: "Adjust your strategy and portfolio dynamically in response to market opportunities & needs, grow into new markets or segments, and capitalize on M&A and spin-offs",
      },
    ],
    customers: [
      "deepak-fertiliser-1.png",
      "gulbrandsen-1.png",
      "haldia-1.png",
      "jaikisaan-1.png",
      "mcf-1.png",
      "mcpi-1.png",
      "paradep-phosphet-1.png",
      "valvoline-1.png",
      "veedol-1.png",
    ],
  },
  {
    slug: "banking",
    name: "Banking, Financial Services & Insurance",
    sourceUrl: "https://in2itebs.com/banking/",
    metaDescription:
      "Support financial services operations with application engineering, integration, risk and reporting.",
    image: "business-office-sence-scaled.jpg",
    intro: [
      "In2IT EBS focuses on Application Development, Maintenance and Support, Product practices around BFSI and is involved in implementation support, customizations, Product Consulting, Interfaces development and Testing.",
      "Banking, Financial Services and insurance (BFSI) is one of the strategic verticals of In2IT EBS.",
      "We help financial services firms develop business solutions that drive efficiency, effectiveness, innovation and virtualization. In2IT EBS with its deep industry expertise help manage risk, comply with regulations, enhance product features and manage your business transformation challenges",
    ],
    sections: [],
    customers: [
      "anarock-1.png",
      "brickworkindia-1.png",
      "groww-1.png",
      "narayanseva-santhan-1.png",
      "ncdex-1.png",
      "power2sme-1.png",
      "trilegal-1.png",
    ],
  },
  {
    slug: "government",
    name: "Government & Public Enterprises",
    sourceUrl: "https://in2itebs.com/government/",
    metaDescription: "Build and support public-sector systems for services, workflows, data and operational reporting.",
    image: "public-sector-tablet-device-wooden-table-text-83121136.jpg",
    intro: [
      'In2IT EBS\'s Government solutions unit partners with governments, public sector entities and semi-government agencies to offer IT-based governance solutions that work for all stakeholders. Our digital governance solutions promote efficiency, transparency and policy effectiveness, enabling "smart governance" in areas that matter most to citizens and consumers.',
    ],
    sectionsHeading: "In2IT EBS help clients identify and realize goals in the following ways",
    sections: [
      {
        title: "Domain Experience",
        body: "We have extensive global experience in developing comprehensive solutions across governments and public-sector entities. Through our technology and industry verticals, we have vast expertise across a number of technologies and sectors around the world. Our initiatives have helped governments globally to offer anytime, anywhere services to their citizens, improve delivery efficiency, save costs, reduce wastage and expand their revenue base.",
      },
      {
        title: "Smart blend of management and technology expertise",
        body: "Our experience of working with governments across the world gives us an ability to build value-added solutions with a perfect blend of management and the technological know-how. We follow a comprehensive end-to-end approach to deliver a project within the shortest possible time frame.",
      },
      {
        title: "Ready-to-Use Assets",
        body: "Our ready-to-use assets and frameworks ensure that our solutions yield customer benefits such as reduced total cost of ownerships, accelerated implementation cycles and reduced business risks",
      },
    ],
    customers: [
      "ap-transco-1.png",
      "bhel-1.png",
      "bsnl-1.png",
      "cochin-shipyard-1.png",
      "nalco-1.png",
      "niamt-1.png",
      "ntpc-1.png",
      "ocac-1.png",
      "omc-1.png",
      "skill-development-institute-bbsr-1.png",
      "state-transport-authority-od-1.png",
    ],
  },
  {
    slug: "healthcare-life-science",
    name: "Pharma, Healthcare & Life Science",
    title: "Healthcare & Life Science",
    sourceUrl: "https://in2itebs.com/healthcare-life-science-2/",
    metaDescription:
      "Connect healthcare workflows, applications and data across providers, life sciences and medical devices.",
    image: "istockphoto-637785818-170667a.jpg",
    intro: [
      "In2IT EBS Healthcare Practice offers innovative and end-to-end integrated solutions for healthcare providers. Our solutions enhance the efficiency of physicians, hospitals, ancillary facilities, clinics, governmental health bodies, and public health and research organizations.",
      "Our Healthcare and Life Sciences (HLS) Practice helps leading pharmaceutical & medical devices companies, healthcare providers and payer organizations achieve measurable results by addressing their unique business challenges.",
      "In2IT EBS enables healthcare organizations to create more efficient, effective, innovative and virtualized business models. We arm your enterprise with the strategic thinking to effectively respond no matter what directions the healthcare industry's evolution takes. Our deep industry expertise and experience across the healthcare ecosystem enables healthcare organizations to successfully address challenges and seize opportunities by improving processes, creating efficiencies and unlocking innovation.",
    ],
    sections: [],
    customers: [
      "acg-1.png",
      "aknamed-1.png",
      "clinisupplies-1.png",
      "humainhealth-1.png",
      "image-removebg-preview-2022-08-19T124432.706-1.png",
      "manipalhospital-1.png",
      "rachempharma-1.png",
      "sentiss-1.png",
      "stjohn-1.png",
      "synaptics-3.png",
      "unichem-1.png",
    ],
  },
  {
    slug: "telecom",
    name: "Media & Telecommunications",
    sourceUrl: "https://in2itebs.com/telecom/",
    metaDescription:
      "We partner with leading telecom companies and help them create next-generation telecom solutions that offer cost advantage and reduced time-to-market.",
    image: "tower-820001_1920-1024x683.jpg",
    intro: [
      "We partner with leading telecom companies and help them create next-generation telecom solutions that offer cost advantage and reduced time-to-market. We have successfully executed large engagements and offer customers the flexibility in consulting, systems integration or solution rollout using various sourcing models.",
    ],
    sectionsHeading: "Solutions We Offer",
    sections: [
      {
        title: "Solutions We Offer",
        body: "In2IT EBS supports telecommunications organisations through consulting, systems integration and solution rollout services.",
      },
    ],
    customers: ["bookmyshow.png", "medianet.png", "mxplayer.png"],
  },
  {
    slug: "engineering-constructions-ecno",
    name: "Engineering & Constructions (ECNO)",
    sourceUrl: "https://in2itebs.com/engineering-constructions-ecno-2/",
    metaDescription:
      "Support engineering and construction projects with connected planning, procurement, delivery and asset data.",
    image: "pexels-engin-akyurt-4170184-1024x683.jpg",
    intro: [
      "In times of economic crises, winning companies are those that are quick to innovate business processes, advance new business models, and create differentiating outcomes for their customers. Intelligent enterprises that cope best with uncertainty will come out on top in the next normal. The RISE with SAP offering is a stepping stone on the journey to the Intelligent Enterprise. In2IT EBS offering SAP S/4HANA, the Intelligent ERP in the cloud, delivers unprecedented automation around best-practice and next-practice business process standards that give you the flexibility to optimize and transform your business",
    ],
    sections: [
      {
        title: "Pre-Construction",
        image: "pexels-jeshootscom-834892-1024x683.jpg",
        offerings: [
          { label: "Opportunity and Proposal Management", body: "Boost business development for growth." },
          {
            label: "Pre-Manufacturing Operations",
            body: "Identify and prioritize critical material issues, and maximize enterprise-wide visibility across supply, production, inventory, and demand.",
          },
          {
            label: "Source and Contract",
            body: "Reduce risk and cost through increased savings opportunities, sourcing efficiency, and contract and supplier compliance.",
          },
          { label: "Virtual Design and Construction", body: "Get better collaboration step-by-step." },
        ],
      },
      {
        title: "Construction Supply Chain",
        image: "020520080553.jpg",
        offerings: [
          {
            label: "Track and Trace and Logistics Networks",
            body: "Maximise supply chain logistics strategy and comply with regulations with digital operations networks.",
          },
          {
            label: "Warehouse Management",
            body: "Improve warehouse management with optimized planning and automated processes.",
          },
          {
            label: "Transportation Management",
            body: "Reduce costs and improve service with streamlined transportation management processes.",
          },
          {
            label: "Response and Supply Planning",
            body: "Create and maintain supply plans aligned with business goals as demand and supply change.",
          },
        ],
      },
      {
        title: "Project Delivery",
        image: "istockphoto-1343888857-612x612-1.jpg",
        offerings: [
          {
            label: "Contract and Invoice Management",
            body: "Manage risk through contract automation and collaboration.",
          },
          {
            label: "Mobile Safety, Quality, and Productivity Enablement",
            body: "Go mobile with near real-time visibility.",
          },
          {
            label: "Buy and Deliver Goods and Services",
            body: "Improve operational efficiency and source determination for direct and indirect materials.",
          },
          { label: "Project Management and Collaboration", body: "Empower project managers for success." },
        ],
      },
      {
        title: "Asset Management",
        image: "asset-management-word-cloud-business-concept-57283472.jpg",
        offerings: [
          {
            label: "Asset Maintenance and Facility Operations",
            body: "Retain or restore assets for optimal performance of required functions.",
          },
          { label: "Intelligent Buildings", body: "Manage key building services." },
          {
            label: "Real Estate",
            body: "Remove operational barriers across the full real-estate management lifecycle.",
          },
        ],
      },
    ],
    customers: [
      "kolte-patil-1.png",
      "luthra-1.png",
      "pavai-1.png",
      "towervision-1.png",
      "welspun-infrastructure-1.png",
      "wework-1.png",
    ],
  },
];

export function getLegacyIndustry(slug: string) {
  return legacyIndustries.find((industry) => industry.slug === slug);
}
