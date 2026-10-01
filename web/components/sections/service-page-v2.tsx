import { ServiceHeroMark, serviceIcon } from "@/components/sections/service-icon";
import { HeroImage, HeroObject, hasHeroImage } from "@/components/sections/hero-media";
import {
  V2Hero,
  V2StickyNav,
  V2Overview,
  V2Section,
  V2Bento,
  V2Rail,
  V2Closing,
  type BentoItem,
} from "@/components/sections/v2";
import { getServiceGroup, flattenItems, type ServicePage } from "@/content/legacy-services";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";

/** Every service page the existing site's menu lists, in the approved design (components/sections/v2.tsx). */
export function ServicePageV2({ page }: { page: ServicePage }) {
  const group = getServiceGroup(page.group);
  const title = page.title ?? page.name;
  const [lead, ...rest] = page.intro;
  const ownHero = `services/${page.slug}`;
  const heroKey = hasHeroImage(ownHero) ? ownHero : page.heroObject;
  const siblings = group ? flattenItems(group.items).filter((item) => item.href !== `/services/${page.slug}/`) : [];
  const groupIsThisPage = group?.href === `/services/${page.slug}/`;
  const anchors = [
    { id: "overview", label: "Overview" },
    ...(page.sections.length ? [{ id: "covers", label: page.sectionsHeading ? "Details" : "What it covers" }] : []),
    ...(siblings.length ? [{ id: "related", label: `More in ${group?.name ?? "Services"}` }] : []),
    { id: "talk", label: "Talk to us" },
  ];
  const items: BentoItem[] = page.sections.map((section) => ({
    title: section.title,
    body: section.body,
    bullets: section.bullets,
    iconImage: section.iconImage,
    icon: section.iconImage ? undefined : serviceIcon(section.icon),
    href: section.href,
  }));

  return (
    <>
      <V2Hero
        path={[
          { label: "Services", href: "/services/" },
          ...(group && !groupIsThisPage ? [{ label: group.name, href: group.href }] : []),
          { label: page.name },
        ]}
        title={title}
        lead={lead}
        media={
          heroKey ? (
            <HeroObject name={heroKey} />
          ) : page.image ? (
            <HeroImage src={page.image.src} alt={page.image.alt} />
          ) : (
            <ServiceHeroMark icon={page.icon} />
          )
        }
      />
      <V2StickyNav anchors={anchors} />
      <V2Overview
        eyebrow={group?.name ?? "Overview"}
        heading={page.introHeading ?? `About ${page.name}`}
        paragraphs={rest.length ? rest : [lead]}
        link={group && !groupIsThisPage ? { label: `${group.name} overview`, href: group.href } : undefined}
      />
      {page.sections.length ? (
        <V2Section
          id="covers"
          eyebrow={group?.name ?? "Services"}
          heading={page.sectionsHeading ?? `What ${page.name} covers.`}
        >
          <V2Bento items={items} />
          {page.closing?.length ? (
            <Reveal className="mt-12">
              {page.closing.map((paragraph) => (
                <p
                  key={paragraph}
                  className="max-w-[70ch] text-lg font-medium leading-relaxed text-foreground md:text-xl"
                >
                  {paragraph}
                </p>
              ))}
            </Reveal>
          ) : null}
        </V2Section>
      ) : page.closing?.length ? (
        <section className="bg-surface-subtle py-16">
          <Container>
            {page.closing.map((paragraph) => (
              <p
                key={paragraph}
                className="max-w-[70ch] text-lg font-medium leading-relaxed text-foreground md:text-xl"
              >
                {paragraph}
              </p>
            ))}
          </Container>
        </section>
      ) : null}
      {siblings.length ? (
        <V2Rail
          eyebrow={`More in ${group?.name}`}
          heading="Also in this group."
          items={[
            ...(group && !groupIsThisPage ? [{ label: `${group.name} overview`, href: group.href }] : []),
            ...siblings.map((item) => ({ label: item.label, href: item.href })),
          ]}
        />
      ) : null}
      <V2Closing
        body={`Tell us where ${page.name} fits in your landscape and what needs to change. We will map the first move in a single conversation.`}
      />
    </>
  );
}
