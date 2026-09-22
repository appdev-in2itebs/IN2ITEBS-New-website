import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { sectorIcon } from "@/components/sections/hero-motif";
import { HeroImage, HeroMark } from "@/components/sections/hero-media";
import {
  V2Hero,
  V2StickyNav,
  V2Overview,
  V2Section,
  V2Bento,
  V2Logos,
  V2Rail,
  V2Closing,
  type BentoItem,
} from "@/components/sections/v2";
import { industriesMenu } from "@/content/nav";
import type { LegacyIndustry } from "@/content/legacy-industries";

/**
 * One template for the fourteen industry pages the existing site's menu lists: that page's copy
 * (content/legacy-industries.ts), its photographs and its "Our Customers" strip, in the approved
 * design (components/sections/v2.tsx).
 */
export function LegacyIndustryPage({ industry }: { industry: LegacyIndustry }) {
  const title = industry.title ?? industry.name;
  const [lead, ...rest] = industry.intro;
  const others = industriesMenu.filter((item) => item.href !== `/industries/${industry.slug}/`);
  const anchors = [
    { id: "overview", label: "Overview" },
    ...(industry.sections.length
      ? [{ id: "solutions", label: industry.sectionsHeading ? "Solutions" : "Where we help" }]
      : []),
    ...(industry.customers.length ? [{ id: "customers", label: "Our Customers" }] : []),
    { id: "related", label: "Other industries" },
    { id: "talk", label: "Talk to us" },
  ];
  const items: BentoItem[] = industry.sections.map((section) => ({
    title: section.title,
    body: section.body,
    bullets: section.bullets,
    offerings: section.offerings,
    image: section.image ? `/industries/${industry.slug}/${section.image}` : undefined,
  }));

  return (
    <>
      <BreadcrumbJsonLd path={`/industries/${industry.slug}/`} name={industry.name} />
      <V2Hero
        path={[{ label: "Industries", href: "/industries/" }, { label: industry.name }]}
        title={title}
        lead={lead}
        media={
          industry.image ? (
            <HeroImage src={`/industries/${industry.slug}/${industry.image}`} alt={title} />
          ) : (
            <HeroMark icon={sectorIcon(industry.slug)} />
          )
        }
      />
      <V2StickyNav anchors={anchors} />
      <V2Overview eyebrow={industry.name} heading={`About ${industry.name}`} paragraphs={rest.length ? rest : [lead]} />
      {industry.sections.length ? (
        <V2Section id="solutions" eyebrow={industry.name} heading={industry.sectionsHeading ?? "Where we help."}>
          <V2Bento items={items} featureFirst={!items.some((item) => item.image)} />
        </V2Section>
      ) : null}
      {industry.customers.length ? (
        <V2Section id="customers" eyebrow="Our Customers" heading="Our Customers" tone="canvas">
          <V2Logos
            logos={industry.customers.map((logo) => ({
              src: `/industries/${industry.slug}/${logo}`,
              alt: logo.replace(/[-_]\d+\.\w+$|\.\w+$/, "").replace(/[-_]/g, " "),
            }))}
          />
        </V2Section>
      ) : null}
      <V2Rail
        eyebrow="Industries"
        heading="Other industries we serve."
        items={others.map((i) => ({ label: i.label, href: i.href }))}
      />
      <V2Closing
        body={`Tell us where ${industry.name} sits in your plans and what needs to change. We will map the first move in a single conversation.`}
      />
    </>
  );
}
