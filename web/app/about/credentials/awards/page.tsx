import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { V2Hero, V2Section, V2Closing } from "@/components/sections/v2";
import { HeroFigure } from "@/components/sections/hero-figure";
import { heroPicture } from "@/components/sections/hero-override";
import { AwardsGrid, AccreditationList } from "@/components/sections/awards";
import { awards } from "@/content/awards";

export const metadata = pageMetadata("/about/credentials/awards/", {
  title: "Awards and certificates",
  description: "The certificate behind every award and accreditation In2IT EBS claims — photographed, not paraphrased.",
});

/**
 * THE CERTIFICATE WALL.
 *
 * ── WHY THIS IS A PAGE AND NOT A SECTION ─────────────────────────────────────────────────────
 * It used to sit inside /about/credentials/, which made that page 9,148 pixels — the longest on
 * the site by a clear margin, and most of the excess was here. Five certificate photographs on
 * 3:4 tiles are roughly sixteen hundred pixels of scrolling, and they sat between the appraisal
 * cards and the security posture, so a buyer looking for "what do you not claim" had to scroll
 * past a photo wall to reach it.
 *
 * The split is not a tidy-up. Evidence and position are two different reading jobs: a buyer
 * checking a designation wants the list, and a bid team assembling a submission wants the
 * photographs. The parent page keeps the claims; this page keeps the proof, one link away, and
 * neither one buries the other.
 *
 * Nothing is hidden by the move. Every certificate that was on the parent page is here in the
 * same order, and the parent links to it from the section where the awards are named.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */
export default function AwardsPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/about/credentials/awards/" name="Awards and certificates" />
      <V2Hero
        route="/about/credentials/awards/"
        path={[
          { label: "About", href: "/about/" },
          { label: "Credentials", href: "/about/credentials/" },
          { label: "Awards and certificates" },
        ]}
        title="The certificate, not the claim."
        lead="Every award and accreditation on the credentials page, with the document behind it. We publish the photograph rather than the name, because a name is a claim and a certificate is evidence."
        media={heroPicture(
          "/hero/about-credentials-awards.webp",
          <HeroFigure figureKey="about/awards" />,
          "Awards and certificates",
        )}
      />

      <V2Section
        id="recognition"
        eyebrow="Recognised by SAP"
        heading={`${awards.length} partner awards, each with its certificate`}
        tone="canvas"
      >
        <div className="max-w-measure space-y-5 text-foreground-muted">
          <p>
            A partner award says the vendor has looked at our work and formed a view. That is worth something. It is not
            the same as a client reference, and the client work is on its own page.
          </p>
          <p>
            If you need any of these as a file for a submission, ask Alliances and you will have the original rather
            than a screenshot of this page.
          </p>
        </div>
      </V2Section>

      <AwardsGrid />
      <AccreditationList />

      <V2Section id="back" eyebrow="The rest of the picture" heading="Where these sit" tone="subtle">
        <div className="max-w-measure space-y-5 text-foreground-muted">
          <p>
            <Link
              href="/about/credentials/"
              className="inline-block min-h-6 font-semibold text-action underline-offset-4 hover:underline"
            >
              Credentials
            </Link>{" "}
            carries the partnerships and appraisals these certificates evidence, our security and audit posture, and the
            designations we deliberately do not claim.
          </p>
          <p>
            <Link
              href="/about/where-we-stand/"
              className="inline-block min-h-6 font-semibold text-action underline-offset-4 hover:underline"
            >
              Where we stand
            </Link>{" "}
            is the separate question of what we can actually build, capability by capability, including the ones where
            the honest status is that we do not do it.
          </p>
        </div>
      </V2Section>

      <V2Closing
        eyebrow="Alliances"
        heading="Need one of these for a bid?"
        body="Alliances holds the originals, including the current validity dates, and can send the file the same day."
        ctaHref="/contact/"
      />
    </>
  );
}
