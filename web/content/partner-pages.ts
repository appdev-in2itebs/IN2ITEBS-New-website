/**
 * The ten partner pages the existing site's Partners menu lists, with that site's own copy
 * (scraped/partners, May 2026). Only the theme is this site's.
 */
export interface PartnerPage {
  slug: string;
  /** Menu label, exactly as the existing site's menu prints it. */
  name: string;
  /** The heading the existing page uses, where it differs from the menu label. */
  title?: string;
  intro: string[];
  sections?: { title: string; body?: string; bullets?: string[] }[];
  metaDescription: string;
  /** The partner's mark as the existing page shows it, under /public/partners. */
  logo?: string;
  sourceUrl: string;
}

export const partnerPages: PartnerPage[] = [
  {
    slug: "sap",
    name: "SAP",
    title: "About SAP",
    sourceUrl: "https://in2itebs.com/sap/",
    metaDescription:
      "SAP is the world leader in enterprise applications in terms of software and software-related service revenue, with a customer base of 3,45,000+ spread across 180+ countries.",
    logo: "/partners/sap.jpg",
    intro: [
      "SAP is the world leader in enterprise applications in terms of software and software-related service revenue. Based on market capitalization, SAP is the world's third largest independent software manufacturer. With a customer base of 3,45,000+ spread across 180+ countries and close to 84,000+ employees operating out of 130+ countries, SAP is the undisputed leader in the ERP solution space. A strong eco system of 15,000+ partners and 110 million cloud user base backed up by 100+ Innovation centres, SAP generates revenues of about Euro 22 billion and is currently the market leader in the Enterprise Application Services segment.",
    ],
  },
  {
    slug: "sap-qualtrics",
    name: "SAP Qualtrics",
    logo: "/partners/sap-qualtrics.jpg",
    sourceUrl: "https://in2itebs.com/sap-qualtrics/",
    metaDescription:
      "With Experience Management solutions from SAP, you can reduce unwanted attrition, retain and develop top performers, drive employee engagement and increase productivity.",
    intro: [
      "With Experience Management solutions from SAP, you can reduce unwanted attrition, retain, and develop top performers, drive employee engagement, and increase the productivity of your workforce. The SAP® Qualtrics® Employee Engagement solution helps you understand the key drivers of employee engagement and enables managers and leaders throughout the organization to improve the employee experience.",
    ],
  },
  {
    slug: "sap-concur",
    name: "SAP Concur",
    logo: "/partners/sap-concur.png",
    sourceUrl: "https://in2itebs.com/sap-concur/",
    metaDescription:
      "SAP Concur is committed to reinventing travel, expense and invoice management with tools that simplify everyday processes and create better experiences.",
    intro: [
      "SAP Concur is committed to reinventing travel, expense, and invoice management with tools that simplify everyday processes and create better experiences. Using SAP Concur, you can solve big problems, small problems, and problems you didn't even know you had. SAP Concur turns difficult into simple, makes the unknown known, and puts an end to tedious tasks. And relentless in the pursuit of what's possible as well as continuously developing new ways to automate and integrate processes that use emerging technology. As part of the larger SAP family, and through our experience, expertise, and partnerships, Concur solutions help every business run it's very best.",
    ],
  },
  {
    slug: "microsoft",
    name: "Microsoft",
    logo: "/partners/microsoft.jpg",
    sourceUrl: "https://in2itebs.com/microsoft-2/",
    metaDescription:
      "Microsoft is the world's leading producer of computer software and develops, licenses and supports a range of software products, services and devices.",
    intro: [
      "Microsoft is the world's leading producer of computer software and develops, licenses, and supports a range of software products, services and devices. The Company's segments include Productivity and Business Processes, Intelligent Cloud and More Personal Computing. The Company's products include operating systems; cross-device productivity applications; server applications; business solution applications; desktop and server management tools; software development tools; video games, and training and certification of computer system integrators and developers.",
    ],
  },
  {
    slug: "oracle",
    name: "Oracle",
    sourceUrl: "https://in2itebs.com/oracle-2/",
    metaDescription:
      "Oracle enterprise applications and industry solutions, middleware and database: a complete choice of cloud deployment options and a secure path to the latest technology.",
    logo: "/partners/oracle.jpg",
    intro: [
      "Customers worldwide rely on Oracle's enterprise and industry applications. Oracle Applications provide a complete choice of cloud deployment options, as well as a secure path for customers to benefit from the latest technology advances.",
    ],
    sections: [
      {
        title: "Enterprise Applications and Industry Solutions",
        body: "Customers worldwide rely on Oracle's enterprise and industry applications. Oracle Applications provide a complete choice of cloud deployment options, as well as a secure path for customers to benefit from the latest technology advances.",
      },
      {
        title: "Middleware",
        body: "Oracle's middleware layer provides the software infrastructure for building, deploying, and scaling enterprise and Web applications.",
      },
      {
        title: "Database",
        body: "The database layer of the Oracle stack provides the grid infrastructure architecture that enables workload consolidation, higher scalability, and accelerated performance.",
      },
    ],
  },
  {
    slug: "open-text",
    name: "Open Text",
    title: "OpenText",
    logo: "/partners/open-text.jpg",
    sourceUrl: "https://in2itebs.com/open-text-2/",
    metaDescription:
      "OpenText can help you tackle the most complex digital transformation programs with confidence, with the world's most complete and integrated Information Management platform.",
    intro: [
      "OpenText can help you tackle the most complex digital transformation programs with confidence. With the world's most complete and integrated Information Management platform, Opentext empower its customers to organize, integrate and protect data and content as it flows through business processes inside and outside their organization.",
    ],
  },
  {
    slug: "ibm",
    name: "IBM",
    logo: "/partners/ibm.jpg",
    sourceUrl: "https://in2itebs.com/ibm/",
    metaDescription:
      "IBM's comprehensive, unified portfolio of business analytics software provides a host of capabilities that help your organization achieve its objectives.",
    intro: [
      "IBM's comprehensive, unified portfolio of business analytics software (Cognos, SPSS, OpenPages, Algorithmics and Varicent) provides a host of capabilities that help your organization achieve your objectives and exceed expectations. Based on open standards, IBM business analytics products can be used independently, in combination with each other, and as part of broader solutions to key business challenges.",
    ],
  },
  {
    slug: "newgen",
    name: "Newgen",
    logo: "/partners/newgen.jpg",
    sourceUrl: "https://in2itebs.com/newgen-2/",
    metaDescription:
      "Newgen is the leading provider of a unified digital transformation platform with native process automation, content services and communication management capabilities.",
    intro: [
      "Newgen is the leading provider of a unified digital transformation platform with native process automation, content services, and communication management capabilities. Globally, successful enterprises rely on Newgen's industry-recognized low code application platform to develop and deploy complex, content-driven, and customer-engaging business applications on the cloud. From onboarding to service requests, lending to underwriting, and for many more use cases across industries. Newgen unlocks simple with speed and agility.",
    ],
  },
  {
    slug: "hp",
    name: "HP",
    logo: "/partners/hp.png",
    sourceUrl: "https://in2itebs.com/hp-2/",
    metaDescription:
      "HP Inc. creates technology that makes life better for everyone everywhere, through a portfolio of printers, PCs, mobile devices, solutions and services.",
    intro: [
      "HP Inc. creates technology that makes life better for everyone everywhere — every person, every organization, and every community around the globe. Through their portfolio of printers, PCs, mobile devices, solutions, and services, we engineer experiences that amaze.",
    ],
  },
  {
    slug: "aws",
    name: "AWS",
    title: "Amazon Web Services",
    logo: "/partners/aws.png",
    sourceUrl: "https://in2itebs.com/aws-2/",
    metaDescription:
      "Amazon Web Services (AWS) is the world's most comprehensive and broadly adopted cloud platform, offering over 200 fully-featured services from data centers globally.",
    intro: [
      "Amazon Web Services (AWS) is the world's most comprehensive and broadly adopted cloud platform, offering over 200 fully-featured services from data centers globally. Millions of customers including the fastest-growing start-ups, largest enterprises, and leading government agencies—are using AWS to lower costs, become more agile, and innovate faster.",
    ],
  },
];

export function getPartnerPage(slug: string) {
  return partnerPages.find((page) => page.slug === slug);
}
