import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui/container";
import { Accent, SectionHeading } from "@/components/ui/typography";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { HeroObject } from "@/components/sections/hero-media";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata = pageMetadata("/digital-data-ai/ai-automation/", {
  title: "AI & Automation",
  description:
    "End-to-end digital transformation using industrial IoT, applied AI, computer vision and ERP integration — delivered by one accountable team.",
});

const capabilities = [
  {
    title: "Industrial IoT & Digital Twins",
    body: "Sensing and modelling the physical estate to predict failure before it happens.",
    bullets: [
      "Time-series historians & sensors",
      "Vibration & motor-signature analytics",
      "Drone / LiDAR 3D twins",
      "ML-driven failure prediction",
    ],
  },
  {
    title: "Computer Vision & Safety AI",
    body: "Vision analytics that keep operations safe, compliant and within quality tolerance.",
    bullets: [
      "PPE compliance & intrusion detection",
      "Foreign-object & fire-risk alerts",
      "Process anomaly & quality inspection",
      "Shared video-analytics platform",
    ],
  },
  {
    title: "Applied AI & GenAI",
    body: "Language and decision intelligence with governance and a human in the loop.",
    bullets: [
      "LLM document intelligence",
      "Tender evaluation & contract analysis",
      "Decision-support copilots & RAG",
      "Explainability & human-in-the-loop",
    ],
  },
  {
    title: "Integration, Cloud & ESG",
    body: "The architecture that connects operational technology to the enterprise core.",
    bullets: [
      "Event-driven, API-led architectures",
      "OT-to-S/4HANA integration spine",
      "AWS / Azure / GCP cloud-native engineering",
      "ESG: emissions, energy, water & materials",
    ],
  },
];

const phases = [
  {
    stage: "Discover · Frame · Architect",
    note: "Map opportunities, size value and design the target architecture before building.",
  },
  {
    stage: "Pilot & Prove",
    note: "Stand up focused pilots that prove value with real data and real users.",
  },
  {
    stage: "Scale & Sustain",
    note: "Industrialise what works and run it as a sustained, governed capability.",
  },
];

const principles = [
  {
    title: "Cluster, don't proliferate",
    body: "Consolidate use cases onto shared platforms rather than spreading point tools across the estate.",
  },
  {
    title: "Buy where mature, build where unique",
    body: "Use proven products for commodity capability and reserve custom engineering for genuine differentiation.",
  },
  {
    title: "OT, AI and ERP in one team",
    body: "One accountable team across operational technology, AI and ERP — not three vendors stitched together.",
  },
];

export default function AiAutomationPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/digital-data-ai/ai-automation/" />
      <PageHero
        route="/digital-data-ai/ai-automation/"
        eyebrow="Digital, Data & AI · AI & Automation"
        headline="Industrial IoT, computer vision and applied AI, in one accountable"
        accentWord="team"
        subhead="End-to-end digital transformation using industrial IoT, applied AI, computer vision and ERP integration — delivered by one accountable team."
        media={<HeroObject name="pages/ai-automation" />}
        frame={false}
      />

      {/* CAPABILITIES */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Capabilities"
              lead="From the sensor on the plant floor to the copilot in the boardroom — four capability areas that join operational technology, AI and the enterprise core."
            >
              From the plant floor to the <Accent>boardroom</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={capabilities} columns={2} />
        </Container>
      </Section>

      {/* DELIVERY APPROACH */}
      <Section tone="white" id="approach">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Delivery approach"
              lead="A phased approach that frames the opportunity, proves it on real data, then scales and sustains what works."
            >
              Discover, prove, <Accent>scale</Accent>.
            </SectionHeading>
          </Reveal>
          <Stagger className="grid gap-4 sm:grid-cols-3">
            {phases.map((p, i) => (
              <StaggerItem key={p.stage} className="h-full">
                <div className="glass-card flex h-full flex-col gap-2 rounded-surface p-6">
                  <span className="text-h3 font-bold text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span className="label-caps text-gold">{p.stage}</span>
                  <p className="text-[0.9rem] leading-relaxed text-foreground-muted">{p.note}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* HOW WE WORK — PRINCIPLES */}
      <Section tone="light" id="principles">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="How we work"
              lead="Three principles keep AI investment focused, economical and accountable — so it compounds rather than fragments."
            >
              Principles that keep AI <Accent>accountable</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={principles} columns={3} />
        </Container>
      </Section>

      <CtaSection
        eyebrow="Next step"
        heading={
          <>
            Start opportunity mapping and value <Accent>sizing</Accent>.
          </>
        }
        body="Start your transformation and we'll frame the highest-value AI, IoT and automation opportunities across your operations and enterprise core."
        ctaLabel="Start your transformation"
        ctaHref="/contact/"
      />
    </>
  );
}
