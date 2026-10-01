import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Testimonials } from "@/components/sections/testimonials";
import { HeroObject } from "@/components/sections/hero-media";
import { V2Hero, V2StickyNav, V2Section, V2Bento, V2Rail, V2Closing, type BentoItem } from "@/components/sections/v2";

export const metadata = pageMetadata("/about/customer-stories/", {
  title: "Customer Stories",
  description:
    "Clients feedback and customer success stories: Welspun Group, IBG, WeWork and ShareChat on working with In2IT EBS.",
});

/**
 * Customer Stories — the existing site's /customer-stories/ page: its "Clients Feedback / What
 * People's Say" carousel (the same five quotes, verbatim, from content/testimonials.ts) and the
 * four customer success stories that page links to, in the approved design.
 */
const stories: BentoItem[] = [
  {
    title: "Welspun Group: Building a Supportive Culture for Employees to Grow and Develop their Skills",
    body: "Improving Employee Experience by Centralizing and Automating HR Processes with SAP® SuccessFactors® Solutions.",
    iconImage: "/stories/wel-logo-1024x205.png",
    href: "/about/customer-stories/welspun/",
    linkLabel: "Read the story",
  },
  {
    title: "IBG Goes Live with SAP SuccessFactors!",
    body: "We're excited to announce the successful go-live of SAP SuccessFactors at IBG, with In2IT EBS as the digital transformation partner. With the implementation of 4 key modules—Recruitment, Onboarding, PMGM, and Time Management—IBG is set to redefine its HR operations. Watch Neeraj Pandey, Vice president-IBG as he congratulates both teams for their dedication and collaborative success.",
    href: "https://in2itebs.com/ibg-goes-live-with-sap-successfactors/",
    linkLabel: "Watch on in2itebs.com",
  },
  {
    title: "WeWork: RISE with SAP S/4HANA",
    image: "/stories/WEWORK-RISE-with-SAP-S4HANA_page-0001-1.jpg",
    href: "https://in2itebs.com/wp-content/uploads/2025/03/WEWORK-RISE-with-SAP-S4HANA-1.pdf",
    linkLabel: "Download PDF",
  },
  {
    title: "ShareChat: RISE with SAP S/4HANA",
    image: "/stories/sharchat.jpg",
    href: "https://in2itebs.com/wp-content/uploads/2025/03/SHARECHAT-RISE-with-SAP-S4HANA.pdf",
    linkLabel: "Download PDF",
  },
];

export default function CustomerStoriesPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/about/customer-stories/" name="Customer Stories" />
      <V2Hero
        path={[{ label: "About", href: "/about/" }, { label: "Customer Stories" }]}
        title="Customer Stories"
        lead="Clients Feedback: what people say about working with In2IT EBS, and the customer success stories behind it."
        media={<HeroObject name="about/customer-stories" />}
        exploreId="feedback"
      />
      <V2StickyNav
        anchors={[
          { id: "feedback", label: "Clients Feedback" },
          { id: "stories", label: "Success Stories" },
          { id: "related", label: "More about us" },
          { id: "talk", label: "Talk to us" },
        ]}
      />
      <div id="feedback">
        <Testimonials />
      </div>
      <V2Section
        id="stories"
        eyebrow="Customer Success Stories"
        heading="Customer Success Stories."
        note="Four engagements the existing site writes up in full."
      >
        <V2Bento items={stories} />
      </V2Section>
      <V2Rail
        eyebrow="About"
        heading="More about us."
        items={[
          { label: "Clients & Case Studies", href: "/case-studies/" },
          { label: "Who We Are?", href: "/about/who-we-are/" },
          { label: "Our Leadership", href: "/about/our-leadership/" },
          { label: "Accreditation", href: "/accreditation-awards/" },
        ]}
      />
      <V2Closing body="Tell us where you want to go. We will bring the platforms, the people and the proof, and map your first move in a single conversation." />
    </>
  );
}
