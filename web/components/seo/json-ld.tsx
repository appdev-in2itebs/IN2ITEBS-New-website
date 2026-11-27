import { social, site, footerCertifications, legalEntities, regions, headquarters } from "@/content/site";
import { capabilities } from "@/content/capability-status";
import { getCms } from "@/lib/cms/content";
import { SITE_URL } from "@/lib/utils";
import { breadcrumbItems, isKnownPage, safeJsonLd } from "@/lib/json-ld";
import { capabilityJsonLd } from "@/lib/capability-feed";
import { faqsFor, type Faq } from "@/content/faqs";

function Script({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }} />;
}

/**
 * Organization + WebSite, rendered once from the root layout.
 *
 * ── WHY THIS CARRIES MORE THAN A NAME AND A LOGO ─────────────────────────────────────────────
 * "In2IT" does not identify one company. In2IT Technologies is a separate South African group,
 * and the Enverics work puts a third name against the same organisation. A reader that cannot
 * tell which company it is holding will either blend two firms' facts together or decline to say
 * anything specific about either — and for an assistant assembling a buyer's long-list, the
 * second failure costs as much as the first.
 *
 * The fields below are the ones that resolve an entity rather than describe it: a government
 * registration number, the incorporation year, the subsidiaries, the credentials. Every one is
 * already published in prose elsewhere on this site and read from `content/site.ts`, so this
 * component makes nothing new true. It makes what is already true machine-readable.
 *
 * ── WHAT IS DELIBERATELY NOT HERE ────────────────────────────────────────────────────────────
 * `parentOrganization`. The holding structure is real and is published nowhere on this site, and
 * markup is not the place to disclose what the pages do not. That is the Managing Director's
 * call, not a field to fill because schema.org offers it.
 *
 * `issuedBy` on the two ISO certifications. ISO does not issue certificates; an accredited
 * registrar does, and `content/site.ts` does not record which. The house rule is that a
 * credential names the body that granted it — so rather than guess at a registrar, those two
 * publish without an issuer until Compliance supplies them. The same rule, applied to markup.
 */
export async function OrganizationJsonLd() {
  const { offices } = await getCms();
  const headOffice = offices.find((o) => o.slug === "bangalore");
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: site.name,
        legalName: site.legalName,
        url: SITE_URL,
        logo: `${SITE_URL}/brand/in2it-ebs-mark-512.png`,
        description: site.description,
        sameAs: [social.linkedin, social.x, social.youtube, social.instagram],
        telephone: headOffice?.phone,
        // The strongest disambiguator available: one registered company, one number, verifiable
        // against the MCA register by anybody who doubts it. The footer already shows it.
        identifier: {
          "@type": "PropertyValue",
          propertyID: "CIN",
          value: site.cin,
          description: "Corporate Identity Number, Ministry of Corporate Affairs, India",
        },
        // Encoded in the CIN on the line above (…KA2016PTC…): incorporated in Karnataka in 2016.
        // A reading of a number we already publish, not a separate claim.
        foundingDate: "2016",
        foundingLocation: { "@type": "Place", name: `${headquarters.city}, ${headquarters.country}` },
        // "500+ people" is the gated figure in content/site.ts, provable from payroll. Stated as
        // a minimum because that is what the site says, rather than rounded into false precision.
        numberOfEmployees: { "@type": "QuantitativeValue", minValue: 500 },
        subOrganization: legalEntities.map((entity) => ({
          "@type": "Organization",
          name: entity.name,
          address: { "@type": "PostalAddress", addressCountry: entity.country },
        })),
        hasCertification: footerCertifications.map((name) => ({
          "@type": "Certification",
          name,
          ...(name === "SAP Gold Partner" ? { issuedBy: { "@type": "Organization", name: "SAP SE" } } : {}),
        })),
        // Read from the capability register, so a line that loses its status loses its mention
        // here in the same commit. The register is the only place depth is allowed to be decided,
        // and this must never assert more than the table does.
        knowsAbout: capabilities.filter((c) => c.status === "delivered").map((c) => c.capability),
        areaServed: regions.map((region) => ({ "@type": "Country", name: region.name })),
        address: offices
          .filter((o) => o.address)
          .map((o) => ({
            "@type": "PostalAddress",
            streetAddress: o.address,
            addressLocality: o.city,
            addressCountry: o.country,
          })),
        contactPoint: { "@type": "ContactPoint", email: site.primaryEmail, contactType: "customer support" },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: site.name,
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
  return <Script data={data} />;
}

/** BreadcrumbList for an inner page; `name` overrides the label of the final crumb. */
export function BreadcrumbJsonLd({ path, name }: { path: string; name?: string }) {
  const items = breadcrumbItems(path, name, isKnownPage);
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, position) => ({
      "@type": "ListItem",
      position: position + 1,
      name: item.name,
      item: item.item,
    })),
  };
  return <Script data={data} />;
}

/**
 * The capability register as structured data, on /about/where-we-stand/.
 *
 * Built from the same serialiser as /api/capabilities so the markup and the endpoint cannot drift
 * apart — see lib/capability-feed.ts.
 */
export function CapabilityJsonLd() {
  return <Script data={capabilityJsonLd()} />;
}

/**
 * FAQPage for a route that has entries in content/faqs.ts.
 *
 * ── WHY THIS EXISTS, AND WHY IT ADDS NO CLAIMS ───────────────────────────────────────────────
 * The headings on this site are statements: "What we have done, what we are building, and what
 * we cannot do." That reads well and matches nothing anybody types. A retrieval system pulls
 * passages, and it pulls them best when the passage is shaped like the question it answers.
 *
 * So the answers are not new. Every one is lifted from copy already shipped on the page it sits
 * on, and `tests/metadata.test.ts` checks that each answer still appears in the page it claims
 * to come from. An FAQ that drifts from its page is two different answers to one question, which
 * is worse than having neither.
 *
 * Renders nothing visible. The question-form headings on the pages themselves do the work for
 * human readers; this is the same content for a reader that cannot see headings.
 */
export function FaqJsonLd({ route }: { route: string }) {
  const faqs: Faq[] = faqsFor(route);
  if (!faqs.length) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
  return <Script data={data} />;
}

/** Article schema for an insight. */
export function ArticleJsonLd({
  slug,
  title,
  date,
  excerpt,
  author,
}: {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    ...(date ? { datePublished: date } : {}),
    author: author ? { "@type": "Person", name: author } : { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: `${SITE_URL}/insights/${slug}/`,
  };
  return <Script data={data} />;
}
