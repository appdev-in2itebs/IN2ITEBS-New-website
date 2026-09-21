import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";
import { AccreditationList, AwardsGrid } from "@/components/sections/awards";
import { awardsIntro, awardsTitle } from "@/content/awards";

export const metadata = pageMetadata("/accreditation-awards/", {
  title: awardsTitle,
  description:
    "SAP partner awards and the quality credentials behind them — ISO 20000-1, ISO 9001, ISO 27001, STPI accreditation and NASSCOM membership.",
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
      <PageHero eyebrow="Awards & recognition" headline={awardsTitle} subhead={awardsIntro} />
      <AwardsGrid />
      <AccreditationList />
      <CtaSection />
    </>
  );
}
