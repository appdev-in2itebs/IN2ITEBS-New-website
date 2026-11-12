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

export const awardsTitle = "Awards & memberships";

export const awardsIntro = "Recognition and memberships published from the records currently available to In2IT EBS.";

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
  "Certification versions and validity dates are under formal review. Only memberships that can be stated without an unverified standard version are shown below.";

export const accreditations: Accreditation[] = [
  {
    slug: "stpi",
    name: "STPI Accreditation:",
    logo: "/awards/stpi.jpg",
    body: [
      "In2IT EBS is registered with Software Technology Parks of India (STPI) as an export-oriented unit (EOU).",
      "As a member of STPI, we have a public commitment towards software quality standards, process capability and improvements in productivity.",
    ],
  },
  {
    slug: "nasscom",
    name: "Member of NASSCOM:",
    logo: "/awards/nasscom.jpg",
    body: [
      "In2IT EBS records NASSCOM membership. The membership status will remain subject to the organisation’s formal verification process.",
    ],
  },
];
