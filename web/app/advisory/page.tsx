import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui/container";
import { Accent, SectionHeading } from "@/components/ui/typography";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { HeroObject } from "@/components/sections/hero-media";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata = pageMetadata("/advisory/", {
  title: "Advisory Services",
  description:
    "The trusted layer that defines the why and what — transformation advisory, strategy and governance, enterprise architecture and change assurance.",
});

const transformationAdvisory = [
  {
    title: "Business Transformation",
    body: "End-to-end transformation strategy that connects business ambition to a deliverable change agenda.",
  },
  {
    title: "CIO Advisory",
    body: "Trusted counsel for technology leaders on portfolio, modernisation and value realisation.",
  },
  {
    title: "Operating Model Design",
    body: "Designing the structures, roles and ways of working that make transformation stick.",
  },
  {
    title: "ERP Advisory",
    body: "Independent guidance on ERP direction, readiness and the path to S/4HANA and beyond.",
  },
];

const strategyGovernance = [
  {
    title: "AI Strategy & Roadmap",
    body: "A pragmatic, sequenced plan for where and how AI creates value across the enterprise.",
  },
  {
    title: "Governance & PMO",
    body: "Programme governance and PMO structures that keep complex transformation on course.",
  },
  {
    title: "Program Assurance",
    body: "Confidence that programmes will deliver — checked against scope, risk and outcome.",
  },
  {
    title: "Investment Prioritisation",
    body: "Disciplined prioritisation so investment flows to the initiatives that matter most.",
  },
];

const enterpriseArchitecture = [
  {
    title: "Target Architecture Design",
    body: "A coherent future-state architecture aligned to business capability and outcomes.",
  },
  {
    title: "Application Portfolio Rationalisation",
    body: "Simplifying the estate — retiring, consolidating and modernising applications with intent.",
  },
  {
    title: "Integration & Data Architecture",
    body: "The connective tissue and data foundations that let the enterprise operate as one.",
  },
  {
    title: "Reference Architectures",
    body: "Repeatable reference architectures, managed with SAP LeanIX for live portfolio insight.",
  },
];

const changeAssurance = [
  {
    title: "Process Excellence",
    body: "Re-engineering and standardising processes so transformation lands on solid foundations.",
  },
  {
    title: "Change Management",
    body: "Structured change that brings people with the programme — not behind it.",
  },
  {
    title: "Stakeholder & Adoption",
    body: "Stakeholder alignment and adoption planning that turn delivery into lasting value.",
  },
  {
    title: "Independent Program Assurance",
    body: "An objective, expert view that protects programmes from the risks they cannot see.",
  },
];

export default function AdvisoryPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/advisory/" />
      <PageHero
        route="/advisory/"
        eyebrow="Advisory Services"
        headline="Advisory that gets to"
        accentWord="outcomes."
        subhead="The trusted layer that defines the why and what — before platforms and engineering deliver the how."
        media={<HeroObject name="pages/advisory" />}
        frame={false}
      />

      {/* TRANSFORMATION ADVISORY */}
      <Section tone="light" id="transformation-advisory">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Transformation Advisory"
              lead="Counsel at the top of the programme — connecting business ambition to a transformation agenda leaders can commit to."
            >
              Where transformation <Accent>begins</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={transformationAdvisory} columns={2} />
        </Container>
      </Section>

      {/* STRATEGY & GOVERNANCE */}
      <Section tone="white" id="strategy-governance">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Strategy & Governance"
              lead="The strategy to choose the right moves and the governance to see them through — including a pragmatic path for AI."
            >
              Direction, held to <Accent>account</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={strategyGovernance} columns={2} />
        </Container>
      </Section>

      {/* ENTERPRISE ARCHITECTURE */}
      <Section tone="light" id="enterprise-architecture">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Enterprise Architecture"
              lead="A coherent target architecture and a rationalised estate — designed and governed with SAP LeanIX for a live view of the portfolio."
            >
              An estate designed to <Accent>connect</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={enterpriseArchitecture} columns={2} />
        </Container>
      </Section>

      {/* CHANGE & ASSURANCE */}
      <Section tone="white" id="change-assurance">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Change & Assurance"
              lead="Process, people and independent assurance — so programmes don't just go live, they deliver the value they promised."
            >
              Change that <Accent>sticks</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={changeAssurance} columns={2} />
        </Container>
      </Section>

      <CtaSection
        eyebrow="Next step"
        heading={
          <>
            Shape your transformation <Accent>roadmap</Accent>.
          </>
        }
        body="Start with the why and the what. We'll bring independent advisory, strategy and architecture to map your first move — before a line of the how is delivered."
        ctaLabel="Shape your transformation roadmap"
        ctaHref="/contact/"
      />
    </>
  );
}
