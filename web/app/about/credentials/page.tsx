import { Explainer } from "@/components/explainers/explainer";
import { EXPLAINERS } from "@/content/explainers";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { heroPicture } from "@/components/sections/hero-override";
import { HeroFigure } from "@/components/sections/hero-figure";
import { V2Hero, V2StickyNav, V2Overview, V2Section, V2Closing } from "@/components/sections/v2";
import {
  stats,
  footerCertifications,
  deliveryCentres,
  internationalOffices,
  legalEntities,
  headquarters,
} from "@/content/site";
import { awards, qualityStatement } from "@/content/awards";

export const metadata = pageMetadata("/about/credentials/", {
  title: "Credentials",
  description:
    "SAP Gold Partner, CMMI Level 3 appraised, ISO 9001 and ISO/IEC 27001 certified — each credential with the body that granted it.",
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

/**
 * The awards shown here are the ones with a certificate photograph on file, read from
 * content/awards.ts so that this page and the awards data can never drift apart.
 *
 * Five further awards appear in the practice decks and have NO certificate on file: the SAP Asia
 * Pacific Japan Award for Partner Excellence (Capacity Building, 2023), SAP Mid-Market Partner of
 * the Year (2021 and 2023), SAP HXM Champions (Mid-Market, 2022), SAP HXM Partner of the Year
 * (year unknown) and the DivHERsity Award (Top 20 Companies, SMEs). They are deliberately not
 * published. A page whose first rule is "every claim names the body that granted it" cannot carry
 * an award it cannot date. Alliances produces the certificates, they move into content/awards.ts,
 * and they appear here automatically.
 */

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
    body: "CMMI Level 3 appraised, ISO 9001 and ISO/IEC 27001 certified processes, secured delivery centres and vetted consultants.",
  },
];

export default function CredentialsPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/about/credentials/" name="Credentials" />
      <FaqJsonLd route="/about/credentials/" />
      <V2Hero
        route="/about/credentials/"
        path={[{ label: "About", href: "/about/" }, { label: "Credentials" }]}
        title="What we have been assessed on. By people who are not us."
        lead="A credential is only worth the independence of whoever issued it. Below are the partnerships, appraisals and awards we hold, each with the body that granted it and the year. We have left off everything we could not attribute that way."
        media={heroPicture(
          "/hero/about-credentials.webp",
          <HeroFigure figureKey="about/credentials" />,
          "Credentials, compliance and audit — In2IT EBS",
        )}
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
          `Four staffed delivery centres — ${deliveryCentres.join(", ")}, all in India — and five legal entities, in ${legalEntities.map((e) => e.country).join(", ")}.`,
          `We also hold offices in ${internationalOffices.join(", ")}. They are offices, not delivery centres, and this page will not count them as one.`,
          "A delivery centre is somewhere staffed that you can visit. That distinction is the reason this page says four and not eight, and it is the same number our submitted bids carry.",
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

      <Explainer spec={EXPLAINERS["p2-where-we-are"]} tone="subtle" />
      <V2Section id="sap" eyebrow="Our SAP relationship" heading="Three designations, not one" tone="subtle">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-card border border-border-subtle bg-surface p-7">
            <h3 className="font-display text-h3 text-foreground">What we hold</h3>
            <ul className="mt-4 space-y-2 text-foreground-muted">
              <li>SAP Gold Partner</li>
              <li>RISE with SAP Partnership (BTaaS)</li>
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
                <li key={award.slug} className="text-foreground">
                  {award.name}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-foreground-muted">
              <Link
                href="/about/credentials/awards/"
                className="inline-block min-h-6 font-semibold text-action underline-offset-4 hover:underline"
              >
                The certificate for each
              </Link>{" "}
              is on its own page. We publish the photograph rather than the name, because a name is a claim and a
              certificate is evidence.
            </p>
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
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-card border border-border-subtle bg-surface p-7">
            <h3 className="font-display text-h3 text-foreground">CMMI Level 3</h3>
            <p className="mt-3 text-foreground-muted">
              An external appraisal of how we actually run delivery — defined processes, applied consistently, measured.
              It is not a certificate you buy.
            </p>
          </div>
          <div className="rounded-card border border-border-subtle bg-surface p-7">
            <h3 className="font-display text-h3 text-foreground">ISO 9001</h3>
            <p className="mt-3 text-foreground-muted">
              Certified for quality management. We name the standard without an edition year on purpose: the edition and
              validity dates come from the certificate, and we would rather print nothing than print a year that has
              since been withdrawn.
            </p>
          </div>
          <div className="rounded-card border border-border-subtle bg-surface p-7">
            <h3 className="font-display text-h3 text-foreground">ISO/IEC 27001</h3>
            <p className="mt-3 text-foreground-muted">
              Certified for information security management. Both appraisals are re-assessed on a cycle rather than
              granted once, and we will give you the current certificate on request.
            </p>
          </div>
        </div>
        <p className="mt-6 max-w-measure text-sm text-foreground-muted">
          Current credential strip: {footerCertifications.join(" · ")}.
        </p>
        <p className="mt-3 max-w-measure text-sm text-foreground-muted">{qualityStatement}</p>
        <p className="mt-6 max-w-measure text-sm text-foreground-muted">
          The certificates and the accreditation marks behind all of this are on{" "}
          <Link
            href="/about/credentials/awards/"
            className="inline-block min-h-6 font-semibold text-action underline-offset-4 hover:underline"
          >
            awards and certificates
          </Link>
          .
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
            <span className="text-foreground">We do not claim an SAP PCE partnership.</span> It appeared in the footer
            credential strip and on this page until 12 November 2026, when it was withdrawn: the designation could not
            be produced in SAP&rsquo;s own wording with a date. It returns if and when Alliances can.
          </p>
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

      <V2Section
        id="stand"
        eyebrow="The rest of the picture"
        heading="And where we stand on everything else"
        tone="subtle"
      >
        <div className="max-w-measure space-y-5 text-foreground-muted">
          <p>
            Credentials say what a third party has assessed. They do not say what we can actually build, which varies by
            area and is a separate question with a separate page.
          </p>
          <p>
            <Link
              href="/about/where-we-stand/"
              className="inline-block min-h-6 font-semibold text-action underline-offset-4 hover:underline"
            >
              Where we stand
            </Link>{" "}
            lists every capability with one of four statuses — delivered, with a partner, building, or ahead of us —
            including the ones where the honest status is that we do not do it.
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
