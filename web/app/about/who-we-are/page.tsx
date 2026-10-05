import Image from "next/image";
import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { HeroObject } from "@/components/sections/hero-media";
import { V2Hero, V2StickyNav, V2Overview, V2Section, V2Rail, V2Closing } from "@/components/sections/v2";

export const metadata = pageMetadata("/about/who-we-are/", {
  title: "Who We Are?",
  description:
    "In2IT EBS is the leading authority in IT Consultancy, Cloud Computing, Managed Services, Application Development & Maintenance and more, in India and abroad.",
});

/**
 * Who We Are? — the existing site's /who-we-are/ page: its three paragraphs, its "We Connect,
 * Explore, Create, Empower, and Grow Together" statement and the five tiles under it, with that
 * page's own picture-icons (under /public/about), in the approved design.
 */
const tiles = [
  {
    title: "Vision",
    body: "People working together as a lean, global enterprise to make people's lives better through automotive and mobility leadership.",
    icon: "/about/mission.png",
  },
  {
    title: "Mission",
    body: "Utilize the power of Information Technology to bring smart, connected solutions to every business on earth.",
    icon: "/about/purpose.png",
  },
  {
    title: "Our Purpose",
    body: "We have big ambitions, and a growing sense of urgency to work with others and address world challenges no one can tackle alone.",
    icon: "/about/value.png",
  },
  {
    title: "Value",
    body: "We know it takes people with different ideas, strengths, interests, and cultural backgrounds to make our company succeed.",
    icon: "/about/support.png",
  },
  { title: "Support", body: "24/7", icon: "/about/support.png" },
];

export default function WhoWeArePage() {
  return (
    <>
      <BreadcrumbJsonLd path="/about/who-we-are/" name="Who We Are?" />
      <V2Hero
        route="/about/who-we-are/"
        path={[{ label: "About", href: "/about/" }, { label: "Who We Are?" }]}
        title="Who We Are?"
        lead="In2IT EBS is the leading authority in IT Consultancy, Cloud Computing, Managed Services, Application Development & Maintenance, Business Process Management, Technology Infrastructure Services, Program and Project Management and Future Edge Services to its Clientele in India and abroad."
        media={<HeroObject name="about/who-we-are" />}
      />
      <V2StickyNav
        anchors={[
          { id: "overview", label: "Overview" },
          { id: "together", label: "Grow Together" },
          { id: "related", label: "More about us" },
          { id: "talk", label: "Talk to us" },
        ]}
      />
      <V2Overview
        eyebrow="Who We Are?"
        heading="Invested in partners and consultants."
        paragraphs={[
          "In2IT EBS has taken the right plunge and invested in partners and consultants to provide tailor-made services whether be it cloud computing services or BPM. We work alongside our customers to help them streamline their processes, ensure optimal usage of deployed solutions, and deliver a high-performance customer-centric service.",
          "In2IT EBS aims to keep clients on the radar of continually evolving technology. We understand that technology is the enabler and that there is always scarcity of resources to embrace the right technology. What we do here in In2IT EBS is work with our clients from the planning stage; steering them through the investment phase, helping them tie-up with the best partners and then help all stakeholders manage their expectations, ensure checks and balances for timely delivery with financial prudence. In2IT EBS offers business intelligence and analytics as its core business solution, enabling clients to invest right.",
        ]}
      />
      <V2Section id="together" eyebrow="Who We Are?" heading="We Connect, Explore, Create, Empower, and Grow Together">
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((tile, index) => {
            const feature = index === 0;
            return (
              <StaggerItem key={tile.title} className="h-full">
                <article
                  className={
                    feature
                      ? "theme-on-brand relative flex h-full flex-col overflow-hidden rounded-feature bg-brand p-8 text-on-brand"
                      : "group relative flex h-full flex-col overflow-hidden rounded-feature border border-border-subtle/70 bg-surface p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-gold-soft/70 hover:shadow-glass-hover"
                  }
                >
                  {feature ? (
                    <div aria-hidden className="pointer-events-none absolute inset-0 hero-ambient opacity-70" />
                  ) : null}
                  <span
                    className={
                      feature
                        ? "relative inline-flex h-16 w-16 overflow-hidden rounded-surface bg-on-brand/95 p-2"
                        : "inline-flex h-16 w-16 overflow-hidden rounded-surface bg-logo-surface p-2 ring-1 ring-border-subtle"
                    }
                  >
                    <Image src={tile.icon} alt="" width={64} height={64} className="h-full w-full object-contain" />
                  </span>
                  <h3 className="relative mt-5 text-h3 font-bold">{tile.title}</h3>
                  <p
                    className={
                      tile.title === "Support"
                        ? "relative mt-3 text-3xl font-bold"
                        : feature
                          ? "relative mt-3 text-[0.95rem] leading-relaxed text-on-brand/85"
                          : "mt-3 text-[0.95rem] leading-relaxed text-foreground-muted"
                    }
                  >
                    {tile.body}
                  </p>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </V2Section>
      <V2Rail
        eyebrow="About"
        heading="More about us."
        items={[
          { label: "Our Leadership", href: "/about/our-leadership/" },
          { label: "Accreditation", href: "/accreditation-awards/" },
          { label: "Customer Stories", href: "/about/customer-stories/" },
          { label: "Blogs & Articles", href: "/insights/" },
        ]}
      />
      <V2Closing body="Tell us where you want to go. We will bring the platforms, the people and the proof, and map your first move in a single conversation." />
    </>
  );
}
