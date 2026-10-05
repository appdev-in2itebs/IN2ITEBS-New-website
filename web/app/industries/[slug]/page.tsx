import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { Accent, SectionHeading, Lead } from "@/components/ui/typography";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { ClientWall } from "@/components/sections/client-wall";
import { CtaSection } from "@/components/sections/cta-section";
import Image from "next/image";
import { industries, getIndustry } from "@/content/industries";
import { getClientsBySectors } from "@/lib/content";
import { getIndustryBody } from "@/content/industry-bodies";
import { legacyIndustries } from "@/content/legacy-industries";
import { getIndustry as getEditedIndustry } from "@/lib/cms/content";
import { LegacyIndustryPage } from "@/components/sections/legacy-industry-page";

export async function generateStaticParams() {
  // The existing site's fourteen industry pages sit beside the three-pillar sector pages; where a
  // slug is in both lists the existing site's page wins, as the menu links to it.
  const slugs = new Set([...legacyIndustries.map((i) => i.slug), ...industries.map((i) => i.slug)]);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const legacy = await getEditedIndustry(slug);
  if (legacy)
    return pageMetadata(`/industries/${slug}/`, {
      title: legacy.title ?? legacy.name,
      description: legacy.metaDescription,
    });
  const ind = getIndustry(slug);
  if (!ind) return pageMetadata(`/industries/${slug}/`, { title: "Industry" });
  return pageMetadata(`/industries/${slug}/`, {
    title: ind.name,
    description: ind.subhead,
  });
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const legacy = await getEditedIndustry(slug);
  if (legacy) return <LegacyIndustryPage industry={legacy} />;
  const ind = getIndustry(slug);
  if (!ind) notFound();

  const body = getIndustryBody(ind.slug);
  const clients = getClientsBySectors(ind.deckSectors);

  return (
    <>
      <BreadcrumbJsonLd path={`/industries/${ind.slug}/`} name={ind.name} />
      <PageHero
        route={`/industries/${ind.slug}/`}
        eyebrow="Industries"
        headline={ind.headline}
        accentWord={ind.accentWord}
        subhead={ind.subhead}
        media={
          <div className="relative h-full w-full overflow-hidden rounded-[calc(var(--radius-feature)-0.5rem)]">
            <Image
              src={`/stock/${ind.slug}.jpg`}
              alt={ind.name}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        }
      />

      {/* OVERVIEW + CAPABILITIES */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-3xl">
            <SectionHeading eyebrow="Sector overview">
              How we serve this <Accent>sector</Accent>.
            </SectionHeading>
            {body?.overview ? <Lead>{body.overview}</Lead> : null}
          </Reveal>
          {body?.features?.length ? <FeatureGrid features={body.features} columns={3} /> : null}
        </Container>
      </Section>

      {/* CLIENTS IN THIS SECTOR */}
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading eyebrow="Clients in this sector">
              Enterprises we have <Accent>served</Accent>.
            </SectionHeading>
          </Reveal>
          {clients.length ? (
            <ClientWall clients={clients} />
          ) : (
            <Reveal>
              <p className="max-w-measure text-lg leading-relaxed text-foreground-muted">
                Public enterprises in this sector appear under{" "}
                <Link href="/industries/government-psu/" className="font-semibold text-action">
                  Government &amp; PSUs
                </Link>
                .
              </p>
            </Reveal>
          )}
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
