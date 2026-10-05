import Image from "next/image";
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

export const metadata = pageMetadata("/sap-enterprise-solutions/successfactors/", {
  title: "SAP SuccessFactors / HXM",
  description:
    "SAP SuccessFactors across Core HR, Talent, Cloud Payroll, Work Zone and people analytics — delivered by a deep certified consultant pool.",
});

/** The SuccessFactors / HXM capability map — Blueprint §8.3. */
const capabilities = [
  {
    title: "Core HR & Talent",
    body: "Employee Central as the single system of record, with the talent suite built on top.",
    bullets: ["Employee Central core HR", "Recruiting & onboarding", "Performance & goals", "Succession & development"],
  },
  {
    title: "Cloud Payroll & Compensation",
    body: "Pay and reward, run accurately and on policy.",
    bullets: [
      "Employee Central Payroll",
      "Compensation & variable pay",
      "Country-specific configurations",
      "Finance and posting integration",
    ],
  },
  {
    title: "Time & Attendance",
    body: "Time captured, costed and compliant.",
    bullets: [
      "Time tracking & management",
      "Absence & leave rules",
      "Shift and roster scheduling",
      "Time-to-payroll integration",
    ],
  },
  {
    title: "Learning & Talent Intelligence",
    body: "Skills, growth and mobility, joined up.",
    bullets: [
      "Learning management (LMS)",
      "Skills & competency frameworks",
      "Talent intelligence insights",
      "Internal mobility & career paths",
    ],
  },
  {
    title: "Employee Experience",
    body: "A workplace people want to stay in.",
    bullets: [
      "HR Work Zone digital workplace",
      "Guided employee journeys",
      "Listening & feedback cycles",
      "Self-service across the lifecycle",
    ],
  },
  {
    title: "People Analytics & Planning",
    body: "Decisions made on workforce evidence.",
    bullets: [
      "People analytics & reporting",
      "Workforce planning",
      "Headcount & cost modelling",
      "Stories in People Analytics",
    ],
  },
];

/** Accelerators & highlights — Blueprint §8.3. */
const accelerators = [
  {
    title: "HR Work Zone instances",
    body: "Production HR Work Zone digital-workplace instances stood up and tuned to each client's employee journeys.",
  },
  {
    title: "Certified consultant pool",
    body: "A deep bench of certified HXM consultants spanning Core HR, Talent, Payroll and analytics — sized for full programmes, not single modules.",
  },
  {
    title: "iTAM accelerator",
    body: "Our integrated talent and application management accelerator, shortening configuration of the talent suite and its integrations.",
  },
  {
    title: "EBSx rapid-deployment kit",
    body: "Pre-built configuration, data templates and test packs that compress the path from kick-off to a working SuccessFactors landscape.",
  },
  {
    title: "Joule-for-HR enablement playbook",
    body: "A structured playbook to switch on the Joule copilot for HR — use cases, guardrails and adoption steps for self-service and HR teams.",
  },
];

export default function SuccessFactorsPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/sap-enterprise-solutions/successfactors/" />
      <PageHero
        route="/sap-enterprise-solutions/successfactors/"
        eyebrow="SAP Enterprise Solutions · SuccessFactors / HXM"
        headline="Human experience management,"
        accentWord="at scale."
        subhead="SAP SuccessFactors across Core HR, Talent, Cloud Payroll, Work Zone and people analytics — one human-experience platform, delivered by a deep certified consultant pool."
        media={<HeroObject name="pages/sap-successfactors" />}
        frame={false}
      />

      {/* CAPABILITY MAP */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Capability map"
              lead="The full SuccessFactors suite, joined up — from the system of record through talent, pay, time, learning and analytics, rather than a scatter of point modules."
            >
              The full HXM <Accent>suite</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={capabilities} columns={3} bezel />
        </Container>
      </Section>

      {/* THE SUITE, AS SAP DRAWS IT */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="The HCM suite"
              lead="SAP Human Capital Management is a human resources management system designed around what people need, how they work, and what motivates and inspires them to be and do their best. It embeds insight and action planning directly into HR systems and processes, so improvement is continuous rather than annual."
            >
              Connected, empowered, <Accent>supported</Accent>.
            </SectionHeading>
          </Reveal>
          {/* SAP's own HCM schematic, as the existing site's SuccessFactors page uses it. It is drawn
              for a white ground, so it sits on a white card rather than the section tint. */}
          <Reveal>
            <Card tone="white">
              <figure>
                <Image
                  src="/services/successfactors-hcm-suite.png"
                  alt="The SAP Human Capital Management suite: a core of connected, empowered and supported, ringed by hiring and onboarding, culture and belonging, pay and benefits, guidance and efficiency, appreciation and impact, opportunities and growth, feedback and improvement, learning and development, and nurture and engagement — between intelligent enterprise and business transformation, over guided workflows, analytics and insights, an extensible foundation and localisation frameworks."
                  width={1000}
                  height={1052}
                  sizes="(min-width: 768px) 34rem, 100vw"
                  className="mx-auto h-auto w-full max-w-[34rem] rounded-surface bg-logo-surface"
                />
                <figcaption className="mx-auto mt-6 max-w-[70ch] text-center text-sm leading-relaxed text-foreground-muted">
                  Individualised experiences and strategic solutions that let employees reach their potential — across
                  employee experience management, core HR and payroll, talent management, and HR analytics and workforce
                  planning.
                </figcaption>
              </figure>
            </Card>
          </Reveal>
        </Container>
      </Section>

      {/* ACCELERATORS & HIGHLIGHTS */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Accelerators & highlights"
              lead="The assets and people that take SuccessFactors live faster — proven instances, a certified pool and pre-built kits, rather than a standing start."
            >
              Built to move <Accent>faster</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={accelerators} columns={3} />
          <Reveal delay={0.1} className="mt-8">
            <Link
              href="/sap-enterprise-solutions/health-check-360/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-action hover:text-foreground"
            >
              See Health Check 360&deg; <ArrowUpRight size={16} strokeWidth={1.5} />
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
              Delivered, <Accent>repeatedly</Accent>.
            </h2>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-3">
            {[
              { value: "125+", label: "Projects delivered" },
              { value: "87+", label: "Certified HXM consultants" },
              { value: "10+", label: "Live proofs of concept" },
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
        eyebrow="SuccessFactors / HXM"
        heading={
          <>
            Discuss SuccessFactors <Accent>transformation</Accent>.
          </>
        }
        body="Tell us where your people processes strain today. We'll map a SuccessFactors rollout across Core HR, Talent, Payroll and analytics — accelerated by our kits and certified pool."
      />
    </>
  );
}
