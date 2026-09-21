import type { Accreditation, Award } from "./types";

/**
 * Awards and accreditations — the existing site's /accreditation-awards/ page, copied 1:1 on
 * 2026-09-16 (the old URL already redirects here, to /about/).
 *
 * The five certificates are the photographs that page displays, in its order, titled with its own
 * wording; the files in /public/awards are those images re-encoded down from originals as large as
 * 11 MB. Every heading and paragraph below is verbatim from the page, including its trailing colons
 * and its own spelling of the standards ("ISO/ IEC 27000:2005", which is the 27001 family the badge
 * beside it names).
 *
 * All five accreditations carry a badge on that page. Three of them are filed under the generic
 * names accreditation-logo-2/3/4.jpg, which is easy to mistake for site chrome — they are in fact
 * the STPI, NASSCOM and ISO 9001 marks, and are stored here under what they actually show. The
 * "images.png" badge is likewise the ISO/IEC 20000-1:2005 mark.
 *
 * The page carries no CMMI section any more, so neither does this — the CMMI Level 3 note in
 * `scraped/about/accreditation-awards.md` is from an older revision.
 */

export const awardsTitle = "Accreditation";

export const awardsIntro =
  "We have big ambitions, and a growing sense of urgency to work with others and address world challenges no one can tackle alone.";

export const awards: Award[] = [
  {
    slug: "hxm-mid-market-partner-2021",
    name: "HXM Mid Market Partner 2021",
    image: "/awards/hxm-mid-market-partner-2021.jpg",
    width: 834,
    height: 1200,
  },
  {
    slug: "hxm-2021-champions-mid-market",
    name: "HXM 2021 Champions (Mid-Market)",
    image: "/awards/hxm-2021-champions-mid-market.jpg",
    width: 847,
    height: 1200,
  },
  {
    slug: "king-of-the-cluster",
    name: "King Of The Cluster",
    image: "/awards/king-of-the-cluster.jpg",
    width: 837,
    height: 1200,
  },
  {
    slug: "successfactors-core-drive-award-h1",
    name: "SAP SuccessFactors Core Drive Award H1",
    image: "/awards/successfactors-core-drive-award-h1.jpg",
    width: 839,
    height: 1200,
  },
  {
    slug: "sap-apj-capability-award",
    name: "SAP APJ Capability Award",
    image: "/awards/sap-apj-capability-award.jpg",
    width: 690,
    height: 1200,
  },
];

export const qualityStatement =
  "In2IT EBS is one of the few successful icons in the Indian software industry that is dedicated towards the continuous improvement of all its processes, so that consistent quality standard are always met. Recognized for our proven competency in implementing & deploying high-class business solutions, we have revolutionized our presence across the globe. At In2IT EBS, a strong “Total Quality Management” culture prevails, which enables us to offer solutions that exceed expectations at every level.";

export const accreditations: Accreditation[] = [
  {
    slug: "iso-20000-1",
    name: "ISO/ IEC 20000-1:2005 (Service Management)",
    logo: "/awards/iso-20000-1.png",
    body: [
      "ISO/ IEC 20000-1:2005 certification underlines the quality of In2IT EBS’ service management systems. This internationally recognized standard for Service Management has a strong focus on providing customers with a consistent service. In order to provide high level services, In2IT EBS adopted an integrated process approach so as to deliver services effectively and cost efficiently in order to meet the often-complex needs of its customers.",
      "We are thankful to all our clients who have supported and made us successful in achieving these certifications. We will continue to deliver the best in technology by upgrading our skills on an ongoing basis.",
    ],
  },
  {
    slug: "iso-9001",
    name: "ISO 9001:2008 (Quality Management)",
    logo: "/awards/iso-9001.jpg",
    body: [
      "Our Bhubaneswar, India based Delivery center and support functions are certified to this internationally recognised standard.",
      "This provides evidence of our commitment to the end-to-end delivery of customer service: from your very first contact with In2IT right through to the completion of service requests – and everything in between!",
    ],
  },
  {
    slug: "iso-27001",
    name: "ISO/ IEC 27000:2005 (Information Security)",
    logo: "/awards/iso-27001.png",
    body: [
      "We have reinforced our stringent data security management with the successful completion of the globally recognised ISO 27001 Information Security certification. It provides confidence that our data is held securely and that safety and confidentiality is at the forefront of our business.",
      "This standard provides a framework for managing a business’s security responsibilities and provides external assurance for customers as to the scope and scale of our secure environment via our Business Security Management System.",
    ],
  },
  {
    slug: "stpi",
    name: "STPI Accreditation:",
    logo: "/awards/stpi.jpg",
    body: [
      "In2IT EBS is registered with Software Technology Parks of India (STPI) as a 100% export-oriented unit (EOU). As a member of STPI, we are committed to exporting quality software worldwide. STPI membership helps us interface with the Indian government and leverage our natural advantages thereby allowing us to offer quality solutions to our clients at very competitive prices.",
      "As a member of STPI, we have a public commitment towards software quality standards, process capability and improvements in productivity.",
    ],
  },
  {
    slug: "nasscom",
    name: "Member of NASSCOM:",
    logo: "/awards/nasscom.jpg",
    body: [
      "NASSCOM is India’s National Association of Software and Service Companies, the premier trade body and the chamber of commerce of the IT software and services industry in India. Since December 2013 we have taken NASSCOM membership.",
    ],
  },
];
