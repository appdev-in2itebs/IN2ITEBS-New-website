import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";
import { AccreditationList, AwardsGrid } from "@/components/sections/awards";
import { HeroObject } from "@/components/sections/hero-media";
import { awardsIntro, awardsTitle } from "@/content/awards";

export const metadata = pageMetadata("/accreditation-awards/", {
  title: awardsTitle,
  description: "Published SAP partner awards and organisational memberships from In2IT EBS records.",
});

/**
 * Accreditation & awards — the existing site's /accreditation-awards/ page, kept at its own URL so
 * the address, the order and the content all match it rather than being folded into /about/.
 *
 * The page runs exactly as that one does: the title, its one-line ambition statement, the five
 * award certificates two to a row with each title above its photograph, and then the quality
 * statement followed by the five standards with their marks. Everything renders from
 * `content/awards.ts`, which holds the copy verbatim.
 */
export default function AccreditationAwardsPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/accreditation-awards/" name={awardsTitle} />
      <PageHero
        route="/accreditation-awards/"
        eyebrow="Awards & recognition"
        headline={awardsTitle}
        subhead={awardsIntro}
        media={<HeroObject name="about/accreditation" />}
        frame={false}
      />
      <AwardsGrid />
      <AccreditationList />
      <CtaSection />
    </>
  );
}
