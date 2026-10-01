import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui/container";
import { Eyebrow, Accent, SectionHeading } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { HeroObject } from "@/components/sections/hero-media";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaSection } from "@/components/sections/cta-section";
import { PartnerEcosystem } from "@/components/sections/partner-ecosystem";
import { partnerCategories } from "@/content/partner-ecosystem";
import { HomePartners } from "@/components/sections/home-partners";

export const metadata = pageMetadata("/partners/", {
  title: "Partners",
  description:
    "Strategic alliances across platforms, hyperscalers, data and specialist vendors, with certified delivery and pre-built integration accelerators.",
});

/** Why our alliances matter — Blueprint §10.3. */
const value = [
  {
    title: "Certified delivery teams",
    body: "Consultants accredited on the platforms we partner with — so capability is proven, not promised, on day one.",
  },
  {
    title: "Joint go-to-market roadmaps",
    body: "Shared roadmaps with our partners keep our delivery aligned to where each platform is heading, not where it has been.",
  },
  {
    title: "Pre-built integration accelerators",
    body: "Tested connectors and accelerators across the ecosystem compress integration effort and de-risk the timeline.",
  },
];

export default function PartnersPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/partners/" />
      <PageHero
        eyebrow="Partners"
        headline="Strategic alliances that"
        accentWord="extend our reach."
        subhead="A partner ecosystem spanning application platforms, hyperscalers, data and specialist vendors — chosen so we can transform and run your landscape end-to-end, not piece by piece."
        media={<HeroObject name="pages/partners" />}
        frame={false}
      />

      {/* PARTNER ECOSYSTEM */}
      <HomePartners />
      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Our ecosystem"
              lead="Four categories of alliance, each chosen for the role it plays in delivery — from the platforms we run to the specialists that extend the stack."
            >
              Partners across the <Accent>stack</Accent>.
            </SectionHeading>
          </Reveal>
          <PartnerEcosystem categories={partnerCategories} />
        </Container>
      </Section>

      {/* WHY OUR ALLIANCES MATTER */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Why our alliances matter"
              lead="A logo on a slide is not a partnership. Ours earn their place through certified people, shared direction and reusable engineering."
            >
              Alliances that pull their <Accent>weight</Accent>.
            </SectionHeading>
          </Reveal>
          <FeatureGrid features={value} columns={3} />
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
              Backed by the right <Accent>names</Accent>.
            </h2>
          </Reveal>
          <Stagger className="grid gap-5 md:grid-cols-3">
            {[
              { value: "12+", label: "Strategic partners" },
              { value: "SAP Gold", label: "Partner" },
              { value: "Multi-cloud", label: "Delivery" },
            ].map((s) => (
              <StaggerItem key={s.label} className="h-full">
                <Card tone="navy" bezel={false} className="h-full">
                  <div className="text-[2.5rem] font-bold leading-none text-on-brand">{s.value}</div>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-gold-on-brand">{s.label}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <CtaSection
        eyebrow="Partners"
        heading={
          <>
            Find the right partner <Accent>mix</Accent>.
          </>
        }
        body="Tell us what you're trying to transform. We'll assemble the alliance mix — platforms, clouds, data and specialists — that gets you there fastest."
      />
    </>
  );
}
