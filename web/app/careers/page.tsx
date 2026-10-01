import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui/container";
import { Eyebrow, Accent, SectionHeading } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { HeroObject } from "@/components/sections/hero-media";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CtaSection } from "@/components/sections/cta-section";
import { social } from "@/content/site";

export const metadata = pageMetadata("/careers/", {
  title: "Careers",
  description:
    "Build a career with In2IT EBS — a performance-oriented culture built on people, with learning, growth and lasting impact.",
});

const whyWeSucceed = [
  {
    title: "A values-led mindset",
    body: "A customer-oriented mindset driven by our core values — customer focus, inclusion, accountability, integrity, teamwork, innovation, open communication, enthusiasm and empowerment.",
  },
  {
    title: "Knowledge that's shared",
    body: "Knowledge management that makes business systems and process documentation available to everyone, promoting continuous learning across our teams.",
  },
  {
    title: "Talent that's developed",
    body: "Recruiting, developing and retaining talent through coaching, extensive training, fair compensation and effective talent management.",
  },
];

export default function CareersPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/careers/" />
      <PageHero
        eyebrow="Careers"
        headline="Build a career with endless"
        accentWord="opportunities."
        subhead="Are you ready to thrive in a welcoming, diverse and open environment where you can keep learning, growing and making a lasting impact? You've found your destination."
        cta={false}
        media={<HeroObject name="pages/careers" />}
        frame={false}
      />

      {/* OUR CULTURE */}
      <Section tone="light">
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <SectionHeading
              eyebrow="Our culture"
              lead="Our performance-oriented culture and responsible approach are the foundations of our success. We keep work appealing and let people find their own rhythm — because creativity, dedication and performance are what our business depends on. We encourage achievement through collaboration and innovation."
            >
              A performance-oriented culture, built on <Accent>people</Accent>.
            </SectionHeading>
          </Reveal>

          <Reveal delay={0.1} className="mb-12 max-w-3xl">
            <Card tone="white" bezel>
              <h3 className="text-h3 font-bold text-foreground">Diversely united</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-foreground-muted">
                Our team comes from many walks of life. In2IT EBS is committed to equality of opportunity, fairness,
                mutual respect and dignity at work for all — valuing differences across disability, sexual orientation,
                race, ethnicity, age, thinking styles, gender and religion.
              </p>
            </Card>
          </Reveal>

          <Reveal delay={0.15} className="mb-8 max-w-2xl">
            <Eyebrow>Why we succeed</Eyebrow>
          </Reveal>
          <FeatureGrid features={whyWeSucceed} columns={3} />
        </Container>
      </Section>

      {/* CURRENT OPENINGS */}
      <Section tone="white" id="openings">
        <Container>
          <Reveal className="mb-10 max-w-2xl">
            <SectionHeading eyebrow="Current openings">
              Open <Accent>roles</Accent>.
            </SectionHeading>
          </Reveal>
          <Reveal delay={0.1} className="max-w-3xl">
            <Card tone="light" bezel>
              <p className="text-[0.95rem] leading-relaxed text-foreground-muted">
                Vacancies and applications are not managed through this website yet. Visit our official LinkedIn page
                for company updates. Do not send CVs or sensitive personal documents through the business enquiry form.
              </p>
              <div className="mt-6">
                <Button href={social.linkedin} variant="primary" withArrow>
                  In2IT EBS on LinkedIn
                </Button>
              </div>
            </Card>
          </Reveal>
        </Container>
      </Section>

      <CtaSection
        eyebrow="Join us"
        heading={
          <>
            Ready to build your <Accent>career</Accent> with us?
          </>
        }
        body="Explore our people, work and company updates on our official LinkedIn page."
        ctaLabel="Visit our LinkedIn page"
        ctaHref={social.linkedin}
      />
    </>
  );
}
