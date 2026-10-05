import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { ServiceHeroMark } from "@/components/sections/service-icon";
import { HeroImage, HeroObject, hasHeroImage } from "@/components/sections/hero-media";
import { V2Hero, V2StickyNav, V2Overview, V2Section, V2Bento, V2Rail, V2Closing } from "@/components/sections/v2";
import { partnerPages } from "@/content/partner-pages";
import { getCms, getPartner } from "@/lib/cms/content";
import { heroPicture } from "@/components/sections/hero-override";

export async function generateStaticParams() {
  return partnerPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPartner(slug);
  if (!page) return pageMetadata(`/partners/${slug}/`, { title: "Partner" });
  return pageMetadata(`/partners/${page.slug}/`, { title: page.name, description: page.metaDescription });
}

/** One page per partner in the Partners menu, carrying the existing site's copy, in the approved design. */
export default async function PartnerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPartner(slug);
  if (!page) notFound();
  const [lead, ...rest] = page.intro;
  const heroKey = `partners/${page.slug}`;
  const others = (await getCms()).partners.filter((other) => other.slug !== page.slug);
  const anchors = [
    { id: "overview", label: "Overview" },
    ...(page.sections?.length ? [{ id: "areas", label: "What they offer" }] : []),
    { id: "related", label: "Our partners" },
    { id: "talk", label: "Talk to us" },
  ];

  return (
    <>
      <BreadcrumbJsonLd path={`/partners/${page.slug}/`} name={page.name} />
      <V2Hero
        route={`/partners/${page.slug}/`}
        path={[{ label: "Partners", href: "/partners/" }, { label: page.name }]}
        title={page.title ?? page.name}
        lead={lead}
        media={heroPicture(
          page.heroImage,
          hasHeroImage(heroKey) ? (
            <HeroObject name={heroKey} />
          ) : page.logo ? (
            <HeroImage src={page.logo} alt={`${page.name} logo`} kind="logo" className="p-8" />
          ) : (
            <ServiceHeroMark icon="handshake" />
          ),
          `${page.name} logo`,
        )}
      />
      <V2StickyNav anchors={anchors} />
      <V2Overview eyebrow="Partners" heading={`About ${page.name}`} paragraphs={rest.length ? rest : [lead]} />
      {page.sections?.length ? (
        <V2Section id="areas" eyebrow={page.name} heading="What they offer.">
          <V2Bento items={page.sections.map((s) => ({ title: s.title, body: s.body, bullets: s.bullets }))} />
        </V2Section>
      ) : null}
      <V2Rail
        eyebrow="Our partners"
        heading="The platforms and vendors we work with."
        items={[
          { label: "All partners", href: "/partners/" },
          ...others.map((o) => ({ label: o.name, href: `/partners/${o.slug}/` })),
        ]}
      />
      <V2Closing
        body={`Tell us where ${page.name} fits in your landscape and what needs to change. We will map the first move in a single conversation.`}
      />
    </>
  );
}
