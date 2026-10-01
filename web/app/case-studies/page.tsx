import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui/container";
import { Accent, SectionHeading } from "@/components/ui/typography";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { HeroObject } from "@/components/sections/hero-media";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { CaseStudyGrid } from "@/components/sections/case-study-grid";
import { CtaSection } from "@/components/sections/cta-section";
import { getFeaturedClients } from "@/lib/content";
import { caseStudies } from "@/content/case-studies";

export const metadata = pageMetadata("/case-studies/", {
  title: "Clients & Case Studies",
  description:
    "150+ global enterprises delivered to one standard. Browse SAP case studies across industries and delivery paths, from RISE migrations to AMS engagements.",
});

export default function CaseStudiesPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/case-studies/" />
      <PageHero
        eyebrow="Clients & Case Studies"
        headline="150+ global enterprises,"
        accentWord="one delivery standard."
        subhead="From national utilities to digital-first FMCG brands, our clients span industries and continents — each delivered against the same standard of precision, proof and on-time delivery."
        media={<HeroObject name="pages/case-studies" />}
        frame={false}
      />

      {/* CLIENT LOGO WALL */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="In good company"
              lead="A representative spread of the enterprises that trust In2IT EBS across SAP implementation, migration and managed services."
            >
              Trusted across <Accent>sectors</Accent>.
            </SectionHeading>
          </Reveal>
          <Reveal delay={0.08}>
            <LogoMarquee clients={getFeaturedClients(24)} />
          </Reveal>
        </Container>
      </Section>

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
          <CaseStudyGrid studies={caseStudies} />
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
              <a href="/contact/" className="font-semibold text-action underline-offset-4 hover:underline">
                contact page
              </a>
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
        body="Tell us your industry and SAP path. We'll arrange a reference call with a comparable client and walk you through how the work was delivered."
        ctaLabel="Request a reference call"
      />
    </>
  );
}
