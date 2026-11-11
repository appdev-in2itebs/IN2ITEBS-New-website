import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { HeroObject } from "@/components/sections/hero-media";
import { V2Hero, V2StickyNav, V2Overview, V2Section, V2Rail, V2Closing } from "@/components/sections/v2";
import { getOpenOpenings } from "@/lib/cms/store";
import { OpeningsBrowser, type JobCard } from "@/components/sections/openings-browser";
import { daysSince } from "@/lib/careers";

/** Openings come from /admin (HR edits them there), so the list is read on every visit. */
export const dynamic = "force-dynamic";

export const metadata = pageMetadata("/careers/current-openings/", {
  title: "Current Openings",
  description:
    "Explore current job openings at In2IT EBS across Bengaluru, Bhubaneswar, Chennai, Hyderabad and Mumbai.",
});

/**
 * Current Openings. The roles are the job_openings HR manages in /admin/openings: searchable and
 * filterable, grouped by department, each opening its full job post with the apply form. Until
 * Supabase is configured the page falls back to the roles the existing site listed, which link to
 * their postings on in2itebs.com.
 */
type Job = { title: string; type: string; location: string; href: string };
const fallbackOpenings: Job[] = [
  {
    title: "SAP and Success Factors Consultant",
    type: "Walkin",
    location: "Hyderabad",
    href: "https://in2itebs.com/sap-and-success-factor-consultant/",
  },
  {
    title: "Manager - Finance",
    type: "Full Time",
    location: "Bhubaneswar - Bengaluru",
    href: "https://in2itebs.com/manager-finance/",
  },
  {
    title: "SuccessFactors Compensation Consultant",
    type: "Full Time",
    location: "Bengaluru - Bhubaneswar - Chennai, + 4 more",
    href: "https://in2itebs.com/careers/",
  },
  {
    title: "Assistant General Manager – IT Application Delivery",
    type: "Full Time",
    location: "Bhubaneswar",
    href: "https://in2itebs.com/careers/",
  },
  {
    title: "Management Trainee",
    type: "Full Time",
    location: "Bengaluru",
    href: "https://in2itebs.com/management-trainee/",
  },
  {
    title: "NetSuite Technical Consultant",
    type: "Full Time",
    location: "Bengaluru",
    href: "https://in2itebs.com/netsuite-technical-consultant-3/",
  },
  {
    title: "Senior Consultant - SAP SD WM",
    type: "Full Time",
    location: "Bhubaneswar - Mumbai - Bengaluru",
    href: "https://in2itebs.com/senior-consultant-sap-sd-wm/",
  },
  { title: "Java Developer", type: "Full Time", location: "Bengaluru", href: "https://in2itebs.com/java-developer/" },
  {
    title: "Associate Consultant - SuccessFactors RCM",
    type: "Full Time",
    location: "Bengaluru - Bhubaneswar - Chennai, + 3 more",
    href: "https://in2itebs.com/careers/",
  },
  {
    title: "Assistant General Manager – Business By Design",
    type: "Full Time",
    location: "Bengaluru",
    href: "https://in2itebs.com/assistant-general-manager-business-by-design/",
  },
];

export default async function CurrentOpeningsPage() {
  const live = await getOpenOpenings().catch(() => []);
  const now = Date.now();
  const jobs: JobCard[] = live.length
    ? live.map((o) => ({
        id: o.id,
        title: o.title,
        department: o.department,
        location: o.location,
        experience: o.experience,
        type: o.employment_type,
        days: daysSince(o.posted_at, now),
        skills: o.skills,
      }))
    : fallbackOpenings.map((j) => ({
        id: j.href + j.title,
        title: j.title,
        department: null,
        location: j.location,
        experience: "",
        type: j.type,
        days: 0,
        skills: "",
        href: j.href,
      }));
  return (
    <>
      <BreadcrumbJsonLd path="/careers/current-openings/" name="Current Openings" />
      <V2Hero
        route="/careers/current-openings/"
        path={[{ label: "Career", href: "/careers/" }, { label: "Current Openings" }]}
        title="Build a career with endless opportunities"
        lead="Are you prepared to excel in a welcoming, diverse, and open environment where you can continuously learn, develop, and make a lasting impact?"
        media={<HeroObject name="careers/current-openings" />}
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
        <OpeningsBrowser jobs={jobs} />
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
