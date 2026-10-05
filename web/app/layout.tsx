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
import { ChatWidget } from "@/components/chat/chat-widget";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "In2IT EBS — Enterprise transformation, delivered globally",
    template: "%s · In2IT EBS",
  },
  description:
    "10+ years of enterprise transformation, delivered globally. SAP Gold Partner with adjacent strength across Salesforce, Workday, Oracle, Microsoft, cloud and application services.",
};

/** One theme since 2026-09-15 (dark mode and its cookie script were removed at the owner's request). */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={plex.variable}>
      <body className="grain">
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
            <ChatWidget />
          </SiteChrome>
        </RegionProvider>
      </body>
    </html>
  );
}
