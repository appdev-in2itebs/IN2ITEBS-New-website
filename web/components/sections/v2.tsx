import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Words } from "@/components/motion/words";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { heroOverride, overrideMedia } from "./hero-override";
import type { CSSProperties, ReactNode } from "react";

export { V2Card, V2Bento, type BentoItem } from "./v2-cards";

/**
 * The design applied to the cloned pages on 2026-09-20, after the owner approved the demo: a light
 * mesh hero with a breadcrumb path, a headline that arrives word by word and frameless media that
 * arrives with it; a sticky navy in-page navigator; the copy set as an editorial column; the
 * sections as a bento grid with the first on a navy plate; a card rail for related pages; and a
 * full-bleed navy closing band. Same tokens and type as the rest of the site, so it still reads as
 * one site with the landing page. No boxes, grids or shapes behind anything: colour only.
 */

export type Crumb = { label: string; href?: string };

export async function V2Hero({
  path,
  title: pageTitle,
  lead: pageLead,
  media: pageMedia,
  cta = true,
  exploreId = "overview",
  route,
}: {
  path: Crumb[];
  title: string;
  lead?: ReactNode;
  media?: ReactNode;
  cta?: boolean;
  exploreId?: string | null;
  /** This page's URL path, so an edit made in /admin/pages can replace the title, intro or picture. */
  route?: string;
}) {
  const override = await heroOverride(route);
  const title = override?.title ?? pageTitle;
  const lead = override?.intro ?? pageLead;
  const media = overrideMedia(override, pageMedia);
  return (
    <section className="relative isolate overflow-hidden bg-canvas pt-36 md:pt-44">
      <div aria-hidden className="pointer-events-none absolute inset-0 hero-ambient" />
      <div
        aria-hidden
        className="ambient-orb pointer-events-none absolute -left-32 top-24 h-[28rem] w-[28rem] rounded-full bg-gold-soft/30 blur-[120px]"
      />
      <div
        aria-hidden
        className="ambient-orb ambient-orb-b pointer-events-none absolute -right-24 bottom-0 h-[26rem] w-[26rem] rounded-full bg-action/15 blur-[120px]"
      />
      <Container className="relative">
        <div className={cn("grid items-center gap-12 pb-20 lg:gap-10 lg:pb-28", media && "lg:grid-cols-12")}>
          <Reveal className={cn("flex flex-col gap-7", media ? "lg:col-span-6" : "max-w-4xl")}>
            {path.length ? (
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted"
              >
                {path.map((crumb, index) => {
                  const last = index === path.length - 1;
                  return (
                    <span key={`${crumb.label}-${index}`} className="inline-flex items-center gap-2">
                      {index > 0 ? <span aria-hidden>/</span> : null}
                      {crumb.href && !last ? (
                        <Link href={crumb.href} className="transition-colors hover:text-action">
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className={cn(last && "text-gold")}>{crumb.label}</span>
                      )}
                    </span>
                  );
                })}
              </nav>
            ) : null}
            <h1 className="text-[clamp(2.6rem,5.6vw,5rem)] font-bold leading-[0.98] tracking-[-0.045em]">
              <Words variant="rise">{title}</Words>
            </h1>
            {lead ? (
              <p className="max-w-[62ch] text-lg leading-relaxed text-foreground-muted md:text-xl">{lead}</p>
            ) : null}
            {cta || exploreId ? (
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {cta ? (
                  <Button href={site.primaryCta.href} variant="primary" withArrow>
                    Talk to Us
                  </Button>
                ) : null}
                {exploreId ? (
                  <a
                    href={`#${exploreId}`}
                    className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border-strong/50 px-6 text-sm font-semibold text-foreground transition-colors hover:border-action hover:text-action"
                  >
                    Explore the page <ChevronDown size={16} aria-hidden />
                  </a>
                ) : null}
              </div>
            ) : null}
          </Reveal>
          {media ? (
            <Reveal delay={0.12} className="lg:col-span-6">
              <div className="relative mx-auto aspect-[4/3] w-full max-w-xl lg:max-w-none">
                <div aria-hidden className="absolute inset-8 rounded-full bg-gold-soft/25 blur-3xl" />
                {media}
              </div>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

/** The sticky navy bar under the hero: one link per section of the page. */
export function V2StickyNav({ anchors }: { anchors: { id: string; label: string }[] }) {
  return (
    <div className="theme-on-brand sticky top-20 z-30 bg-brand/90 text-on-brand backdrop-blur-xl md:top-24">
      <Container>
        <ul className="flex gap-1 overflow-x-auto py-2 text-sm font-semibold [scrollbar-width:none]">
          {anchors.map((anchor) => (
            <li key={anchor.id} className="shrink-0">
              <a
                href={`#${anchor.id}`}
                className="inline-flex min-h-10 items-center rounded-full px-4 text-on-brand/70 transition-colors hover:bg-on-brand/10 hover:text-on-brand"
              >
                {anchor.label}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}

/** Copy as an editorial column: a heading on the left, the paragraphs beside a gold rule. */
export function V2Overview({
  id = "overview",
  eyebrow,
  heading,
  paragraphs,
  link,
  tone = "canvas",
  children,
}: {
  id?: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  link?: { label: string; href: string };
  tone?: "canvas" | "subtle";
  children?: ReactNode;
}) {
  return (
    <section id={id} className={cn("relative py-20 md:py-28", tone === "canvas" ? "bg-canvas" : "bg-surface-subtle")}>
      {tone === "canvas" ? <div aria-hidden className="absolute inset-0 section-tint-a" /> : null}
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <span className="label-caps text-gold">{eyebrow}</span>
            <h2 className="mt-5 text-h2 font-bold">
              <Words variant="bloom">{heading}</Words>
            </h2>
            {link ? (
              <Link
                href={link.href}
                className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-action"
              >
                {link.label} <ArrowRight size={16} aria-hidden />
              </Link>
            ) : null}
            {children}
          </Reveal>
          {/* The text arrives as you scroll to it: the gold rule draws down, the lead paragraph comes into
              focus word by word, and the rest are unveiled line by line (globals.css, "Text reveals"). */}
          <Reveal delay={0.08} className="text-reveal lg:col-span-7">
            <div className="relative pl-6 md:pl-8">
              <span aria-hidden className="text-rule absolute inset-y-0 left-0 w-0.5 bg-gold/60" />
              {paragraphs.map((paragraph, index) =>
                index === 0 ? (
                  <p
                    key={paragraph}
                    className="max-w-[70ch] text-lg font-medium leading-relaxed text-foreground md:text-xl"
                  >
                    <Words variant="blur" step={22} maxCascade={900}>
                      {paragraph}
                    </Words>
                  </p>
                ) : (
                  <p
                    key={paragraph}
                    style={{ "--sweep-delay": `${500 + index * 220}ms` } as CSSProperties}
                    className="text-sweep mt-5 max-w-[70ch] text-base leading-relaxed text-foreground-muted"
                  >
                    {paragraph}
                  </p>
                ),
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/** A section frame: eyebrow, bloomed heading, optional note on the right, then whatever it holds. */
export function V2Section({
  id,
  eyebrow,
  heading,
  note,
  tone = "subtle",
  children,
  className,
}: {
  id?: string;
  eyebrow: string;
  heading: string;
  note?: ReactNode;
  tone?: "canvas" | "subtle";
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("relative py-20 md:py-28", tone === "subtle" ? "bg-surface-subtle" : "bg-canvas", className)}
    >
      <Container>
        <Reveal className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label-caps text-gold">{eyebrow}</span>
            <h2 className="mt-5 max-w-3xl text-h2 font-bold">
              <Words variant="bloom">{heading}</Words>
            </h2>
          </div>
          {note ? <p className="max-w-xs text-sm text-foreground-muted">{note}</p> : null}
        </Reveal>
        {children}
      </Container>
    </section>
  );
}

/** Related pages as a rail of small cards. */
export function V2Rail({
  id = "related",
  eyebrow,
  heading,
  items,
}: {
  id?: string;
  eyebrow: string;
  heading: string;
  items: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <section id={id} className="relative bg-canvas py-20 md:py-24">
      <Container>
        <Reveal className="mb-8">
          <span className="label-caps text-gold">{eyebrow}</span>
          <h2 className="mt-4 text-h2 font-bold">
            <Words variant="bloom">{heading}</Words>
          </h2>
        </Reveal>
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <StaggerItem key={item.label} className="h-full">
              <Link
                href={item.href}
                className="group flex h-full min-h-32 flex-col justify-between rounded-feature border border-border-subtle/70 bg-surface p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-gold-soft/70 hover:shadow-glass"
              >
                <span className="text-base font-semibold leading-snug text-foreground">{item.label}</span>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-action">
                  Open <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

/** A strip of marks with their white ground multiplied away, no tiles. */
export function V2Logos({ logos }: { logos: { src: string; alt: string }[] }) {
  return (
    <Stagger className="grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
      {logos.map((logo) => (
        <StaggerItem key={logo.src} className="flex items-center justify-center">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={220}
            height={120}
            sizes="(min-width: 1024px) 16vw, 40vw"
            className="h-auto max-h-20 w-auto max-w-full object-contain mix-blend-multiply"
          />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/** The full-bleed navy closing band. */
export function V2Closing({
  id = "talk",
  eyebrow = "Looking for Digital Transformation?",
  heading = "Talk to us.",
  body,
  ctaLabel = "Talk to Us",
  ctaHref = site.primaryCta.href,
}: {
  id?: string;
  eyebrow?: string;
  heading?: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section id={id} className="theme-on-brand relative isolate overflow-hidden bg-brand py-24 text-on-brand md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 hero-ambient opacity-80" />
      <div
        aria-hidden
        className="ambient-orb pointer-events-none absolute right-0 top-0 h-[30rem] w-[30rem] rounded-full bg-gold/15 blur-[140px]"
      />
      <Container className="relative">
        <Reveal className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="label-caps text-gold-on-brand">{eyebrow}</span>
            <h2 className="heading-plain mt-6 text-[clamp(2.6rem,5vw,4.8rem)] font-bold leading-[0.98] tracking-[-0.045em]">
              <Words variant="rise">{heading}</Words>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="max-w-[46ch] text-base leading-relaxed text-on-brand/80">{body}</p>
            <div className="mt-7 flex flex-wrap items-center gap-5">
              <Button href={ctaHref} variant="on-dark" withArrow>
                {ctaLabel}
              </Button>
              <a
                href={`mailto:${site.primaryEmail}`}
                className="text-sm font-semibold text-on-brand underline decoration-gold-on-brand/50 underline-offset-4"
              >
                {site.primaryEmail}
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
