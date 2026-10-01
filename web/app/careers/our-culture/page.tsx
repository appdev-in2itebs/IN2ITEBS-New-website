import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { HeroObject } from "@/components/sections/hero-media";
import { V2Hero, V2StickyNav, V2Overview, V2Section, V2Bento, V2Rail, V2Closing } from "@/components/sections/v2";

export const metadata = pageMetadata("/careers/our-culture/", {
  title: "Our Culture",
  description:
    "At In2IT EBS, our performance-oriented culture and responsible approach are the foundations of our success.",
});

/** Our Culture — the existing site's /our-culture/ page, section for section, in the approved design. */
const reasons = [
  {
    title: "Customer-oriented mindset",
    body: "Driven by our core values: customer focus, inclusion, accountability, integrity, teamwork, innovation, open communication, enthusiasm, and empowerment.",
  },
  {
    title: "Knowledge management",
    body: "To make the business systems and process documentation available to all our employees and promote continuous learning and knowledge sharing.",
  },
  {
    title: "Recruit, develop, and retain talent",
    body: "By continuously attracting and coaching associates, providing extensive training programs, offering fair compensation, and effective talent management.",
  },
];

export default function OurCulturePage() {
  return (
    <>
      <BreadcrumbJsonLd path="/careers/our-culture/" name="Our Culture" />
      <V2Hero
        path={[{ label: "Career", href: "/careers/" }, { label: "Our Culture" }]}
        title="Our Culture"
        lead="At In2IT EBS, our performance-oriented culture and responsible approach are the foundations of our success. We strive to maintain a fun and positive work environment, encouraging our employees to enjoy themselves at work and think outside the box."
        media={<HeroObject name="careers/our-culture" />}
      />
      <V2StickyNav
        anchors={[
          { id: "overview", label: "Overview" },
          { id: "united", label: "Diversely United" },
          { id: "success", label: "Reasons of Success" },
          { id: "related", label: "Career" },
          { id: "talk", label: "Talk to us" },
        ]}
      />
      <V2Overview
        eyebrow="Our Culture"
        heading="Work has to be appealing."
        paragraphs={[
          "We are firm believers in individual interest and the need to let employees find their own rhythm in the work they do. Truth is work has to be appealing and interest must exist in order to gain maximum quality in one's work force and we have experienced, cultivated, and motivated people to find their calling in the profession and achieve great success.",
          "We recognize that our business depends on the creativity, dedication, and performance of our employees. We encourage our employees to focus on achievement through collaboration and innovation.",
        ]}
      />
      <V2Overview
        id="united"
        eyebrow="Our people"
        heading="Diversely United"
        tone="subtle"
        paragraphs={[
          "At In2IT EBS, we value individuals on a personal level. Our team is composed of employees from many walks of life, bringing a variety of experiences, perspectives, and ideas to the table.",
          "In2IT EBS is committed to equality of opportunity, fairness, work and lifestyle, mutual respect, and dignity at work for all associates. In2IT EBS values differences including disability, sexual orientation, race, ethnicity, age, thinking styles, gender, and religion.",
        ]}
      />
      <V2Section id="success" eyebrow="Why we succeed" heading="Reasons of Success for In2IT EBS" tone="canvas">
        <V2Bento items={reasons} />
      </V2Section>
      <V2Rail
        eyebrow="Career"
        heading="Join our team."
        items={[
          { label: "Events & Celebrations", href: "/careers/events-celebrations/" },
          { label: "Current Openings", href: "/careers/current-openings/" },
          { label: "Careers at In2IT EBS", href: "/careers/" },
        ]}
      />
      <V2Closing
        eyebrow="Join our team"
        heading="Build a career with endless opportunities."
        body="Are you prepared to excel in a welcoming, diverse, and open environment where you can continuously learn, develop, and make a lasting impact?"
        ctaLabel="Current Openings"
        ctaHref="/careers/current-openings/"
      />
    </>
  );
}
