import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { EcosystemMetrics } from "@/components/sections/ecosystem-metrics";
import { HomePartners } from "@/components/sections/home-partners";
import { HomeServices } from "@/components/sections/home-services";
import { HomeTeam } from "@/components/sections/home-team";
import { YoutubeRibbon } from "@/components/sections/youtube-ribbon";
import { Testimonials } from "@/components/sections/testimonials";
import { HomeNews } from "@/components/sections/home-news";
import { OfficeMap } from "@/components/sections/office-map";
import { BrandHero } from "@/components/sections/brand-hero";
import { clients } from "@/content/clients";

export const metadata = pageMetadata("/", {
  title: { absolute: "In2IT EBS — Enterprise transformation under control" },
  description:
    "SAP-led enterprise transformation, advisory, digital engineering and managed operations across more than 30 countries.",
});

export default function HomePage() {
  return (
    <>
      <BrandHero />

      <section
        aria-label="Selected clients"
        className="relative border-b border-border-subtle bg-surface py-8 md:py-10"
      >
        <Container>
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Trusted in complex operating environments
          </p>
          <LogoMarquee clients={clients} />
          <div className="mt-8 flex flex-wrap items-center justify-end gap-4">
            <Link
              href="/partners/"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-gold underline decoration-gold/40 underline-offset-4"
            >
              Partners &amp; technology ecosystem
            </Link>
          </div>
        </Container>
      </section>

      {/* The existing site puts the service grid straight under the client ribbon; so do we. */}
      <HomeServices />

      <EcosystemMetrics />

      <HomePartners />

      {/* The leadership sits directly under the ecosystem it is accountable for. */}
      <HomeTeam />

      {/* The closing run mirrors the existing site's order: the client quotes, then the channel's
          latest uploads, then the article strip right above the footer. */}
      <Testimonials />

      <YoutubeRibbon />

      <HomeNews />

      {/* The footprint closes the page: every office on one map, under the news strip. */}
      <OfficeMap />
    </>
  );
}
