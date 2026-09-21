import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronDown, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Words } from "@/components/motion/words";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * The design applied to the cloned pages on 2026-09-20, after the owner approved the demo: a light
 * mesh hero with a breadcrumb path, a headline that arrives word by word and frameless media that
 * arrives with it; a sticky navy in-page navigator; the copy set as an editorial column; the
 * sections as a bento grid with the first on a navy plate; a card rail for related pages; and a
 * full-bleed navy closing band. Same tokens and type as the rest of the site, so it still reads as
 * one site with the landing page. No boxes, grids or shapes behind anything: colour only.
 */

export type Crumb = { label: string; href?: string };

export function V2Hero({
  path,
  title,
  lead,
  media,
  cta = true,
  exploreId = "overview",
}: {
  path: Crumb[];
  title: string;
  lead?: ReactNode;
  media?: ReactNode;
  cta?: boolean;
  exploreId?: string | null;
}) {
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
          <Reveal className={cn("flex flex-col gap-7", media ? "lg:col-span-7" : "max-w-4xl")}>
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
            <Reveal delay={0.12} className="lg:col-span-5">
              <div className="relative mx-auto aspect-[5/4] w-full max-w-xl">
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
          <Reveal delay={0.08} className="lg:col-span-7">
            <div className="relative border-l-2 border-gold/60 pl-6 md:pl-8">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={cn(
                    "max-w-[70ch] leading-relaxed text-foreground-muted",
                    index === 0 ? "text-lg font-medium text-foreground md:text-xl" : "mt-5 text-base",
                  )}
                >
                  {paragraph}
                </p>
              ))}
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

export interface BentoItem {
  title: string;
  body?: string;
  bullets?: string[];
  /** Numbered offerings ("i) … ii) …") shown under the body. */
  offerings?: { label: string; body?: string }[];
  icon?: LucideIcon;
  /** A picture-icon from the source site, under /public. */
  iconImage?: string;
  /** A photograph across the top of the card. */
  image?: string;
  href?: string;
  linkLabel?: string;
}

/** Bento placement: the first card is the widest, the second fills the row, the rest tile. */
function span(index: number, total: number) {
  if (total === 1) return "lg:col-span-12";
  if (total === 2) return "lg:col-span-6";
  if (index === 0) return "lg:col-span-7";
  if (index === 1) return "lg:col-span-5";
  if (total === 3) return "lg:col-span-12";
  const rest = total - 2;
  if (rest % 3 === 0) return "lg:col-span-4";
  if (rest % 2 === 0) return "lg:col-span-6";
  return index === total - 1 ? "lg:col-span-12" : "lg:col-span-6";
}

function Bullets({ items, onDark = false }: { items: string[]; onDark?: boolean }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            "flex gap-3 text-[0.95rem] leading-relaxed",
            onDark ? "text-on-brand/80" : "text-foreground-muted",
          )}
        >
          <span
            aria-hidden
            className={cn("mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full", onDark ? "bg-gold-on-brand" : "bg-gold")}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];

function Offerings({ items, onDark = false }: { items: NonNullable<BentoItem["offerings"]>; onDark?: boolean }) {
  return (
    <ol className="mt-4 space-y-3">
      {items.map((item, index) => (
        <li key={item.label} className="flex gap-3 text-[0.95rem] leading-relaxed">
          <span
            aria-hidden
            className={cn("w-7 shrink-0 pt-px text-xs font-semibold", onDark ? "text-gold-on-brand" : "text-gold")}
          >
            {roman[index] ?? index + 1})
          </span>
          <span className={onDark ? "text-on-brand/80" : "text-foreground-muted"}>
            <span className={cn("font-semibold", onDark ? "text-on-brand" : "text-foreground")}>{item.label}</span>
            {item.body ? <>: {item.body}</> : null}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function V2Card({ item, index, feature }: { item: BentoItem; index: number; feature: boolean }) {
  const Icon = item.icon;
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-feature border border-border-subtle/70 bg-surface p-7 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-gold-soft/70 hover:shadow-glass-hover md:p-8",
        feature && "theme-on-brand border-transparent bg-brand text-on-brand",
      )}
    >
      {feature ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 hero-ambient opacity-70" />
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold-soft/10 blur-3xl transition-opacity duration-300 group-hover:opacity-100 md:opacity-60"
        />
      )}
      {item.image ? (
        <div className="relative -mx-7 -mt-7 mb-6 aspect-[16/9] overflow-hidden md:-mx-8 md:-mt-8 [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]">
          <Image src={item.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      ) : null}
      <div className="relative flex items-start justify-between gap-4">
        {item.iconImage ? (
          <span
            className={cn(
              "inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-control",
              feature ? "bg-on-brand/95 p-1.5" : "bg-logo-surface p-1.5 ring-1 ring-border-subtle",
            )}
          >
            <Image src={item.iconImage} alt="" width={56} height={56} className="h-full w-full object-contain" />
          </span>
        ) : Icon ? (
          <span
            className={cn(
              "inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-control",
              feature ? "bg-on-brand/10 text-gold-on-brand ring-1 ring-on-brand/15" : "icon-tile",
            )}
          >
            <Icon size={26} strokeWidth={1.5} />
          </span>
        ) : (
          <span />
        )}
        <span
          aria-hidden
          className={cn("label-caps pt-1 tabular-nums", feature ? "text-gold-on-brand" : "text-foreground-muted")}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3
        className={cn(
          "relative mt-6 font-bold leading-tight",
          feature ? "text-[clamp(1.6rem,2.4vw,2.2rem)] tracking-[-0.03em]" : "text-h3",
        )}
      >
        {item.href ? (
          <Link href={item.href} className="transition-colors hover:text-gold">
            {item.title}
          </Link>
        ) : (
          item.title
        )}
      </h3>
      {item.body ? (
        <p
          className={cn(
            "relative mt-4 text-[0.95rem] leading-relaxed",
            feature ? "text-on-brand/85 md:text-base" : "text-foreground-muted",
          )}
        >
          {item.body}
        </p>
      ) : null}
      {item.bullets?.length ? <Bullets items={item.bullets} onDark={feature} /> : null}
      {item.offerings?.length ? <Offerings items={item.offerings} onDark={feature} /> : null}
      {item.href ? (
        <Link
          href={item.href}
          className={cn(
            "relative mt-auto inline-flex min-h-11 items-center gap-2 pt-6 text-sm font-semibold",
            feature ? "text-gold-on-brand" : "text-action",
          )}
        >
          {item.linkLabel ?? "Read more"}{" "}
          <ArrowUpRight
            size={16}
            aria-hidden
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      ) : null}
    </article>
  );
}

/** The sections of a page as a mixed-size grid, the first on a navy plate when there are three or more. */
export function V2Bento({ items, featureFirst = true }: { items: BentoItem[]; featureFirst?: boolean }) {
  return (
    <Stagger className="grid gap-5 lg:grid-cols-12">
      {items.map((item, index) => (
        <StaggerItem key={item.title} className={cn("h-full", span(index, items.length))}>
          <V2Card item={item} index={index} feature={featureFirst && index === 0 && items.length > 2} />
        </StaggerItem>
      ))}
    </Stagger>
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
