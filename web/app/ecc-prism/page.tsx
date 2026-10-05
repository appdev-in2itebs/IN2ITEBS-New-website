import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Accent, SectionHeading } from "@/components/ui/typography";
import { Reveal } from "@/components/motion/reveal";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { PageHero } from "@/components/sections/page-hero";
import { HeroObject } from "@/components/sections/hero-media";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata = pageMetadata("/ecc-prism/", {
  title: "ECC Prism™",
  description: "ECC Prism™ is our assessment for organisations planning the move from SAP ECC to S/4HANA.",
});

const pathways = [
  {
    title: "Advisory & Implementation",
    body: "Feeds the greenfield versus brownfield decision, working alongside our Discovery & Design and Maturity Assessment engagements.",
  },
  {
    title: "Data & Analytics",
    body: "Feeds our Syniti-based five-stage data approach — from profiling through to governance — ahead of conversion.",
  },
];

export default function EccPrismPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/ecc-prism/" name="ECC Prism™" />
      <PageHero
        route="/ecc-prism/"
        eyebrow="SAP Enterprise Solutions"
        headline="Know your ECC estate before you"
        accentWord="convert."
        subhead="ECC Prism™ is our assessment for organisations planning the move from SAP ECC to S/4HANA."
        media={<HeroObject name="pages/ecc-prism" />}
        frame={false}
      />

      {/* WHAT IT DOES */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="What it does"
              lead="ECC Prism™ supports the brownfield decision — understanding your current ECC system, custom code and data before a conversion to S/4HANA. It sits alongside our SAP advisory engagements and our Syniti-based data-migration practice."
            >
              An informed view of your ECC <Accent>system</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={pathways} columns={2} />
        </Container>
      </Section>

      {/* PART OF THE SAP PRACTICE */}
      <Section tone="white">
        <Container>
          <Reveal className="max-w-2xl">
            <SectionHeading eyebrow="Where it fits">
              Part of our wider SAP <Accent>practice</Accent>.
            </SectionHeading>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <Link
              href="/sap-enterprise-solutions/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-action"
            >
              Explore SAP Enterprise Solutions
              <ArrowUpRight size={16} strokeWidth={1.5} />
            </Link>
          </Reveal>
        </Container>
      </Section>

      <CtaSection
        eyebrow="Next step"
        heading={
          <>
            Book a discovery <Accent>workshop</Accent>.
          </>
        }
        body="Map your ECC estate, custom code and data — and plan the path to S/4HANA with confidence."
        ctaLabel="Start your transformation"
        ctaHref="/contact/"
      />
    </>
  );
}
