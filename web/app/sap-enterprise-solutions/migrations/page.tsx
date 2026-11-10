import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Eyebrow, Accent, SectionHeading } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { HeroObject } from "@/components/sections/hero-media";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata = pageMetadata("/sap-enterprise-solutions/migrations/", {
  title: "SAP Migrations",
  description:
    "ECC to S/4HANA, on-premise to cloud, brownfield to selective transition — a risk-managed decision chosen by complexity, risk and timeline, not convenience.",
});

/** The three migration approaches — Blueprint §8.2. */
const approaches = [
  {
    title: "Greenfield",
    body: "A fresh implementation for a clean break.",
    bullets: [
      "Re-engineer processes to standard",
      "Post-merger consolidation",
      "Shed accumulated technical debt",
      "Highest change, cleanest target",
    ],
  },
  {
    title: "Brownfield",
    body: "Convert existing ECC in place.",
    bullets: [
      "Retain history and integrations",
      "Lowest business disruption",
      "Preserve proven configuration",
      "Fastest route for stable cores",
    ],
  },
  {
    title: "Selective Data Transition",
    body: "A fresh core with selected data carried across.",
    bullets: [
      "Choose data, customisations and company codes",
      "Designed for carve-outs",
      "Consolidate multiple landscapes",
      "Balance of clean slate and continuity",
    ],
  },
];

/** How we de-risk the migration — Blueprint §8.2. */
const deRisk = [
  {
    title: "Mock loads",
    body: "We run the migration repeatedly against full-volume copies before it ever touches production, so behaviour, performance and edge cases are known in advance.",
  },
  {
    title: "Reconciliation",
    body: "Every load is reconciled field-by-field and balance-by-balance against the source, so finance, audit and the business can sign off on what moved.",
  },
  {
    title: "Cutover rehearsal",
    body: "The cutover is rehearsed end-to-end on a timed runbook — including fallback — so go-live weekend is execution, not discovery.",
  },
];

export default function MigrationsPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/sap-enterprise-solutions/migrations/" />
      <PageHero
        route="/sap-enterprise-solutions/migrations/"
        eyebrow="SAP Enterprise Solutions · Migrations"
        headline="ECC to S/4HANA, on-premise to cloud —"
        accentWord="a managed decision."
        subhead="Greenfield, brownfield or selective data transition is a risk-managed decision — chosen by complexity, risk profile, regulatory constraints and timeline, never by convenience. We pick the approach your landscape demands, then prove it before go-live."
        media={<HeroObject name="pages/sap-migrations" />}
        frame={false}
      />

      {/* THREE APPROACHES */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Three approaches"
              lead="There is no single right way to reach S/4HANA. We match the route to your reality — and the trade-offs are deliberate, not accidental."
            >
              Three ways to <Accent>move</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={approaches} columns={3} bezel />
        </Container>
      </Section>

      {/* HOW WE DE-RISK IT */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="How we de-risk it"
              lead="A migration is only as good as its data and its cutover. We take the risk out of both, well before go-live weekend."
            >
              Proven before it goes <Accent>live</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={deRisk} columns={3} />
          <Reveal delay={0.1} className="mt-8 max-w-2xl">
            <p className="text-[0.95rem] leading-relaxed text-foreground-muted">
              Migration accuracy is a data-management discipline, not an afterthought. Where the data is complex, we
              bring in Syniti to profile, cleanse and reconcile it ahead of every load.
            </p>
            <Link
              href="/sap-enterprise-solutions/syniti/"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-action hover:text-foreground"
            >
              Explore Syniti data management <ArrowUpRight size={16} strokeWidth={1.5} />
            </Link>
          </Reveal>
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
              Moved without <Accent>surprises</Accent>.
            </h2>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-3">
            {[
              { value: "Reconciled", label: "Data validated against agreed controls" },
              { value: "Rehearsed", label: "Mock-load and cutover cycles planned by programme" },
              { value: "Governed", label: "Cutover decisions use documented acceptance gates" },
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
        eyebrow="Migrations"
        heading={
          <>
            Plan your <Accent>migration</Accent> approach.
          </>
        }
        body="Tell us where you are today — ECC, on-premise or a tangle of acquired landscapes. We'll recommend greenfield, brownfield or selective transition on the evidence, and prove it before go-live."
        ctaLabel="Plan your migration approach"
      />
    </>
  );
}
