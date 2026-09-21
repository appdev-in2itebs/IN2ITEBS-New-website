import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
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

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        <PageLoader />
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
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <ScrollDown />
        </RegionProvider>
      </body>
    </html>
  );
}
