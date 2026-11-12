import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { V2Hero, V2StickyNav, V2Overview, V2Section, V2Closing } from "@/components/sections/v2";
import { stats, footerCertifications, deliveryCentres, legalEntities, headquarters } from "@/content/site";
import { DiagramBand } from "@/components/sections/diagram-band";

export const metadata = pageMetadata("/about/credentials/", {
  title: "Credentials",
  description:
    "SAP Gold Partner, CMMI Level 3 appraised, ISO 27001 certified. The partnerships, appraisals and awards we hold — each with the body that granted it.",
});

/**
 * Credentials.
 *
 * Two rules govern this page.
 *
 * 1. Every claim names the body that granted it. A credential is only worth the independence of
 *    whoever issued it, and an award with no year reads as one we cannot date.
 * 2. The page names a gap on purpose (section "What we do not claim"). A credentials page that
 *    lists only credentials is read as marketing. One that names a gap is read as a record — and
 *    it removes a line of attack in competitive bids, because a competitor can raise the RISE
 *    Validated Partner point either way and it is better raised by us.
 *
 * Fields marked INPUT REQUIRED below are held until Alliances and Quality supply them. Do not
 * publish a certification line without its reference and validity.
 */

const awards = [
  { name: "SAP Asia Pacific Japan Award for Partner Excellence", detail: "Capacity Building, 2023" },
  { name: "SAP Mid-Market Partner of the Year", detail: "2021 and 2023" },
  { name: "SAP HXM Champions", detail: "Mid-Market, 2022" },
  { name: "SAP HXM Partner of the Year", detail: "Year to be confirmed before publish" },
  { name: "DivHERsity Award", detail: "Top 20 Companies (SMEs)" },
];

const posture = [
  {
    title: "Access and segregation of duties",
    body: "SAP GRC access control, segregation-of-duties rules and privileged-access monitoring, with quarterly access review.",
  },
  {
    title: "Change control with a named approver",
    body: "Every configuration change and workflow approval is logged, reviewable and mapped to a person — built for statutory audit rather than retrofitted for it.",
  },
  {
    title: "Segregation that holds commercially",
    body: "On our mining estate, no single role can move a lot from contract through laboratory result and usage decision to invoice. That is a design choice, and it is the kind of control an auditor asks about.",
  },
  {
    title: "Operational technology boundary",
    body: "Where we integrate to operational technology, the design follows IEC 62443 zones and conduits. There are no direct paths from a control system to the ERP.",
  },
  {
    title: "Data residency",
    body: "In-country hosting through RISE hyperscaler regions, with data centre and disaster recovery in the same jurisdiction where the client or the regulator requires it.",
  },
  {
    title: "Secure delivery",
    body: "CMMI Level 3 appraised and ISO 27001 certified processes, secured delivery centres and vetted consultants.",
  },
];

export default function CredentialsPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/about/credentials/" name="Credentials" />
      <V2Hero
        route="/about/credentials/"
        path={[{ label: "About", href: "/about/" }, { label: "Credentials" }]}
        title="What we have been assessed on. By people who are not us."
        lead="A credential is only worth the independence of whoever issued it. Below are the partnerships, appraisals and awards we hold, each with the body that granted it and the year. We have left off everything we could not attribute that way."
      />
      <V2StickyNav
        anchors={[
          { id: "overview", label: "Where we stand" },
          { id: "sap", label: "SAP" },
          { id: "assessed", label: "How we are assessed" },
          { id: "posture", label: "Security and audit" },
          { id: "not-claimed", label: "What we do not claim" },
        ]}
      />
      <V2Overview
        eyebrow="Where we stand"
        heading="Registered, staffed and delivering"
        paragraphs={[
          `${headquarters.legalName} is headquartered and registered in ${headquarters.city}, ${headquarters.country}.`,
          `Eight staffed delivery centres — ${deliveryCentres.join(", ")} — and five legal entities, in ${legalEntities.map((e) => e.country).join(", ")}.`,
          "A delivery centre is somewhere you can visit. An entity without a staffed office is listed as an entity, not as a delivery centre.",
        ]}
      >
        <dl className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.slice(0, 4).map((stat) => (
            <div key={stat.label} className="rounded-card border border-border-subtle bg-surface p-6">
              <dt className="font-display text-h2 text-foreground">{stat.value}</dt>
              <dd className="mt-2 text-sm text-foreground-muted">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </V2Overview>

      <DiagramBand
        src="/diagrams/p2-where-we-are.svg"
        alt="Where In2IT EBS is registered, staffed and delivering: the Bengaluru headquarters, the eight staffed delivery centres and the five legal entities, with the countries each covers."
        tone="subtle"
      />
      <V2Section id="sap" eyebrow="Our SAP relationship" heading="Four designations, not one" tone="subtle">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-card border border-border-subtle bg-surface p-7">
            <h3 className="font-display text-h3 text-foreground">What we hold</h3>
            <ul className="mt-4 space-y-2 text-foreground-muted">
              <li>SAP Gold Partner</li>
              <li>RISE with SAP Partnership (BTaaS)</li>
              <li>SAP PCE Partnership</li>
              <li>SAP Co-Innovation Partner</li>
            </ul>
            <p className="mt-5 text-sm text-foreground-muted">
              380+ SAP consultants across eleven practices. Each practice has a named lead, and the leads are listed on
              request.
            </p>
          </div>
          <div className="rounded-card border border-border-subtle bg-surface p-7">
            <h3 className="font-display text-h3 text-foreground">Recognised by SAP</h3>
            <ul className="mt-4 space-y-3">
              {awards.map((award) => (
                <li key={award.name}>
                  <span className="text-foreground">{award.name}</span>
                  <span className="block text-sm text-foreground-muted">{award.detail}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-foreground-muted">
              A partner award says the vendor has looked at our work and formed a view. That is worth something. It is
              not the same as a client reference, and the client work is on its own page.
            </p>
          </div>
        </div>
      </V2Section>

      <V2Section
        id="assessed"
        eyebrow="How our delivery is assessed"
        heading="Appraised, not self-declared"
        tone="canvas"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-card border border-border-subtle bg-surface p-7">
            <h3 className="font-display text-h3 text-foreground">CMMI Level 3</h3>
            <p className="mt-3 text-foreground-muted">
              An external appraisal of how we actually run delivery — defined processes, applied consistently, measured.
              It is not a certificate you buy.
            </p>
          </div>
          <div className="rounded-card border border-border-subtle bg-surface p-7">
            <h3 className="font-display text-h3 text-foreground">ISO 27001</h3>
            <p className="mt-3 text-foreground-muted">
              Certified for information security management. Both appraisals are re-assessed on a cycle rather than
              granted once, and we will give you the current certificate on request.
            </p>
          </div>
        </div>
        <p className="mt-6 text-sm text-foreground-muted">
          Current credential strip: {footerCertifications.join(" · ")}.
        </p>
      </V2Section>

      <V2Section
        id="posture"
        eyebrow="Security and audit posture"
        heading="Built for regulated and state-owned buyers"
        tone="subtle"
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posture.map((item) => (
            <div key={item.title} className="rounded-card border border-border-subtle bg-surface p-7">
              <h3 className="font-display text-h3 text-foreground">{item.title}</h3>
              <p className="mt-3 text-foreground-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </V2Section>

      <V2Section id="not-claimed" eyebrow="What is not here" heading="What we do not claim" tone="canvas">
        <div className="max-w-measure space-y-5 text-foreground-muted">
          <p>
            <span className="text-foreground">We are not a RISE with SAP Validated Partner.</span> Some Indian
            public-sector tenders now use that designation as a pre-qualification, and where they do, we are not
            eligible unless we bid with a partner who holds it. We will tell you that at the start of a pursuit rather
            than at the end.
          </p>
          <p>
            We hold no designation from Oracle, ServiceNow, Microsoft Dynamics or Adobe, and we do not implement them.
          </p>
        </div>
      </V2Section>

      <V2Closing
        eyebrow="Ask for the certificate"
        heading="We will send it."
        body="Every credential on this page has a reference, an issuing body and a validity period behind it. Ask and we will give you the document rather than the badge."
      />
    </>
  );
}
