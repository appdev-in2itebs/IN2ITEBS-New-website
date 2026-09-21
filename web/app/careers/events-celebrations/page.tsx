import Image from "next/image";
import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Words } from "@/components/motion/words";
import { HeroImage } from "@/components/sections/hero-media";
import { V2Hero, V2StickyNav, V2Overview, V2Rail, V2Closing } from "@/components/sections/v2";

export const metadata = pageMetadata("/careers/events-celebrations/", {
  title: "Events & Celebrations",
  description:
    "Our offices reflect our brand that we live every day. Collaboration and mutual respect are second nature around here: we like to have fun, we celebrate.",
});

/**
 * Events & Celebrations — the existing site's /events-celebrations-3/ page: its copy and its seven
 * photo galleries, the photographs being the same files that page serves (under /public/events),
 * in the approved design. Each gallery is an anchor in the sticky navigator.
 */
const galleries: { id: string; title: string; photos: string[] }[] = [
  {
    id: "go-live",
    title: "Go-Live",
    photos: [
      "21-1-600x540.jpg",
      "23-2-600x540.jpg",
      "1-1-1-600x540.jpg",
      "24-1-600x540.jpg",
      "IMG-20220311-WA0015-1-600x540.jpg",
      "20-1-600x540.jpg",
    ],
  },
  {
    id: "team-lunch",
    title: "In2IT EBS Team Lunch",
    photos: [
      "photo3-1-440x330-1.jpg",
      "photo2-1-440x330-1.jpg",
      "dc81ab4f-b7db-4d40-83bb-9b56b919aa91-440x330-1.jpg",
      "48e1bc3c-0de5-44c3-b9f2-81f98081a1a2-440x330-1.jpg",
      "55a88dd6-a107-4ec5-bf0c-72d8f74a1960-440x330-1.jpg",
      "team-lunch1.jpg",
      "team-lunch2.jpg",
    ],
  },
  {
    id: "team-outing",
    title: "Team Outing 2022",
    photos: [
      "35-1-440x330-1.jpg",
      "38-440x330-1.jpg",
      "37-440x330-1.jpg",
      "36-440x330-1.jpg",
      "35-440x330-1.jpg",
      "33-440x330-1.jpg",
      "photo3-1-440x330-1.jpg",
      "team-outing2.jpg",
      "team-outing.jpg",
    ],
  },
  {
    id: "womens-day",
    title: "Women's Day Celebration 2022",
    photos: [
      "womensday1-1.jpg",
      "womensday2-1.jpg",
      "womensday3-1.jpg",
      "womensday4-1.jpg",
      "IMG-20220311-WA0022-440x198-1.jpg",
      "38-440x330-1.jpg",
    ],
  },
  {
    id: "picnic",
    title: "Picnic 2021",
    photos: [
      "26-600x540.jpg",
      "25-600x540.jpg",
      "24-600x540.jpg",
      "23-1-600x540.jpg",
      "22-600x540.jpg",
      "21-600x540.jpg",
      "20-rotated-1-600x540.jpg",
      "9-600x540.jpg",
      "10-600x540.jpg",
      "12-rotated-1-600x540.jpg",
      "18-600x540.jpg",
      "15-rotated-1-600x540.jpg",
      "16-rotated-1-600x540.jpg",
      "19-600x540.jpg",
      "5-600x540.jpg",
      "4-600x540.jpg",
      "3-600x540.jpg",
      "1-1-rotated-1-600x540.jpg",
      "picnic1.jpg",
    ],
  },
  {
    id: "birthday",
    title: "Birthday Celebration",
    photos: [
      "2-1-600x540.jpg",
      "14-600x540.jpg",
      "10-1-600x540.jpg",
      "3-1-600x540.jpg",
      "4-1-600x540.jpg",
      "6-600x540.jpg",
      "7-1-600x540.jpg",
    ],
  },
  { id: "christmas", title: "Christmas Celebration", photos: ["5-440x330-1.jpg", "christmas-celebration.jpg"] },
];

export default function EventsCelebrationsPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/careers/events-celebrations/" name="Events & Celebrations" />
      <V2Hero
        path={[{ label: "Career", href: "/careers/" }, { label: "Events & Celebrations" }]}
        title="Events & Celebrations"
        lead="Our offices reflect our brand that we live every day. Our employees are provided with a relaxing and creative workspace to help them get the job done!"
        media={<HeroImage src="/careers/events-celebrations.jpg" alt="In2IT EBS, SAP Gold Partner" />}
      />
      <V2StickyNav
        anchors={[
          { id: "overview", label: "Overview" },
          ...galleries.map((gallery) => ({ id: gallery.id, label: gallery.title })),
          { id: "talk", label: "Talk to us" },
        ]}
      />
      <V2Overview
        eyebrow="Events & Celebrations"
        heading="We like to have fun. We celebrate."
        paragraphs={[
          "Collaboration and mutual respect are second nature around here! Opportunities for continuing education and the latest technology keep us on our toes and enable us to provide the very best service to our clients.",
          "We emphasize teamwork and communication as key components to delivering outstanding service.",
          "We like to have fun. We celebrate. We eat. We earn…",
        ]}
      />
      {galleries.map((gallery, index) => (
        <section
          key={gallery.id}
          id={gallery.id}
          className={index % 2 === 0 ? "bg-surface-subtle py-16 md:py-20" : "bg-canvas py-16 md:py-20"}
        >
          <Container>
            <Reveal className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="label-caps text-gold">Gallery</span>
                <h2 className="mt-3 text-h2 font-bold">
                  <Words variant="bloom">{gallery.title}</Words>
                </h2>
              </div>
              <p className="text-sm text-foreground-muted">
                {gallery.photos.length} {gallery.photos.length === 1 ? "photo" : "photos"}
              </p>
            </Reveal>
            <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {gallery.photos.map((photo, photoIndex) => (
                <StaggerItem key={`${gallery.id}-${photo}`} className={photoIndex === 0 ? "col-span-2 row-span-2" : ""}>
                  <figure className="relative h-full min-h-40 overflow-hidden rounded-feature transition-transform duration-300 hover:-translate-y-1">
                    <Image
                      src={`/events/${photo}`}
                      alt={`${gallery.title}, photo ${photoIndex + 1}`}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover"
                    />
                  </figure>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </section>
      ))}
      <V2Rail
        eyebrow="Career"
        heading="Life at In2IT EBS."
        items={[
          { label: "Our Culture", href: "/careers/our-culture/" },
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
