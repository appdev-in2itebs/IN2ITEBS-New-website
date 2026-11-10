import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { Eyebrow, Accent, SectionHeading } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaSection } from "@/components/sections/cta-section";
import { HeroMotif, practiceIcon } from "@/components/sections/hero-motif";
import { caseStudies, getCaseStudy } from "@/content/case-studies";
import { clientEvidenceApproved } from "@/content/compliance";

export async function generateStaticParams() {
  return clientEvidenceApproved ? caseStudies.filter((c) => c.named).map((c) => ({ slug: c.slug })) : [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return pageMetadata(`/case-studies/${slug}/`, { title: "Case study" });
  return pageMetadata(`/case-studies/${slug}/`, {
    title: `${study.client} — ${study.featuredSolution}`,
    description: study.summary ?? study.scenario.slice(0, 155),
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!clientEvidenceApproved || !study || !study.named) notFound();

  // First word of the featured solution becomes the headline accent.
  const accentWord = study.featuredSolution.split(" ")[0];

  const facts = [
    { value: study.industry, label: "Industry" },
    { value: study.sapPath, label: "SAP path" },
    { value: study.employees, label: "Employees" },
    { value: study.region, label: "Region" },
  ];

  return (
    <>
      <BreadcrumbJsonLd path={`/case-studies/${study.slug}/`} name={study.client} />
      <PageHero
        route={`/case-studies/${study.slug}/`}
        eyebrow={study.industry}
        headline={study.client}
        accentWord={accentWord}
        subhead={study.featuredSolution}
        media={<HeroMotif icon={practiceIcon("sap-enterprise-solutions")} />}
      />

      {/* FACTS STRIP */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="At a glance"
              lead="The shape of the engagement — industry, SAP path, scale and reach."
            >
              The engagement at a <Accent>glance</Accent>.
            </SectionHeading>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {facts.map((f) => (
              <StaggerItem key={f.label} className="h-full">
                <Card className="h-full">
                  <p className="label-caps text-gold">{f.label}</p>
                  <p className="mt-3 text-h3 font-bold leading-tight text-foreground">{f.value}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* THE CHALLENGE */}
      <Section tone="white">
        <Container>
          <Reveal className="max-w-3xl">
            <SectionHeading eyebrow="The challenge">
              Where they <Accent>started</Accent>.
            </SectionHeading>
            <p className="mt-6 text-lg leading-relaxed text-foreground-muted md:text-xl">{study.scenario}</p>
          </Reveal>
        </Container>
      </Section>

      {/* WHAT WE DELIVERED */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="What we delivered"
              lead="The outcomes we built — and the SAP components that delivered them."
            >
              What we <Accent>delivered</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={study.benefits.map((b) => ({ title: b }))} columns={2} />
          <Reveal className="mt-10">
            <p className="label-caps text-gold">Solution components</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {study.solution.map((s) => (
                <span key={s} className="glass-pill px-4 py-2 text-sm font-medium text-foreground">
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* PROOF BAND — differentiator + outcome */}
      <Section tone="navy" className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07]">
          <div className="absolute -right-24 top-10 h-[30rem] w-[30rem] origin-center rotate-45 border-[64px] border-gold-on-brand" />
        </div>
        <Container>
          <Reveal className="mb-10 max-w-2xl">
            <Eyebrow onDark>The difference</Eyebrow>
            <h2 className="mt-5 text-h2 font-bold">
              Why it <Accent>mattered</Accent>.
            </h2>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-2">
            <StaggerItem className="h-full">
              <Card tone="navy" bezel={false} className="h-full">
                <p className="label-caps text-gold-on-brand">Our differentiator</p>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-on-brand">{study.differentiator}</p>
              </Card>
            </StaggerItem>
            {study.outcome ? (
              <StaggerItem className="h-full">
                <Card tone="navy" bezel={false} className="h-full">
                  <p className="label-caps text-gold-on-brand">The outcome</p>
                  <p className="mt-4 text-[1.05rem] leading-relaxed text-on-brand">{study.outcome}</p>
                </Card>
              </StaggerItem>
            ) : null}
          </Stagger>
        </Container>
      </Section>

      <CtaSection
        eyebrow="Case study"
        heading={
          <>
            Discuss a similar <Accent>transformation</Accent>.
          </>
        }
        body="Tell us where you are today. We'll map the SAP path, the components and the proof — and outline your first move in a single conversation."
      />
    </>
  );
}
