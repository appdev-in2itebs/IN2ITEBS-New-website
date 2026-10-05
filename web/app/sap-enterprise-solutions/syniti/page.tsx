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

export const metadata = pageMetadata("/sap-enterprise-solutions/syniti/", {
  title: "Syniti Data Management",
  description:
    "Data-first SAP migration with Syniti — profile, cleanse, construct, migrate and govern, so your S/4HANA transformation lands on data you can trust.",
});

/** The five-stage Syniti approach — Blueprint §8.9. */
const stages = [
  {
    stage: "Profile",
    note: "Understand the true state of source data before a single record moves.",
  },
  {
    stage: "Cleanse",
    note: "Correct, de-duplicate and enrich data at source, not after cutover.",
  },
  {
    stage: "Construct",
    note: "Build, map and validate the target structures S/4HANA expects.",
  },
  {
    stage: "Migrate",
    note: "Load with full reconciliation and a complete, auditable trail.",
  },
  {
    stage: "Govern",
    note: "Keep data clean after go-live with embedded ongoing controls.",
  },
];

/** Service areas — Blueprint §8.9. */
const serviceAreas = [
  {
    title: "Data Migration",
    body: "SAP Advanced Data Migration by Syniti — a proven, repeatable engine for moving complex enterprise data into S/4HANA.",
    bullets: [
      "ECC-to-S/4HANA migration",
      "Source-to-target mapping",
      "Reconciliation and validation",
      "Auditable, repeatable runs",
    ],
  },
  {
    title: "Data Quality & MDG",
    body: "Trusted master data, governed at source — built on SAP Master Data Governance and continuous quality rules.",
    bullets: [
      "Profiling and cleansing",
      "De-duplication and matching",
      "SAP MDG implementation",
      "Quality rules and scorecards",
    ],
  },
  {
    title: "Information Governance",
    body: "Policies, ownership and stewardship that keep data fit for purpose long after the project closes.",
    bullets: [
      "Data ownership and stewardship",
      "Governance operating model",
      "Lifecycle and retention controls",
      "Ongoing quality monitoring",
    ],
  },
];

export default function SynitiPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/sap-enterprise-solutions/syniti/" />
      <PageHero
        route="/sap-enterprise-solutions/syniti/"
        eyebrow="SAP Enterprise Solutions · Syniti Data Management"
        headline="70% of SAP transformations slip because of data, not"
        accentWord="technology."
        subhead="We run SAP migration data-first with Syniti — profiling, cleansing and governing the data your S/4HANA programme depends on, so the move lands on records you can trust."
        media={<HeroObject name="pages/sap-syniti-data" />}
        frame={false}
      />

      {/* FIVE-STAGE APPROACH */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="How we work"
              lead="One disciplined path from source to S/4HANA — each stage closed out before the next begins, so data quality is engineered in rather than chased after."
            >
              A five-stage <Accent>approach</Accent>.
            </SectionHeading>
          </Reveal>
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {stages.map((s, i) => (
              <StaggerItem key={s.stage} className="h-full">
                <div className="glass-card flex h-full flex-col gap-2 rounded-surface p-6">
                  <span className="text-h3 font-bold text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span className="label-caps text-gold">{s.stage}</span>
                  <p className="text-[0.9rem] leading-relaxed text-foreground-muted">{s.note}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* SERVICE AREAS */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Service areas"
              lead="Three connected disciplines — moving the data, raising its quality and keeping it that way — delivered as one engagement rather than separate efforts."
            >
              Migration you can <Accent>trust</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={serviceAreas} columns={3} />
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
              Data that <Accent>holds</Accent>.
            </h2>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-3">
            {[
              { value: "20+", label: "ECC-to-S/4 migrations delivered" },
              { value: "99.5%", label: "Data integrity at cutover" },
              { value: "3x", label: "Faster than manual ETL" },
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
        eyebrow="Syniti Data Management"
        heading={
          <>
            Assess your SAP data <Accent>readiness.</Accent>
          </>
        }
        body="Tell us where your S/4HANA programme stands today. We'll profile the data, surface the risks and map a Syniti-led path to a clean, governed cutover."
      />
    </>
  );
}
