import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui/container";
import { Eyebrow, Accent, SectionHeading } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { HeroObject } from "@/components/sections/hero-media";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata = pageMetadata("/sap-enterprise-solutions/abap-factory/", {
  title: "ABAP Factory",
  description:
    "An offshore ABAP service-centre model for predictable throughput — RICEFW objects scoped, built and delivered to a sprint cadence.",
});

/** The RICEFW model — Blueprint §8.11. */
const ricefw = [
  {
    title: "Reports",
    body: "Operational and analytical reports built beyond SAP standard, tuned to how your teams actually work.",
  },
  {
    title: "Interfaces",
    body: "Inbound and outbound integrations that keep SAP in step with the wider landscape.",
  },
  {
    title: "Conversions",
    body: "Data migration and load programs that move clean, reconciled records into SAP.",
  },
  {
    title: "Enhancements",
    body: "Targeted extensions to standard behaviour, delivered without disturbing the core.",
  },
  {
    title: "Forms",
    body: "Print and output forms that carry your brand and meet your compliance obligations.",
  },
  {
    title: "Workflow",
    body: "Approval and routing flows tied to the business events that should trigger them.",
  },
];

/** Capability examples — Blueprint §8.11. */
const capabilities = [
  {
    title: "Custom reporting",
    body: "Reports built beyond SAP standard — from operational worklists to board-level analytics.",
  },
  {
    title: "Integration",
    body: "IDoc, ALE, XML and REST/SOAP APIs — connecting SAP to the systems around it.",
  },
  {
    title: "Migration tooling",
    body: "BAPI, LSMW and BDC migration tooling for accurate, repeatable data loads.",
  },
  {
    title: "Enhancements",
    body: "BAdI and user exits that extend standard behaviour cleanly and upgrade-safely.",
  },
  {
    title: "Forms & output",
    body: "ABAP Script, Smart Forms and Adobe Forms for every document your business issues.",
  },
  {
    title: "Workflow",
    body: "Approval workflows tied to business events, so decisions route to the right people at the right time.",
  },
];

export default function AbapFactoryPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/sap-enterprise-solutions/abap-factory/" />
      <PageHero
        route="/sap-enterprise-solutions/abap-factory/"
        eyebrow="SAP Enterprise Solutions · ABAP Factory"
        headline="ABAP delivery, on a"
        accentWord="cadence."
        subhead="An offshore service-centre model for predictable throughput — RICEFW objects scoped, built and delivered sprint after sprint, so custom development becomes a steady stream rather than a scramble."
        media={<HeroObject name="pages/sap-abap-factory" />}
        frame={false}
      />

      {/* RICEFW MODEL */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="The RICEFW model"
              lead="Every piece of custom SAP development falls into one of six categories. We organise the factory around them, so each object has a known pattern, a known effort and a known owner."
            >
              Six shapes of <Accent>custom</Accent> work.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={ricefw} columns={3} bezel />
        </Container>
      </Section>

      {/* CAPABILITY EXAMPLES */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Capability examples"
              lead="The factory spans the full RICEFW range — from reporting and integration through to migration, enhancement, forms and workflow."
            >
              What the factory <Accent>builds</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={capabilities} columns={3} />
        </Container>
      </Section>

      {/* PROOF BAND */}
      <Section tone="navy" className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07]">
          <div className="absolute -right-24 top-10 h-[30rem] w-[30rem] origin-center rotate-45 border-[64px] border-gold-on-brand" />
        </div>
        <Container>
          <Reveal className="mb-10 max-w-2xl">
            <Eyebrow onDark>Proof</Eyebrow>
            <h2 className="mt-5 text-h2 font-bold">
              Throughput, <Accent>proven</Accent>.
            </h2>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-3">
            {[
              { value: "5,000+", label: "RICEFW objects delivered" },
              { value: "30+", label: "Enterprise clients" },
              { value: "40", label: "Objects per sprint, on average" },
            ].map((s) => (
              <StaggerItem key={s.label} className="h-full">
                <Card tone="navy" bezel={false} className="h-full">
                  <div className="text-[2.5rem] font-bold leading-none text-gold-on-brand">{s.value}</div>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-brand-muted">{s.label}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <CtaSection
        eyebrow="ABAP Factory"
        heading={
          <>
            Industrialise your ABAP <Accent>delivery</Accent>.
          </>
        }
        body="Tell us about your backlog of custom development. We'll show you how an offshore RICEFW factory turns it into predictable, sprint-by-sprint throughput."
      />
    </>
  );
}
