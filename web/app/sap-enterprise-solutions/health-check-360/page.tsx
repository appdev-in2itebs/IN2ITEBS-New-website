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

export const metadata = pageMetadata("/sap-enterprise-solutions/health-check-360/", {
  title: "Health Check 360",
  description:
    "A proprietary AI diagnostic for SAP SuccessFactors — auditing configuration, adoption and AI readiness, then benchmarking you against your peers.",
});

/** The diagnostic — Blueprint §8.4. */
const diagnostic = [
  {
    title: "Configuration audit",
    body: "Machine-learning analysis of how your system is actually built.",
    bullets: [
      "ML audit of module configuration",
      "Role-based permissions review",
      "Business-rule logic analysis",
      "Customisation-to-standard mapping",
    ],
  },
  {
    title: "Anomaly detection",
    body: "Patterns in your data that point to risk and waste.",
    bullets: [
      "Anomaly detection across usage logs",
      "Audit-log review for risk signals",
      "Process-execution outliers surfaced",
      "Adoption gaps identified by module",
    ],
  },
  {
    title: "AI readiness scoring",
    body: "How prepared you are for the next wave of capability.",
    bullets: [
      "Joule readiness scoring",
      "Talent Intelligence readiness scoring",
      "Clean-core and data-quality checks",
      "Activation prerequisites mapped",
    ],
  },
];

/** Benchmark dimensions — Blueprint §8.4. */
const benchmarks = [
  {
    title: "Process maturity",
    body: "How your end-to-end processes compare with the standard achieved across 200+ peers.",
  },
  {
    title: "Adoption & NPS",
    body: "Active-user rates and employee sentiment, set against peers in your own industry.",
  },
  {
    title: "Time-to-value",
    body: "How quickly your configuration turns into measurable outcomes versus the benchmark.",
  },
  {
    title: "Customisation ratio",
    body: "Your customisation-to-standard ratio, weighed against peers running clean-core.",
  },
];

/** The quantified roadmap — Blueprint §8.4. */
const roadmap = [
  {
    title: "Prioritised backlog",
    body: "Every finding turned into action, ranked by value.",
    bullets: [
      "Backlog prioritised by impact",
      "Savings quantified in dollars",
      "FTE and hours saved per item",
      "Effort and dependency sequencing",
    ],
  },
  {
    title: "AI activation plan",
    body: "A clear path to the capability you are ready for.",
    bullets: [
      "Joule activation plan",
      "GenAI use-case shortlist",
      "Clean-core activation roadmap",
      "Sequenced, prerequisite-aware",
    ],
  },
  {
    title: "Impact scorecard",
    body: "The case for change, ready for the board.",
    bullets: [
      "Executive-ready impact scorecard",
      "Benchmark position at a glance",
      "Projected value by initiative",
      "A single page leadership can act on",
    ],
  },
];

export default function HealthCheck360Page() {
  return (
    <>
      <BreadcrumbJsonLd path="/sap-enterprise-solutions/health-check-360/" />
      <PageHero
        eyebrow="Signature Tool · Health Check 360"
        headline="Your SuccessFactors estate,"
        accentWord="diagnosed."
        subhead="A proprietary AI diagnostic for SAP SuccessFactors — auditing configuration and adoption, benchmarking you against your peers, scoring your AI readiness and returning a quantified roadmap."
        media={<HeroObject name="pages/sap-health-check-360" />}
        frame={false}
      />

      {/* THE DIAGNOSTIC */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="The diagnostic"
              lead="Health Check 360 reads your system the way an expert would — but at machine scale, across every module, role and rule at once."
            >
              An AI-led <Accent>audit</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={diagnostic} columns={3} bezel />
        </Container>
      </Section>

      {/* BENCHMARKED AGAINST PEERS */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Benchmarked against your peers"
              lead="Your score only means something in context. We benchmark you against 200+ peers across 12 industries, on the dimensions that decide value."
            >
              Measured against the <Accent>field</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={benchmarks} columns={4} />
        </Container>
      </Section>

      {/* THE QUANTIFIED ROADMAP */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Your quantified roadmap"
              lead="A diagnostic is only useful if it tells you what to do next. Health Check 360 ends with a costed, sequenced plan your leadership can sign off."
            >
              A roadmap with a <Accent>number</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={roadmap} columns={3} bezel />
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
              Outcomes we can <Accent>measure</Accent>.
            </h2>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-4">
            {[
              { value: "30-40%", label: "Reduction in customisation debt" },
              { value: "25%", label: "Lift in monthly active users" },
              { value: "2x", label: "Faster Joule & AI activation" },
              { value: "4-6 week", label: "Typical engagement" },
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
        eyebrow="Health Check 360"
        heading={
          <>
            See your SuccessFactors estate <Accent>clearly</Accent>.
          </>
        }
        body="Tell us where you suspect the gaps are. We'll run Health Check 360 across configuration, adoption and AI readiness, and hand you a quantified roadmap."
        ctaLabel="Request a Health Check 360 briefing"
      />
    </>
  );
}
