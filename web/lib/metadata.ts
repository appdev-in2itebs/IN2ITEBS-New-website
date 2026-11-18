import type { Metadata } from "next";
import { SITE_URL } from "./utils";
const BRAND = "In2IT EBS";

/** Distinct search titles for parallel legacy pages until the approved page merges are complete. */
const seoTitleOverrides: Record<string, string> = {
  "/services/other-enterprise-solutions/": "Other Enterprise Services",
  "/services/sap-enterprise-solutions/": "SAP Consulting and Implementation",
  "/services/sap-grow-fast/": "Fixed Start Cloud ERP Services",
  "/partners/sap-concur/": "SAP Concur Technology Overview",
  "/partners/oracle/": "Oracle Technology Overview",
  "/partners/microsoft/": "Microsoft Technology Overview",
  "/industries/banking/": "Banking and Insurance Services",
  "/industries/telecom/": "Telecommunications Industry Services",
  "/insights/revolutionizing-hr-with-sap-successfactors-a-strategic-approach-to-modern-hcm-solutions/":
    "SAP SuccessFactors Rollout Sequencing",
  "/insights/igniting-organizational-potential-sap-successfactors-ai-innovations-revealed-at-sap-successconnect-las-vegas/":
    "SAP SuccessFactors AI: What Is Live Today",
  "/insights/how-rise-with-sap-s-4hana-cloud-can-transform-your-business/":
    "What RISE with SAP Changes, and What It Does Not",
  "/insights/grow-with-sap/": "GROW with SAP: What It Commits To",
};

export function pageMetadata(path: string, input: Metadata): Metadata {
  const canonical = new URL(path, SITE_URL).toString();
  const metadataInput = seoTitleOverrides[path] ? { ...input, title: seoTitleOverrides[path] } : input;
  const absolute =
    typeof metadataInput.title === "object" && metadataInput.title !== null && "absolute" in metadataInput.title
      ? String(metadataInput.title.absolute)
      : null;
  const plain = typeof metadataInput.title === "string" ? metadataInput.title : null;
  const socialTitle = absolute ?? (plain ? `${plain} · ${BRAND}` : BRAND);
  const description =
    metadataInput.description ?? "Enterprise platforms, advisory and digital engineering from In2IT EBS.";
  return {
    ...metadataInput,
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: BRAND,
      title: socialTitle,
      description,
      url: canonical,
      images: [{ url: "/opengraph-image/", width: 1200, height: 630, alt: "In2IT EBS: enterprise transformation" }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@in2itebs_",
      title: socialTitle,
      description,
      images: ["/opengraph-image/"],
    },
  };
}
