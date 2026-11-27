import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { Testimonials } from "@/components/sections/testimonials";
import { clients } from "@/content/clients";
import { EcosystemMetrics } from "@/components/sections/ecosystem-metrics";
import { HomePartners } from "@/components/sections/home-partners";
import { HomeServices } from "@/components/sections/home-services";
import { IndustryStrip } from "@/components/sections/industry-strip";
import { HomeManifesto } from "@/components/sections/home-manifesto";
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
      // 26-27 Nov 2026 (owner): the band shows on the first screen without scrolling, slimmer,
      // with no boxes round the logos. Both labels are links (our clients' stories on the left,
      // the partner ecosystem on the right), and the hero leaves room for this band
      // (brand-hero.tsx, --client-band-height).
      <section
        aria-label="Selected clients"
        className="relative border-b border-border-subtle bg-logo-surface py-2.5 md:py-3"
      >
        <Container>
          <div className="mb-1.5 flex items-center justify-between gap-x-6">
            <Link
              href="/case-studies/"
              className="inline-flex min-h-7 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold hover:underline hover:decoration-gold/40 hover:underline-offset-4 md:text-sm md:tracking-[0.12em]"
            >
              <span className="sm:hidden">Our Clients</span>
              <span className="hidden sm:inline">Our Clients &amp; Their Stories</span>
              <ArrowRight size={14} aria-hidden />
            </Link>
            <Link
              href="/about/partnerships/"
              className="inline-flex min-h-7 items-center gap-1.5 text-xs font-semibold text-gold underline decoration-gold/40 underline-offset-4 md:text-sm"
            >
              <span className="hidden sm:inline">Partners &amp; Technology Ecosystem</span>
              <span className="sm:hidden">Partners</span>
              <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
          <LogoMarquee clients={clients} />
        </Container>
      </section>
    ),
    // Added 18 November 2026, and it ships third. Everything else on this page describes a
    // capability; this band makes four claims a competitor structurally cannot make, each linking
    // to the thing itself rather than to a page about it. See home-manifesto.tsx.
    manifesto: <HomeManifesto />,
    // Added 18 November 2026. The homepage named no industry anywhere above the fold, while the
    // nine industry pages were the strongest copy on the site with nothing routing to them. One
    // band, one click. See components/sections/industry-strip.tsx.
    industries: <IndustryStrip />,
    // The existing site puts the service grid straight under the client ribbon; so do we.
    services: <HomeServices />,
    // Added 12 November 2026. The two diagnostics had no path to them from anywhere a visitor
    // starts; see content/tools.ts. They sit directly under the service grid because that is
    // where somebody is already deciding whether we do the thing they need.
    tools: <ToolsBand />,
    metrics: <EcosystemMetrics stats={cms.stats} />,
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
