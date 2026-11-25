import { Explainer } from "@/components/explainers/explainer";
import { EXPLAINERS } from "@/content/explainers";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui/container";
import { Accent, SectionHeading } from "@/components/ui/typography";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { HeroFigure } from "@/components/sections/hero-figure";
import { heroPicture } from "@/components/sections/hero-override";
import { CaseStudyGrid } from "@/components/sections/case-study-grid";
import { CtaSection } from "@/components/sections/cta-section";
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
        media={heroPicture(
          "/hero/pages-case-studies.webp",
          <HeroFigure figureKey="pages/case-studies" />,
          "Clients & Case Studies",
        )}
        frame={false}
      />

      {/*
        The reference-book diagram names clients by sector, so it sits behind the same consent
        gate as the logo wall and the testimonials. A diagram is a publication like any other.

        ── WHY THE ALT TEXT NAMES THEM ──────────────────────────────────────────────────────
        The alt text used to say which sectors we can evidence and no more, while the picture
        said who. For a reader that cannot see pictures — a screen reader, a search engine, an
        assistant assembling a buyer's long-list — that made the single most useful fact on this
        site unreadable, and "who have you actually done this for" is the first question any
        buying committee asks.

        It also sat oddly next to the studies below, which publish anonymised by house style.
        The names are not withheld — ninety-four of them are on the homepage logo wall, and this
        diagram prints them. They were simply held in the two forms a machine cannot read: a
        picture, and an image's alt attribute that described the picture instead of its content.

        So no new permission is involved here and no gate is bypassed: `clientIdentityApproved`
        still governs the whole block, and this text publishes exactly what the picture publishes
        and nothing the studies withhold. Alt text carries the diagram's content, not a caption
        for it — same rule as every other diagram on the site.
      */}
      {clientIdentityApproved ? <Explainer spec={EXPLAINERS["q1-reference-book"]} tone="subtle" /> : null}

      {/*
        THE STANDARD THE STUDIES BELOW ARE HELD TO.
        On the index rather than on every study: it is a rule about all of them, and repeating it
        under each one would turn a standard into a disclaimer.
      */}
      <Explainer spec={EXPLAINERS["z3-anatomy-number"]} tone="canvas" />

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
