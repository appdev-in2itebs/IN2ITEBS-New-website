import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/utils";
import { RegionProvider } from "@/components/layout/region-preference";
import { MeasurementSignals } from "@/components/layout/measurement-signals";
import { ScrollDown } from "@/components/layout/scroll-down";
import { MotionObserver } from "@/components/motion/motion-observer";
import { PageLoader } from "@/components/layout/page-loader";
import { SiteChrome } from "@/components/layout/site-chrome";
import { Announcement } from "@/components/layout/announcement";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/layout/google-tag-manager";

/**
 * IBM Plex Sans, bundled in the repository (app/fonts, SIL Open Font License) rather than fetched
 * from Google Fonts at build time: Google started returning font URLs next/font/google cannot parse,
 * which failed deploy #10 and every later build. One variable file covers weights 400 to 700.
 */
const plex = localFont({
  src: "./fonts/ibm-plex-sans-latin-wght-normal.woff2",
  weight: "100 700",
  style: "normal",
  variable: "--font-plex",
  display: "swap",
});

/**
 * Newsreader — the brand's display face, and until now the largest unimplemented part of the
 * brand system. globals.css aliased --font-display to --font-plex, so every heading on the site
 * rendered in the body face and the italic accent rule was unexecutable.
 *
 * Variable weight and a real italic, because the accent phrase in a title needs both.
 * `display: "swap"` so a slow font never blocks the headline.
 */
const newsreader = localFont({
  src: [
    { path: "./fonts/newsreader-latin-wght-normal.woff2", style: "normal", weight: "200 800" },
    { path: "./fonts/newsreader-latin-wght-italic.woff2", style: "italic", weight: "200 800" },
  ],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "In2IT EBS — Enterprise transformation, delivered globally",
    template: "%s · In2IT EBS",
  },
  description:
    "An SAP Gold Partner with 380+ SAP consultants across eleven practices, delivering enterprise platforms, advisory and digital engineering in more than thirty countries.",
  // Declared site-wide so aggregators and retrieval pipelines find the articles without scraping
  // the listing page and guessing at dates. See app/insights/feed.xml/route.ts.
  alternates: {
    types: { "application/rss+xml": [{ url: "/insights/feed.xml", title: "In2IT EBS — Insights" }] },
  },
};

/** One theme since 2026-09-15 (dark mode and its cookie script were removed at the owner's request). */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plex.variable} ${newsreader.variable}`}>
      <GoogleTagManager />
      <body className="grain">
        <GoogleTagManagerNoScript />
        <SiteChrome>
          <PageLoader />
        </SiteChrome>
        <RegionProvider>
          <MotionObserver />
          <MeasurementSignals />
          <OrganizationJsonLd />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-control focus:bg-action focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-on-action"
          >
            Skip to content
          </a>
          <SiteChrome>
            <Header />
          </SiteChrome>
          <main id="main">{children}</main>
          <SiteChrome>
            <Footer />
            <ScrollDown />
            <Announcement />
          </SiteChrome>
        </RegionProvider>
      </body>
    </html>
  );
}
