import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { Testimonials } from "@/components/sections/testimonials";
import { clients } from "@/content/clients";
import { EcosystemMetrics } from "@/components/sections/ecosystem-metrics";
import { HomePartners } from "@/components/sections/home-partners";
import { HomeServices } from "@/components/sections/home-services";
import { ToolsBand } from "@/components/sections/tools-band";
import { HomeTeam } from "@/components/sections/home-team";
import { YoutubeRibbon } from "@/components/sections/youtube-ribbon";
import { HomeNews } from "@/components/sections/home-news";
import { OfficeMap } from "@/components/sections/office-map";
import { BrandHero } from "@/components/sections/brand-hero";
import { clientIdentityApproved } from "@/content/compliance";
import type { Cms } from "@/lib/cms/content";
import type { HomeSection } from "@/lib/builder/blocks";

/**
 * The homepage's own sections. Their order, which are shown, and any blocks between them come from
 * the layout saved in /admin/builder/home; without one the homepage keeps the shipped order.
 */
export function homeSections(cms: Cms): Record<HomeSection, ReactNode> {
  return {
    hero: <BrandHero slides={cms.homeHero} />,
    // Restored 12 November 2026 with the identity flag. The remediation commits hardcoded this to
    // null as an emergency brake; now that client names and logos are approved, the block comes
    // back and LogoMarquee itself honours content/compliance.ts.
    clients: (
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
              href="/about/partnerships/"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-gold underline decoration-gold/40 underline-offset-4"
            >
              Partners &amp; technology ecosystem
            </Link>
          </div>
        </Container>
      </section>
    ),
    // The existing site puts the service grid straight under the client ribbon; so do we.
    services: <HomeServices />,
    // Added 12 November 2026. The two diagnostics had no path to them from anywhere a visitor
    // starts; see content/tools.ts. They sit directly under the service grid because that is
    // where somebody is already deciding whether we do the thing they need.
    tools: <ToolsBand />,
    metrics: <EcosystemMetrics />,
    partners: <HomePartners />,
    // The leadership sits directly under the ecosystem it is accountable for.
    team: <HomeTeam leadership={cms.leadership} />,
    // The closing run mirrors the existing site's order: the client quotes, then the channel's
    // latest uploads, then the article strip right above the footer.
    testimonials: <Testimonials testimonials={cms.testimonials} />,
    youtube: clientIdentityApproved ? <YoutubeRibbon /> : null,
    news: <HomeNews insights={cms.articles} />,
    // The footprint closes the page: every office on one map, under the news strip.
    map: <OfficeMap offices={cms.offices} />,
  };
}
