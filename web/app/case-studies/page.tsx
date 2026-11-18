import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui/container";
import { Accent, SectionHeading } from "@/components/ui/typography";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { HeroFigure } from "@/components/sections/hero-figure";
import { CaseStudyGrid } from "@/components/sections/case-study-grid";
import { CtaSection } from "@/components/sections/cta-section";
import { DiagramBand } from "@/components/sections/diagram-band";
import { publicCaseStudies } from "@/content/case-studies";
import { clientIdentityApproved } from "@/content/compliance";

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
        media={<HeroFigure figureKey="pages/case-studies" />}
        frame={false}
      />

      {/* The reference-book diagram names clients by sector, so it is behind the same consent
          gate as the logo wall and the testimonials. A diagram is a publication like any other. */}
      {clientIdentityApproved ? (
        <DiagramBand
          src="/diagrams/q1-reference-book.svg"
          alt="The client reference book by sector: the named clients In2IT EBS can evidence in power and utilities, metals and mining, government, manufacturing, consumer goods, pharma and healthcare, technology, banking, and real estate."
          tone="subtle"
        />
      ) : null}

      {/*
        THE STANDARD THE STUDIES BELOW ARE HELD TO.
        On the index rather than on every study: it is a rule about all of them, and repeating it
        under each one would turn a standard into a disclaimer.
      */}
      <DiagramBand
        src="/diagrams/z3-anatomy-number.svg"
        alt="Two panels compared. The usual form of an outcome claim: a large percentage with four empty slots — what it is a number of, the period it covers, who did the arithmetic and what is not counted, none of them stated. Ours: 70 to 75 per cent, with all four filled in from a Belgian S/4HANA Public Cloud assessment."
        caption="A figure on a case study here fills all four slots or it does not appear as a figure. That is a build rule, which is why several of these studies carry no percentage at all."
        tone="canvas"
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
              <Link
                href="/contact/"
                className="inline-block min-h-6 font-semibold text-action underline-offset-4 hover:underline"
              >
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
