import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { ServiceIconTile, ServiceHeroMark } from "@/components/sections/service-icon";
import { V2Hero, V2StickyNav, V2Section, V2Closing } from "@/components/sections/v2";
import { serviceGroups } from "@/content/legacy-services";
import type { NavItem } from "@/content/types";

export const metadata = pageMetadata("/services/", {
  title: "Services",
  description:
    "SAP enterprise solutions, analytics, cloud HCM, cloud infrastructure, cyber security, digital services and data & AI: every In2IT EBS service, page by page.",
});

/** The Services index: the existing site's Services mega-menu laid out as a page, in the approved design. */
function ItemList({ items, level = 0 }: { items: NavItem[]; level?: number }) {
  return (
    <ul className={level === 0 ? "mt-5 space-y-1" : "ml-4 mt-1 space-y-1 border-l border-border-subtle pl-3"}>
      {items.map((item) => (
        <li key={item.label}>
          <Link
            href={item.href}
            className="group/link inline-flex min-h-9 items-center gap-1.5 text-[0.95rem] text-foreground-muted transition-colors hover:text-action"
          >
            {item.label}
            <ArrowUpRight aria-hidden size={14} className="opacity-0 transition-opacity group-hover/link:opacity-100" />
          </Link>
          {item.children ? <ItemList items={item.children} level={level + 1} /> : null}
        </li>
      ))}
    </ul>
  );
}

export default function ServicesIndexPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/services/" />
      <V2Hero
        path={[{ label: "Services" }]}
        title="Everything we do, in one place."
        lead="From SAP enterprise solutions and analytics to cloud, security, digital services and data & AI: the full In2IT EBS service catalogue, each with its own page."
        media={<ServiceHeroMark icon="boxes" />}
        exploreId="groups"
      />
      <V2StickyNav
        anchors={[...serviceGroups.map((g) => ({ id: g.slug, label: g.name })), { id: "talk", label: "Talk to us" }]}
      />
      <V2Section
        id="groups"
        eyebrow="Service groups"
        heading="Eight groups, one partner."
        note="Choose a group to see what sits inside it, or go straight to a service."
      >
        <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {serviceGroups.map((group) => (
            <StaggerItem key={group.slug} className="h-full">
              <article
                id={group.slug}
                className="group relative flex h-full flex-col overflow-hidden rounded-feature border border-border-subtle/70 bg-surface p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-gold-soft/70 hover:shadow-glass-hover"
              >
                <div className="flex items-start gap-4">
                  <ServiceIconTile icon={group.icon} />
                  <div>
                    <h2 className="heading-plain text-h3 font-bold text-foreground">
                      <Link href={group.href} className="hover:text-action">
                        {group.name}
                      </Link>
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{group.blurb}</p>
                  </div>
                </div>
                <ItemList items={group.items} />
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </V2Section>
      <V2Closing body="Tell us where you want to go. We will bring the platforms, the people and the proof, and map your first move in a single conversation." />
    </>
  );
}
