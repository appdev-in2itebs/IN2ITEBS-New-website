import { Briefcase, MapPin, ArrowUpRight } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { HeroMark } from "@/components/sections/hero-media";
import { V2Hero, V2StickyNav, V2Overview, V2Section, V2Rail, V2Closing } from "@/components/sections/v2";

export const metadata = pageMetadata("/careers/current-openings/", {
  title: "Current Openings",
  description:
    "Build a career with endless opportunities. Current openings at In2IT EBS Pvt Ltd across Bangalore, Bhubaneshwar, Chennai, Hyderabad and Mumbai.",
});

/**
 * Current Openings — the existing site's /careers/ page: its hero copy and the ten listed
 * openings, with the company, location and type each card shows there. "Apply Now" goes where
 * that page sends it, the posting on in2itebs.com.
 */
const openings: { title: string; type: string; location: string; href: string }[] = [
  {
    title: "SAP and Success Factors Consultant",
    type: "Walkin",
    location: "Hyderabad",
    href: "https://in2itebs.com/sap-and-success-factor-consultant/",
  },
  {
    title: "Manager - Finance",
    type: "Full Time",
    location: "Bhubaneshwar - Bangalore",
    href: "https://in2itebs.com/manager-finance/",
  },
  {
    title: "SuccessFactors Compensation Consultant",
    type: "Full Time",
    location: "Bangalore - Bhubaneshwar - Chennai, + 4 more",
    href: "https://in2itebs.com/careers/",
  },
  {
    title: "Assistant General Manager – IT Application Delivery",
    type: "Full Time",
    location: "Bhubaneshwar",
    href: "https://in2itebs.com/careers/",
  },
  {
    title: "Management Trainee",
    type: "Full Time",
    location: "Bangalore",
    href: "https://in2itebs.com/management-trainee/",
  },
  {
    title: "NetSuite Technical Consultant",
    type: "Full Time",
    location: "Bangalore",
    href: "https://in2itebs.com/netsuite-technical-consultant-3/",
  },
  {
    title: "Senior Consultant - SAP SD WM",
    type: "Full Time",
    location: "Bhubaneshwar - Mumbai - Bangalore",
    href: "https://in2itebs.com/senior-consultant-sap-sd-wm/",
  },
  { title: "Java Developer", type: "Full Time", location: "Bangalore", href: "https://in2itebs.com/java-developer/" },
  {
    title: "Associate Consultant - SuccessFactors RCM",
    type: "Full Time",
    location: "Bangalore - Bhubaneshwar - Chennai, + 3 more",
    href: "https://in2itebs.com/careers/",
  },
  {
    title: "Assistant General Manager – Business By Design",
    type: "Full Time",
    location: "Bangalore",
    href: "https://in2itebs.com/assistant-general-manager-business-by-design/",
  },
];

export default function CurrentOpeningsPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/careers/current-openings/" name="Current Openings" />
      <V2Hero
        path={[{ label: "Career", href: "/careers/" }, { label: "Current Openings" }]}
        title="Build a career with endless opportunities"
        lead="Are you prepared to excel in a welcoming, diverse, and open environment where you can continuously learn, develop, and make a lasting impact?"
        media={<HeroMark icon={Briefcase} />}
        cta={false}
        exploreId="openings"
      />
      <V2StickyNav
        anchors={[
          { id: "overview", label: "Join Our Team" },
          { id: "openings", label: "Current Openings" },
          { id: "related", label: "Career" },
          { id: "talk", label: "Talk to us" },
        ]}
      />
      <V2Overview
        eyebrow="Join Our Team"
        heading="If so, you've found your ideal destination"
        paragraphs={[
          "At In2IT EBS, we enable the growth of our employees on both personal and professional fronts, providing them with abundant opportunities to follow their unique journeys towards happiness and achieving excellence.",
          "We connect, explore, create, empower and grow together...",
        ]}
      />
      <V2Section id="openings" eyebrow="Current Openings" heading="Open roles.">
        <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {openings.map((job, index) => {
            const feature = index === 0;
            return (
              <StaggerItem key={job.title} className="h-full">
                <article
                  className={
                    feature
                      ? "theme-on-brand relative flex h-full flex-col overflow-hidden rounded-feature bg-brand p-7 text-on-brand"
                      : "group relative flex h-full flex-col overflow-hidden rounded-feature border border-border-subtle/70 bg-surface p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-gold-soft/70 hover:shadow-glass-hover"
                  }
                >
                  {feature ? (
                    <div aria-hidden className="pointer-events-none absolute inset-0 hero-ambient opacity-70" />
                  ) : null}
                  <span className={feature ? "label-caps relative text-gold-on-brand" : "label-caps text-gold"}>
                    {job.type}
                  </span>
                  <h3 className="relative mt-4 text-h3 font-bold">{job.title}</h3>
                  <ul
                    className={`relative mt-4 space-y-2 text-[0.92rem] ${feature ? "text-on-brand/80" : "text-foreground-muted"}`}
                  >
                    <li className="flex items-center gap-2.5">
                      <Briefcase size={16} aria-hidden className={feature ? "text-gold-on-brand" : "text-gold"} /> In2IT
                      EBS Pvt Ltd.
                    </li>
                    <li className="flex items-center gap-2.5">
                      <MapPin size={16} aria-hidden className={feature ? "text-gold-on-brand" : "text-gold"} />{" "}
                      {job.location}
                    </li>
                  </ul>
                  <a
                    href={job.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-sm font-semibold ${feature ? "text-gold-on-brand" : "text-action"}`}
                  >
                    Apply Now <ArrowUpRight size={16} aria-hidden />
                  </a>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </V2Section>
      <V2Rail
        eyebrow="Career"
        heading="Life at In2IT EBS."
        items={[
          { label: "Our Culture", href: "/careers/our-culture/" },
          { label: "Events & Celebrations", href: "/careers/events-celebrations/" },
          { label: "Careers at In2IT EBS", href: "/careers/" },
        ]}
      />
      <V2Closing
        eyebrow="Join our team"
        heading="Grow together."
        body="Tell us about yourself and the role you are looking for. We read every message."
      />
    </>
  );
}
