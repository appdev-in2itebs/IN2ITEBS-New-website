import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui/container";
import { Accent, SectionHeading } from "@/components/ui/typography";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { HeroObject } from "@/components/sections/hero-media";
import { CaseStudyGrid } from "@/components/sections/case-study-grid";
import { CtaSection } from "@/components/sections/cta-section";
import { publicCaseStudies } from "@/content/case-studies";

export const metadata = pageMetadata("/case-studies/", {
  title: "Clients & Case Studies",
  description:
    "Anonymised SAP case studies across industries and delivery paths, published while named-client permissions are verified.",
});

export default function CaseStudiesPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/case-studies/" />
      <PageHero
        route="/case-studies/"
        eyebrow="Clients & Case Studies"
        headline="Enterprise delivery,"
        accentWord="shown by sector."
        subhead="Anonymised engagements are published while named-client permissions and supporting evidence are verified."
        media={<HeroObject name="pages/case-studies" />}
        frame={false}
      />

      {/* CASE STUDY GRID */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Case studies"
              lead="Filter by industry and SAP path to see how we have delivered — the scenario, the solution and what set our delivery apart."
            >
              Proof, by <Accent>project</Accent>.
            </SectionHeading>
          </Reveal>
          <CaseStudyGrid studies={publicCaseStudies} />
        </Container>
      </Section>

      {/* NDA NOTE */}
      <Section tone="white">
        <Container>
          <Reveal className="max-w-2xl">
            <SectionHeading
              eyebrow="A note on confidentiality"
              lead="Several of our clients are shown anonymised, with no client name or logo. Their full stories — including named references and detailed outcomes — are available under NDA."
            >
              Discretion, by <Accent>default</Accent>.
            </SectionHeading>
            <p className="mt-6 text-[0.95rem] leading-relaxed text-foreground-muted">
              To request a named reference or the full version of an anonymised study, get in touch via our{" "}
              <Link href="/contact/" className="font-semibold text-action underline-offset-4 hover:underline">
                contact page
              </Link>
              .
            </p>
          </Reveal>
        </Container>
      </Section>

      <CtaSection
        eyebrow="Clients & Case Studies"
        heading={
          <>
            See it work in <Accent>your</Accent> sector.
          </>
        }
        body="Tell us your industry and SAP path. We will outline the relevant delivery approach and the evidence available for review."
        ctaLabel="Discuss your requirements"
      />
    </>
  );
}
