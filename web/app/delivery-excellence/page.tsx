import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading, Accent, Eyebrow } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { HeroObject } from "@/components/sections/hero-media";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaSection } from "@/components/sections/cta-section";
import {
  fastForwardLayers,
  tiers,
  engagementModels,
  deliveryFootprints,
  amsPhases,
  factorySteps,
} from "@/content/delivery";

export const metadata = pageMetadata("/delivery-excellence/", {
  title: "Delivery Excellence",
  description:
    "The FastForward methodology, AMS transition approach and development factory model behind every In2IT EBS engagement.",
});

export default function DeliveryExcellencePage() {
  return (
    <>
      <BreadcrumbJsonLd path="/delivery-excellence/" />
      <PageHero
        eyebrow="Delivery Excellence"
        headline="Delivery"
        accentWord="excellence"
        subhead="The methodology, transition approach and factory model behind every engagement."
        media={<HeroObject name="pages/delivery-excellence" />}
        frame={false}
      />

      {/* IN2IT FASTFORWARD */}
      <Section tone="light" id="fastforward">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="In2IT FastForward"
              lead="A branded delivery method built on SAP Activate, accelerated by pre-built assets, and governed by a single quality gate at every phase — applied uniformly across SAP, Salesforce, Workday and ADMS programmes."
            >
              FastForward — our proprietary delivery <Accent>method</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid
            features={fastForwardLayers.map((layer) => ({
              title: layer.name,
              body: layer.detail,
            }))}
            columns={2}
          />
        </Container>
      </Section>

      {/* HOW YOU ENGAGE */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="How you engage"
              lead="One delivery engine underneath three tiers — advisory, build, run — with five engagement models and three delivery footprints."
            >
              One delivery engine, three <Accent>tiers</Accent>.
            </SectionHeading>
          </Reveal>

          <FeatureGrid
            features={tiers.map((tier) => ({
              title: tier.name,
              bullets: tier.items,
            }))}
            columns={3}
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <Reveal>
              <Card tone="light" className="h-full">
                <Eyebrow>Engagement models</Eyebrow>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {engagementModels.map((model) => (
                    <span key={model} className="glass-pill px-4 py-2 text-sm font-medium text-foreground">
                      {model}
                    </span>
                  ))}
                </div>
              </Card>
            </Reveal>
            <Reveal delay={0.1}>
              <Card tone="light" className="h-full">
                <Eyebrow>Delivery footprints</Eyebrow>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {deliveryFootprints.map((footprint) => (
                    <span key={footprint} className="glass-pill px-4 py-2 text-sm font-medium text-foreground">
                      {footprint}
                    </span>
                  ))}
                </div>
              </Card>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* AMS TRANSITION */}
      <Section tone="light" id="transition">
        <Container>
          <Reveal className="mb-14 max-w-2xl">
            <SectionHeading
              eyebrow="AMS transition"
              lead="A five-phase AMS transition from pre-transition planning to full-service commencement, with quality gates at every phase and overlap with incumbent teams."
            >
              16 weeks to safe <Accent>steady-state</Accent>.
            </SectionHeading>
          </Reveal>

          <Stagger className="relative flex flex-col gap-6 md:gap-7">
            {/* vertical spine */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-[1.4375rem] top-3 bottom-3 hidden w-px bg-border-subtle md:block"
            />
            {amsPhases.map((phase, i) => (
              <StaggerItem key={phase.name}>
                <div className="relative grid gap-5 md:grid-cols-[3rem_1fr] md:gap-7">
                  <div className="hidden md:block">
                    <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-lg font-bold text-on-brand shadow-glass ring-4 ring-surface-subtle">
                      {i + 1}
                    </span>
                  </div>
                  <Card tone="white" bezel={false}>
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                      <h3 className="text-h3 font-bold text-foreground">
                        <span className="mr-3 text-gold md:hidden">{i + 1}.</span>
                        {phase.name}
                      </h3>
                      <span className="label-caps shrink-0 text-gold">{phase.weeks}</span>
                    </div>
                    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                      {phase.activities.map((activity) => (
                        <li key={activity} className="flex gap-2.5 text-[0.9rem] leading-relaxed text-foreground-muted">
                          <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-action" />
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* DEVELOPMENT FACTORY */}
      <Section tone="white" id="factory">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Development factory"
              lead="A standardised, repeatable, automated development model built on factory principles for quality, productivity and predictable throughput — Plan, Build, Run, with full ALM support and integrated testing."
            >
              A development factory, <Accent>industrialised</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid
            features={factorySteps.map((step) => ({
              title: step.name,
              bullets: step.items,
            }))}
            columns={3}
          />
          <Reveal delay={0.1} className="mt-8">
            <p className="max-w-measure text-[0.95rem] leading-relaxed text-foreground-muted">
              Business demand flows through prioritised projects into assembly-line development — Analyse &amp; Design,
              Build, Test, UAT, Deploy, Release — governed by the In2IT EBS development methodology and Apps Development
              Factory.
            </p>
          </Reveal>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
