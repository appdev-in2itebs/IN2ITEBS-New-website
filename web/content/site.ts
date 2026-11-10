import type { Region, Stat } from "./types";

/** Headline figures — Deck 2 (Corporate Capability, May 2026) via the Features Plan; SOT-02 of the first deck says 350+ employees. Owner to confirm one source (audit M7). */
export const stats: Stat[] = [
  { value: "10+", label: "Years of experience" },
  { value: "150+", label: "Global customers" },
  { value: "30+", label: "Countries delivered" },
  { value: "14+", label: "Industry verticals" },
  { value: "12+", label: "Packaged accelerators" },
  { value: "12+", label: "Strategic partners" },
  { value: "10+", label: "Proprietary accelerators" },
];

export const footerCertifications = ["ISO 9001", "ISO/IEC 27001", "SAP Gold Partner"];

/** Bump when site copy changes; feeds sitemap lastModified for pages without their own date. */
export const contentUpdated = "2026-11-10";

export const regions: Region[] = [
  { code: "IN", name: "India", email: "info@in2itebs.com" },
  { code: "KE", name: "Kenya", email: "info@in2itebs.co.ke" },
  { code: "ZA", name: "South Africa", email: "info@in2itebs.co.za" },
  { code: "ME", name: "Middle East", email: "info@in2itebs.ae" },
];

export const social = {
  linkedin: "https://www.linkedin.com/company/in2itebs/",
  x: "https://twitter.com/in2itebs_",
  youtube: "https://www.youtube.com/channel/UCdUFIRwrZMoq4oUvPt3KuPQ",
  instagram: "https://www.instagram.com/in2itebs/",
};

export const site = {
  name: "In2IT EBS",
  legalName: "In2IT Enterprise Business Services Private Limited",
  cin: "U72900KA2016PTC147788",
  tagline: "Converged Intelligence",
  description:
    "10+ years of enterprise transformation, delivered globally. SAP Gold Partner with adjacent strength across Salesforce, Workday, Oracle, Microsoft, cloud and application services.",
  primaryEmail: "info@in2itebs.com",
  copyrightYear: 2026,
  primaryCta: { label: "Start a conversation", href: "/contact/" },
};
