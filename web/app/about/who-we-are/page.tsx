import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { HeroObject } from "@/components/sections/hero-media";
import { V2Hero, V2StickyNav, V2Overview, V2Rail, V2Closing } from "@/components/sections/v2";

export const metadata = pageMetadata("/about/who-we-are/", {
  title: "Who we are",
  description:
    "In2IT EBS provides enterprise technology consulting, cloud, managed services and application engineering in India and internationally.",
});

export default function WhoWeArePage() {
  return (
    <>
      <BreadcrumbJsonLd path="/about/who-we-are/" name="Who we are" />
      <V2Hero
        route="/about/who-we-are/"
        path={[{ label: "About", href: "/about/" }, { label: "Who we are" }]}
        title="Who we are"
        lead="In2IT EBS provides enterprise technology consulting, cloud, managed services and application engineering in India and internationally."
        media={<HeroObject name="about/who-we-are" />}
      />
      <V2StickyNav
        anchors={[
          { id: "overview", label: "Overview" },
          { id: "related", label: "More about us" },
          { id: "talk", label: "Talk to us" },
        ]}
      />
      <V2Overview
        eyebrow="Who we are"
        heading="Invested in partners and consultants."
        paragraphs={[
          "In2IT EBS has taken the right plunge and invested in partners and consultants to provide tailor-made services whether be it cloud computing services or BPM. We work alongside our customers to help them streamline their processes, ensure optimal usage of deployed solutions, and deliver a high-performance customer-centric service.",
          "In2IT EBS aims to keep clients on the radar of continually evolving technology. We understand that technology is the enabler and that there is always scarcity of resources to embrace the right technology. What we do here in In2IT EBS is work with our clients from the planning stage; steering them through the investment phase, helping them tie-up with the best partners and then help all stakeholders manage their expectations, ensure checks and balances for timely delivery with financial prudence. In2IT EBS offers business intelligence and analytics as its core business solution, enabling clients to invest right.",
        ]}
      />
      <V2Rail
        eyebrow="About"
        heading="More about us."
        items={[
          { label: "Our Leadership", href: "/about/our-leadership/" },
          { label: "Accreditation", href: "/accreditation-awards/" },
          { label: "Case Studies", href: "/case-studies/" },
          { label: "Blogs & Articles", href: "/insights/" },
        ]}
      />
      <V2Closing body="Tell us where you want to go. We will bring the platforms, the people and the proof, and map your first move in a single conversation." />
    </>
  );
}
