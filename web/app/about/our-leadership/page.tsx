import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Reveal } from "@/components/motion/reveal";
import { LinkedInMark } from "@/components/ui/linkedin-mark";
import { HeroObject } from "@/components/sections/hero-media";
import { V2Hero, V2StickyNav, V2Section, V2Rail, V2Closing } from "@/components/sections/v2";
import { getCms } from "@/lib/cms/content";

export const metadata = pageMetadata("/about/our-leadership/", {
  title: "Our Leadership",
  description:
    "Meet our leaders: Rudra Shankar Shatapathy, Managing Director of In2IT EBS, who has provided vision and dedicated leadership across multiple geographies.",
});

/**
 * Our Leadership — the existing site's /our-leadership/ page, which today profiles the Managing
 * Director alone under "Meet Our Leaders". The profile text and photograph are that page's own
 * (shared through content/leadership.ts); the wider team lives on /about/#leadership.
 */
export default async function OurLeadershipPage() {
  const { leadership } = await getCms();
  const rudra = leadership.find((leader) => leader.slug === "rudra-shankar-shatapathy");
  return (
    <>
      <BreadcrumbJsonLd path="/about/our-leadership/" name="Our Leadership" />
      <V2Hero
        route="/about/our-leadership/"
        path={[{ label: "About", href: "/about/" }, { label: "Our Leadership" }]}
        title="Our Leadership"
        lead="Meet Our Leaders"
        media={<HeroObject name="about/our-leadership" />}
        exploreId="leaders"
      />
      <V2StickyNav
        anchors={[
          { id: "leaders", label: "Meet Our Leaders" },
          { id: "related", label: "More about us" },
          { id: "talk", label: "Talk to us" },
        ]}
      />
      <V2Section id="leaders" eyebrow="Meet Our Leaders" heading="Led from the front.">
        {rudra ? (
          <Reveal>
            <article className="theme-on-brand relative flex flex-col gap-6 overflow-hidden rounded-feature bg-brand p-8 text-on-brand sm:flex-row sm:gap-8 md:p-10">
              <div aria-hidden className="pointer-events-none absolute inset-0 hero-ambient opacity-70" />
              {rudra.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={rudra.photo}
                  alt={rudra.name}
                  className="relative h-44 w-44 shrink-0 rounded-surface bg-logo-surface object-cover object-top"
                />
              ) : null}
              <div className="relative flex flex-col gap-3">
                <div>
                  <h3 className="text-[clamp(1.6rem,2.4vw,2.2rem)] font-bold leading-tight tracking-[-0.03em]">
                    {rudra.name}
                  </h3>
                  <span className="label-caps text-gold-on-brand">{rudra.title}</span>
                </div>
                <p className="max-w-[78ch] text-[0.95rem] leading-relaxed text-on-brand/85 md:text-base">{rudra.bio}</p>
                {rudra.linkedin ? (
                  <a
                    href={rudra.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold-on-brand"
                  >
                    <LinkedInMark className="h-4 w-4 fill-current" /> LinkedIn
                  </a>
                ) : null}
              </div>
            </article>
          </Reveal>
        ) : null}
      </V2Section>
      <V2Rail
        eyebrow="About"
        heading="More about us."
        items={[
          { label: "The wider leadership team", href: "/about/#leadership" },
          { label: "Who We Are?", href: "/about/who-we-are/" },
          { label: "Accreditation", href: "/accreditation-awards/" },
          { label: "Customer Stories", href: "/about/customer-stories/" },
        ]}
      />
      <V2Closing body="Tell us where you want to go. We will bring the platforms, the people and the proof, and map your first move in a single conversation." />
    </>
  );
}
