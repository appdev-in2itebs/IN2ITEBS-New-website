import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui/container";
import { Accent, SectionHeading } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { HeroObject } from "@/components/sections/hero-media";
import { ThreeReasons } from "@/components/sections/three-reasons";
import { AllianceStrip } from "@/components/sections/alliance-strip";
import { CtaSection } from "@/components/sections/cta-section";
import { footerCertifications } from "@/content/site";

export const metadata = pageMetadata("/why-in2it-ebs/", {
  title: "Why In2IT EBS",
  description:
    "Three differentiated capabilities — partnership depth, delivery economics at scale and a method that compresses timelines — each backed by evidence.",
});

export default function WhyIn2ITEBSPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/why-in2it-ebs/" />
      <PageHero
        route="/why-in2it-ebs/"
        eyebrow="Why In2IT EBS"
        headline="Three reasons enterprises choose us — and"
        accentWord="stay"
        subhead="Not seven generic claims. Three differentiated capabilities, each backed by evidence."
        media={<HeroObject name="pages/why-in2it-ebs" />}
        frame={false}
      />

      {/* THREE REASONS */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-14 max-w-2xl">
            <SectionHeading
              eyebrow="The case for In2IT EBS"
              lead="Partnership depth, delivery economics and accelerated outcomes — the capabilities that separate us from the field."
            >
              Differentiation you can <Accent>verify</Accent>.
            </SectionHeading>
          </Reveal>
          <ThreeReasons />
        </Container>
      </Section>

      {/* ALLIANCES */}
      <Section tone="light" id="alliances">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Alliances"
              lead="Strategic alliances across AWS, Microsoft Azure, Google Cloud, SAP, Salesforce and Workday — 12+ strategic partners in all."
            >
              Built on the platforms you already <Accent>run</Accent>.
            </SectionHeading>
          </Reveal>
          <Reveal delay={0.1}>
            <AllianceStrip />
          </Reveal>
          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-gold-soft/40 pt-8 text-xs font-medium uppercase tracking-wider text-gold">
            {footerCertifications.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </Container>
      </Section>

      {/* CONVERGED INTELLIGENCE — POINT OF VIEW */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading eyebrow="The Converged Intelligence Stack">
              Where investment becomes <Accent>outcome</Accent>.
            </SectionHeading>
          </Reveal>
          <Reveal delay={0.1}>
            <Card tone="navy" className="md:p-12">
              <div className="flex flex-col gap-7">
                <span className="label-caps text-gold-on-brand">Our point of view</span>
                <p className="max-w-measure text-lg leading-relaxed text-brand-muted md:text-xl">
                  Bring SuccessFactors, Joule, BTP AI and extensions into one operating model — composable, intelligent,
                  continuous.
                </p>
                <blockquote className="max-w-3xl text-2xl font-bold leading-snug text-on-brand md:text-3xl">
                  &ldquo;Convergence is where SAP investments turn into measurable business
                  <Accent> outcomes</Accent>.&rdquo;
                </blockquote>
                <div className="pt-1">
                  <Button href="/sap-enterprise-solutions/" variant="on-dark" withArrow>
                    See the SAP point of view
                  </Button>
                </div>
              </div>
            </Card>
          </Reveal>
        </Container>
      </Section>

      <CtaSection
        eyebrow="Next step"
        heading={
          <>
            Map your <Accent>priorities</Accent> in 30 minutes.
          </>
        }
        body="Start your transformation and we'll map your priorities — advisory, build or run — against the capabilities that matter most."
      />
    </>
  );
}
