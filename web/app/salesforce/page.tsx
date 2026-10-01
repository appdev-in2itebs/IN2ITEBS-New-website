import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui/container";
import { Accent, SectionHeading } from "@/components/ui/typography";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { HeroObject } from "@/components/sections/hero-media";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata = pageMetadata("/salesforce/", {
  title: "Salesforce",
  description:
    "Salesforce consulting and delivery across Sales, Service, Marketing, Commerce and Industry Clouds — with integration depth into SAP and Workday.",
});

const lifecycle = [
  { stage: "Acquire", note: "Demand generation, lead capture and qualification." },
  { stage: "Engage", note: "Journeys, personalisation and always-on conversations." },
  { stage: "Convert", note: "Pipeline acceleration, forecasting and lead-to-cash." },
  { stage: "Serve", note: "Omni-channel case management and knowledge." },
  { stage: "Retain", note: "Loyalty, renewals and proactive service." },
];

const clouds = [
  {
    title: "Sales Cloud",
    body: "Pipeline acceleration, forecasting and partner enablement across the full sales motion.",
    bullets: ["Pipeline acceleration", "Forecasting", "Partner enablement"],
  },
  {
    title: "Service Cloud",
    body: "Omni-channel case management with knowledge and AI-assisted resolution.",
    bullets: ["Omni-channel case management", "Knowledge base", "AI resolution"],
  },
  {
    title: "Marketing Cloud",
    body: "Campaign, journey and personalisation orchestrated across digital channels.",
    bullets: ["Campaign management", "Journey orchestration", "Cross-channel personalisation"],
  },
  {
    title: "Commerce Cloud",
    body: "B2B and B2C storefronts and partner portals built for scale.",
    bullets: ["B2B storefronts", "B2C storefronts", "Partner portals"],
  },
  {
    title: "Industry Clouds",
    body: "Vertical solutions for Financial Services, Health, Communications and beyond.",
    bullets: ["Financial Services", "Health", "Communications & other verticals"],
  },
  {
    title: "Einstein + Platform",
    body: "Predictive sales and service, Lightning extensions and custom Apex development.",
    bullets: ["Predictive sales & service", "Lightning extensions", "Custom Apex"],
  },
];

const engagements = [
  {
    title: "Advisory",
    body: "CX strategy, customer-journey mapping and lead-to-cash design.",
    bullets: ["CX strategy", "Customer-journey mapping", "Lead-to-cash design"],
  },
  {
    title: "Implementation",
    body: "Multi-cloud deployments with data migration, governance and change.",
    bullets: ["Multi-cloud deployments", "Data migration", "Governance & change"],
  },
  {
    title: "Integration",
    body: "MuleSoft, SAP and Workday connectors, plus payment and telephony.",
    bullets: ["MuleSoft", "SAP & Workday connectors", "Payment & telephony"],
  },
  {
    title: "Engagement & Digital",
    body: "Marketing automation, Customer 360 and Einstein personalisation.",
    bullets: ["Marketing automation", "Customer 360", "Einstein personalisation"],
  },
  {
    title: "Managed Services",
    body: "Org health checks, release management and L1–L3 application maintenance.",
    bullets: ["Org health checks", "Release management", "L1–L3 AMS"],
  },
];

export default function SalesforcePage() {
  return (
    <>
      <BreadcrumbJsonLd path="/salesforce/" />
      <PageHero
        eyebrow="Salesforce"
        headline="Reimagining the customer"
        accentWord="experience"
        subhead="Sales, Service, Marketing, Commerce and Industry Clouds — with Salesforce as the digital backbone."
        media={<HeroObject name="pages/salesforce" />}
        frame={false}
      />

      {/* CAPABILITY OVERVIEW + LIFECYCLE */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Capability overview"
              lead="We help enterprises transform their customer-facing functions — sales, service, marketing, commerce and field operations — across the full customer lifecycle."
            >
              Customer experience, <Accent>end to end</Accent>.
            </SectionHeading>
          </Reveal>
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {lifecycle.map((l) => (
              <StaggerItem key={l.stage} className="h-full">
                <div className="glass-card flex h-full flex-col gap-2 rounded-surface p-6">
                  <span className="label-caps text-gold">{l.stage}</span>
                  <p className="text-[0.9rem] leading-relaxed text-foreground-muted">{l.note}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* THE CLOUDS WE DELIVER */}
      <Section tone="white" id="clouds">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="The clouds we deliver"
              lead="Six clouds, delivered as one connected platform — chosen to fit the customer functions you need to transform."
            >
              One platform, every <Accent>cloud</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={clouds} columns={3} />
        </Container>
      </Section>

      {/* HOW WE ENGAGE */}
      <Section tone="light" id="engage">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="How we engage"
              lead="Five engagement types covering the full Salesforce lifecycle — used independently or chained into a multi-year programme."
            >
              From strategy to <Accent>steady state</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={engagements} columns={3} />
        </Container>
      </Section>

      {/* WHY OUR SALESFORCE PRACTICE — INTEGRATION DEPTH */}
      <Section tone="white">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
            <Reveal>
              <SectionHeading eyebrow="Why our Salesforce practice">
                A customer platform that <Accent>connects</Accent>.
              </SectionHeading>
            </Reveal>
            <Reveal delay={0.1} className="lg:pt-2">
              <p className="max-w-measure text-lg leading-relaxed text-foreground-muted">
                A Salesforce Partner with integration depth into SAP and Workday — so your customer platform connects
                cleanly to the rest of your enterprise estate.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <CtaSection
        eyebrow="Next step"
        heading={
          <>
            Reimagine the customer <Accent>experience</Accent>.
          </>
        }
        body="Start your transformation and we'll map your Salesforce priorities — advisory, implementation, integration or managed services."
        ctaLabel="Start your transformation"
        ctaHref="/contact/"
      />
    </>
  );
}
