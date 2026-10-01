import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui/container";
import { Accent, SectionHeading } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { HeroObject } from "@/components/sections/hero-media";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { RiseGrowChooser } from "@/components/interactive/rise-grow-chooser";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata = pageMetadata("/sap-enterprise-solutions/rise-vs-grow/", {
  title: "RISE vs GROW with SAP",
  description:
    "RISE and GROW are both valid paths to S/4HANA Cloud. We recommend based on your business profile — and prove it in a two-week Pathway Assessment.",
});

/** Decision rows — Blueprint §8.1 comparison section, exact attributes. */
const aspects = [
  "Edition",
  "Best fit",
  "Customisation",
  "Landscape & integration",
  "Release cadence",
  "Typical timeline",
  "Cost profile",
  "Operating model",
  "Our credential",
];

const riseValues = [
  "S/4HANA Private Cloud Edition",
  "Large enterprises",
  "Deep customisation supported",
  "Complex SAP / non-SAP landscape",
  "Annual, planned releases",
  "9–18 months typical",
  "Higher TCO, fewer constraints",
  "SAP-managed cloud, dedicated tenancy",
  "PCE Partner",
];

const growValues = [
  "S/4HANA Public Cloud Edition",
  "Mid-market and net-new units",
  "Limited, fit-to-standard",
  "Simpler integration",
  "Quarterly updates",
  "3–9 months typical",
  "Lower TCO, subscription",
  "Pre-configured industry processes",
  "SAP Gold Partner",
];

/** The 2-week Pathway Assessment — Blueprint §8.1 "How we help choose". */
const pathwaySteps = [
  {
    title: "Process mapping",
    body: "We map your core end-to-end processes against standard S/4HANA Cloud to see where fit-to-standard holds and where it does not.",
  },
  {
    title: "Customisation gap",
    body: "We quantify the gap between your required customisation and what each edition supports without straining the operating model.",
  },
  {
    title: "Integration complexity",
    body: "We assess your SAP and non-SAP landscape, interfaces and data flows to gauge integration effort and risk on each path.",
  },
  {
    title: "TCO modelling",
    body: "We model total cost of ownership across both editions — subscription, run and change — so the decision is grounded in numbers.",
  },
  {
    title: "Regulatory constraints",
    body: "We factor data residency, audit and sector-specific regulatory constraints that can rule a path in or out before design begins.",
  },
  {
    title: "Evidence-based recommendation",
    body: "We bring it together into a single, defensible recommendation — RISE, GROW or a hybrid of both — backed by the evidence above.",
  },
];

export default function RiseVsGrowPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/sap-enterprise-solutions/rise-vs-grow/" />
      <PageHero
        eyebrow="RISE vs GROW with SAP"
        headline="Two valid paths."
        accentWord="One honest recommendation."
        subhead="RISE with SAP and GROW with SAP are both legitimate routes to S/4HANA Cloud. We recommend based on your business profile — not internal convenience — and prove it with a structured two-week Pathway Assessment."
        media={<HeroObject name="pages/sap-rise-vs-grow" />}
        frame={false}
      />

      {/* GUIDED CHOOSER — the signature tool */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-10 max-w-2xl">
            <SectionHeading
              eyebrow="Guided chooser"
              lead="Answer seven quick questions and we'll point you to RISE, GROW or a hybrid — then prove it in the two-week Pathway Assessment."
            >
              Find your <Accent>path</Accent> in two minutes.
            </SectionHeading>
          </Reveal>
          <Reveal>
            <RiseGrowChooser />
          </Reveal>
        </Container>
      </Section>

      {/* COMPARISON — RISE vs GROW, side by side */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Side by side"
              lead="Both editions reach S/4HANA Cloud. The right one depends on scale, customisation, landscape complexity and how you want to run it."
            >
              RISE and GROW, <Accent>compared</Accent>.
            </SectionHeading>
          </Reveal>
          <Reveal>
            <ComparisonTable
              aspects={aspects}
              left={{ title: "RISE with SAP", badge: "Private Cloud", values: riseValues }}
              right={{ title: "GROW with SAP", badge: "Public Cloud", values: growValues }}
            />
          </Reveal>
        </Container>
      </Section>

      {/* HYBRID ROUTE NOTE — deck statement */}
      <Section tone="white">
        <Container>
          <Reveal className="max-w-3xl">
            <SectionHeading
              eyebrow="It is not always either / or"
              lead="In many landscapes GROW fits greenfield units, RISE fits the established core — and sometimes both are used together across a hybrid landscape. We design for the enterprise you actually run, not a single product line."
            >
              Often the answer is <Accent>both</Accent>.
            </SectionHeading>
          </Reveal>
        </Container>
      </Section>

      {/* HOW WE HELP CHOOSE — the 2-week Pathway Assessment steps */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="The 2-week Pathway Assessment"
              lead="A fixed, two-week engagement that turns the RISE-or-GROW question into an evidence-based decision your board can stand behind."
            >
              Six steps to a defensible <Accent>decision</Accent>.
            </SectionHeading>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {pathwaySteps.map((step, i) => (
              <StaggerItem key={step.title} className="h-full">
                <Card className="h-full">
                  <span className="label-caps text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 text-h3 font-bold text-foreground">{step.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-foreground-muted">{step.body}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <CtaSection
        eyebrow="Decide with evidence"
        heading={
          <>
            Start the <Accent>2-week Pathway Assessment</Accent>.
          </>
        }
        body="Two weeks. One recommendation — RISE, GROW or hybrid — grounded in your processes, your landscape and your numbers."
        ctaLabel="Start the 2-week Pathway Assessment"
      />
    </>
  );
}
