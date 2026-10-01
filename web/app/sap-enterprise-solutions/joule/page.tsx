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

export const metadata = pageMetadata("/sap-enterprise-solutions/joule/", {
  title: "SAP Joule",
  description:
    "SAP Joule and Joule Studio delivered by an early-adopter partner — production agents, custom skills and responsible-AI guardrails across your SAP landscape.",
});

/** The four ways teams use Joule — Blueprint §8.7. */
const ways = [
  {
    title: "Joule for Business Users",
    body: "A copilot inside the apps people already work in.",
    bullets: [
      "Natural-language answers grounded in SAP data",
      "Guided tasks and approvals in context",
      "Faster onboarding to complex screens",
      "Embedded across S/4HANA, SuccessFactors and more",
    ],
  },
  {
    title: "Joule Studio",
    body: "Where bespoke agents and skills are built.",
    bullets: [
      "Low-code agent and skill authoring",
      "Reusable skills wired to live SAP processes",
      "Versioning, testing and promotion to production",
      "Governed reuse across the organisation",
    ],
  },
  {
    title: "Joule Agents",
    body: "Autonomy applied to real, end-to-end work.",
    bullets: [
      "Multi-step tasks executed across systems",
      "HR self-service and ticket-triage agents",
      "Human-in-the-loop checkpoints",
      "Auditable actions and outcomes",
    ],
  },
  {
    title: "Joule for Developers",
    body: "Generative help across the build lifecycle.",
    bullets: [
      "Code generation and explanation in ABAP and beyond",
      "Faster extension and integration development",
      "Accelerated testing and documentation",
      "Built into the SAP development experience",
    ],
  },
];

/** What we have already built — Blueprint §8.7. */
const built = [
  {
    title: "Production Joule agents",
    body: "Live agents for HR self-service and ticket triage — resolving routine requests and routing the rest to the right team, with humans in the loop.",
  },
  {
    title: "LLM integration patterns",
    body: "Joule connected to OpenAI and Claude through proven integration patterns, so each task draws on the model best suited to it.",
  },
  {
    title: "Custom skill library",
    body: "A reusable skill library for Concur, Ariba and SuccessFactors — wired to live processes rather than rebuilt for every engagement.",
  },
  {
    title: "Responsible-AI guardrails",
    body: "Prompt governance, guardrails and review gates that keep agents safe, accurate and accountable as they reach production.",
  },
];

export default function JoulePage() {
  return (
    <>
      <BreadcrumbJsonLd path="/sap-enterprise-solutions/joule/" />
      <PageHero
        eyebrow="SAP Enterprise Solutions · Joule"
        headline="SAP's generative copilot,"
        accentWord="in production."
        subhead="As an early-adopter partner for SAP Joule and Joule Studio, we move organisations beyond demos — building production agents, custom skills and responsible-AI guardrails across the SAP landscape."
        media={<HeroObject name="pages/sap-joule-ai" />}
        frame={false}
      />

      {/* FOUR WAYS TEAMS USE JOULE */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="How it's used"
              lead="Joule is not a single feature — it spans the people who use SAP, the teams who extend it and the agents that act on its behalf."
            >
              Four ways teams use <Accent>Joule</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={ways} columns={4} bezel />
        </Container>
      </Section>

      {/* WHAT WE HAVE ALREADY BUILT */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="From our practice"
              lead="We are not waiting for the roadmap to mature. These are working assets, already running in client landscapes."
            >
              What we have already <Accent>built</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={built} columns={2} />
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
              Early, and already <Accent>shipping</Accent>.
            </h2>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-3">
            {[
              { value: "10+", label: "Joule rollouts" },
              { value: "2", label: "Custom Joule Studio agents & skills in production" },
              { value: "60+", label: "Joule practitioners" },
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
        eyebrow="Joule"
        heading={
          <>
            Move from demo to <Accent>deployment</Accent>.
          </>
        }
        body="Tell us where Joule could earn its keep first. We'll map an activation that puts agents, skills and guardrails to work across your SAP landscape."
        ctaLabel="Plan your Joule activation"
      />
    </>
  );
}
