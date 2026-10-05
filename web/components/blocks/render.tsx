import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ChevronDown, Quote } from "lucide-react";
import heroImages from "@/content/hero-images.json";
import { clients } from "@/content/clients";
import { site } from "@/content/site";
import type { Testimonial } from "@/content/types";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Words } from "@/components/motion/words";
import { HeroImage } from "@/components/sections/hero-media";
import { V2Bento, V2Card, type BentoItem } from "@/components/sections/v2-cards";
import { StatBand } from "@/components/sections/stat-band";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { Testimonials } from "@/components/sections/testimonials";
import { CtaSection } from "@/components/sections/cta-section";
import { DemoForm } from "@/components/forms/demo-form";
import { BLOCKS, HOME_SECTIONS, safeHref, youtubeId, type Block, type HomeSection } from "@/lib/builder/blocks";
import { cn } from "@/lib/utils";
import { Markdown } from "./markdown";

/**
 * Draws page-builder blocks in the site's own design. The same code renders a published page for
 * visitors (on the server) and the admin's live preview (in the browser), so what the editor sees
 * is what goes live. Client-safe: no server imports.
 */

export type BlockContext = {
  testimonials?: Testimonial[];
  /** Homepage only: the homepage's own sections, rendered by the server. */
  sections?: Partial<Record<HomeSection, ReactNode>>;
  /** True in the admin preview: homepage sections show as labelled placeholders. */
  preview?: boolean;
};

type P = Record<string, unknown>;
const s = (v: unknown) => (typeof v === "string" ? v : "");
const arr = <T,>(v: unknown) => (Array.isArray(v) ? (v as T[]) : []);

export function BlockList({ blocks, ctx = {} }: { blocks: Block[]; ctx?: BlockContext }) {
  return (
    <>
      {blocks.map((b, i) => (
        <BlockView key={b.id} block={b} first={i === 0} ctx={ctx} />
      ))}
    </>
  );
}

export function BlockView({ block, first = false, ctx = {} }: { block: Block; first?: boolean; ctx?: BlockContext }) {
  const p = block.props as P;
  switch (block.type) {
    case "hero":
      return <HeroBlock p={p} first={first} />;
    case "text":
      return <TextBlock p={p} />;
    case "richText":
      return (
        <Shell p={p}>
          <Reveal className={cn(p.width === "wide" ? "" : "mx-auto max-w-3xl")}>
            {s(p.heading) ? <Heading text={s(p.heading)} /> : null}
            <div className={s(p.heading) ? "mt-2" : "-mt-5"}>
              <Markdown text={s(p.body)} onDark={p.tone === "navy"} />
            </div>
          </Reveal>
        </Shell>
      );
    case "imageText":
      return <ImageTextBlock p={p} />;
    case "cards":
      return <CardsBlock p={p} />;
    case "stats":
      return (
        <Shell p={p}>
          <Intro p={p} />
          <StatBand stats={arr<{ value: string; label: string }>(p.items)} />
        </Shell>
      );
    case "quote":
      return (
        <Shell p={p}>
          <Reveal className="mx-auto max-w-4xl text-center">
            <Quote aria-hidden className="mx-auto text-gold" size={40} strokeWidth={1.4} />
            <blockquote className="mt-6 text-[clamp(1.5rem,2.6vw,2.3rem)] font-semibold leading-snug tracking-[-0.02em]">
              “{s(p.quote)}”
            </blockquote>
            {s(p.name) || s(p.role) ? (
              <p className="mt-6 text-sm">
                <span className="font-semibold">{s(p.name)}</span>
                {s(p.role) ? (
                  <span className={p.tone === "navy" ? "text-on-brand/70" : "text-foreground-muted"}>
                    {s(p.name) ? " · " : ""}
                    {s(p.role)}
                  </span>
                ) : null}
              </p>
            ) : null}
          </Reveal>
        </Shell>
      );
    case "faq":
      return (
        <Shell p={p}>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Intro p={p} inline />
            </div>
            <div className="divide-y divide-border-subtle border-y border-border-subtle lg:col-span-8">
              {arr<P>(p.items).map((item, i) => (
                <details key={i} className="group py-5" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                    {s(item.question)}
                    <ChevronDown
                      aria-hidden
                      size={20}
                      className="shrink-0 transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <p
                    className={cn(
                      "mt-3 max-w-[70ch] leading-relaxed",
                      p.tone === "navy" ? "text-on-brand/80" : "text-foreground-muted",
                    )}
                  >
                    {s(item.answer)}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Shell>
      );
    case "image": {
      const pic = picture(p.picture);
      return (
        <Shell p={p} tight>
          <Reveal className={cn("mx-auto", p.width === "narrow" ? "max-w-3xl" : "")}>
            {pic ? (
              <Image
                src={pic.src}
                alt={pic.alt || s(p.caption)}
                width={pic.width}
                height={pic.height}
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="h-auto w-full rounded-feature object-cover"
              />
            ) : (
              <Placeholder>Choose a picture in the panel on the right.</Placeholder>
            )}
            {s(p.caption) ? <p className="mt-3 text-center text-sm text-foreground-muted">{s(p.caption)}</p> : null}
          </Reveal>
        </Shell>
      );
    }
    case "video": {
      const id = youtubeId(p.url);
      return (
        <Shell p={p}>
          {s(p.heading) ? <Heading text={s(p.heading)} className="mb-10 text-center" /> : null}
          <Reveal className="mx-auto max-w-5xl">
            {id ? (
              <div className="relative aspect-video overflow-hidden rounded-feature bg-brand shadow-glass">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
                  title={s(p.heading) || s(p.caption) || "Video"}
                  loading="lazy"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            ) : (
              <Placeholder>Paste a YouTube link in the panel on the right.</Placeholder>
            )}
            {s(p.caption) ? <p className="mt-3 text-center text-sm text-foreground-muted">{s(p.caption)}</p> : null}
          </Reveal>
        </Shell>
      );
    }
    case "testimonials":
      return <Testimonials testimonials={ctx.testimonials} />;
    case "logos":
      return (
        <section
          id={s(p.anchor) || undefined}
          className={cn("relative border-y border-border-subtle py-8 md:py-10", toneClass(p.tone))}
        >
          <Container>
            {s(p.eyebrow) ? (
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.16em] text-gold">{s(p.eyebrow)}</p>
            ) : null}
            <LogoMarquee clients={clients} />
          </Container>
        </section>
      );
    case "contact":
      return (
        <Shell p={p}>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Intro p={p} inline />
              {s(p.intro) ? (
                <p
                  className={cn(
                    "mt-5 max-w-[46ch] leading-relaxed",
                    p.tone === "navy" ? "text-on-brand/80" : "text-foreground-muted",
                  )}
                >
                  {s(p.intro)}
                </p>
              ) : null}
              <p className="mt-6 text-sm text-foreground-muted">
                Or email{" "}
                <a href={`mailto:${site.primaryEmail}`} className="font-semibold text-action">
                  {site.primaryEmail}
                </a>
              </p>
            </div>
            <div className="rounded-feature bg-surface p-6 text-foreground shadow-glass md:p-8 lg:col-span-7">
              <DemoForm />
            </div>
          </div>
        </Shell>
      );
    case "cta":
      return p.style === "glass" ? (
        <CtaSection
          eyebrow={s(p.eyebrow) || undefined}
          heading={s(p.heading) || undefined}
          body={s(p.body) || undefined}
          ctaLabel={s(p.buttonLabel) || undefined}
          ctaHref={safeHref(p.buttonHref) ?? undefined}
        />
      ) : (
        <NavyCta p={p} />
      );
    case "spacer":
      return (
        <div aria-hidden className={cn(toneClass(p.tone), { s: "py-6", m: "py-12", l: "py-24" }[s(p.size) || "m"])}>
          {p.line === "yes" ? (
            <Container>
              <hr className="border-border-subtle" />
            </Container>
          ) : null}
        </div>
      );
    case "section": {
      const key = s(p.section) as HomeSection;
      if (ctx.preview || !ctx.sections)
        return (
          <div className="bg-surface-subtle py-6">
            <Container>
              <div className="flex items-center justify-between rounded-2xl border-2 border-dashed border-border-strong/40 bg-surface px-6 py-8">
                <div>
                  <p className="label-caps text-gold">Homepage section</p>
                  <p className="mt-1 text-xl font-bold">{HOME_SECTIONS[key] ?? key}</p>
                </div>
                <p className="max-w-xs text-right text-sm text-foreground-muted">
                  Shown exactly as on the live homepage. Drag to move it.
                </p>
              </div>
            </Container>
          </div>
        );
      return <>{ctx.sections[key] ?? null}</>;
    }
  }
}

// ------------------------------------------------------------------ pieces

function toneClass(tone: unknown) {
  if (tone === "navy") return "theme-on-brand bg-brand text-on-brand";
  if (tone === "subtle") return "bg-surface-subtle";
  return "bg-canvas";
}

function Shell({ p, children, tight = false }: { p: P; children: ReactNode; tight?: boolean }) {
  return (
    <section
      id={s(p.anchor) || undefined}
      className={cn("relative isolate overflow-hidden", tight ? "py-12 md:py-16" : "py-20 md:py-28", toneClass(p.tone))}
    >
      {p.tone === "navy" ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 hero-ambient opacity-70" />
      ) : null}
      <Container className="relative">{children}</Container>
    </section>
  );
}

function Heading({ text, className, level = 2 }: { text: string; className?: string; level?: 1 | 2 }) {
  const Tag = level === 1 ? "h1" : "h2";
  return (
    <Tag className={cn("text-h2 font-bold", className)}>
      <Words variant="bloom">{text}</Words>
    </Tag>
  );
}

function Intro({ p, inline = false }: { p: P; inline?: boolean }) {
  if (!s(p.eyebrow) && !s(p.heading) && !s(p.note)) return null;
  const onDark = p.tone === "navy";
  return (
    <Reveal className={cn(!inline && "mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between")}>
      <div>
        {s(p.eyebrow) ? (
          <span className={cn("label-caps", onDark ? "text-gold-on-brand" : "text-gold")}>{s(p.eyebrow)}</span>
        ) : null}
        {s(p.heading) ? <Heading text={s(p.heading)} className="mt-5 max-w-3xl" /> : null}
      </div>
      {s(p.note) ? (
        <p className={cn("max-w-xs text-sm", onDark ? "text-on-brand/70" : "text-foreground-muted")}>{s(p.note)}</p>
      ) : null}
    </Reveal>
  );
}

function Buttons({ p, onDark }: { p: P; onDark: boolean }) {
  const one = safeHref(p.buttonHref);
  const two = safeHref(p.button2Href);
  if (!(one && s(p.buttonLabel)) && !(two && s(p.button2Label))) return null;
  return (
    <div className="flex flex-wrap items-center gap-4 pt-2">
      {one && s(p.buttonLabel) ? (
        <Button href={one} variant={onDark ? "on-dark" : "primary"} withArrow>
          {s(p.buttonLabel)}
        </Button>
      ) : null}
      {two && s(p.button2Label) ? (
        <Link
          href={two}
          className={cn(
            "inline-flex min-h-12 items-center gap-2 rounded-full border px-6 text-sm font-semibold transition-colors",
            onDark
              ? "border-on-brand/40 text-on-brand hover:border-on-brand"
              : "border-border-strong/50 text-foreground hover:border-action hover:text-action",
          )}
        >
          {s(p.button2Label)}
        </Link>
      ) : null}
    </div>
  );
}

type Pic = { src: string; alt: string; width: number; height: number; object: boolean };

/** A picture choice: a hero-library key, an uploaded image's URL, or a path on the site. */
export function picture(value: unknown): Pic | null {
  const v = s(value);
  if (!v) return null;
  const lib = (heroImages as Record<string, { src: string; alt: string; width: number; height: number }>)[v];
  if (lib) return { ...lib, object: true };
  if (/^https:\/\//.test(v) || v.startsWith("/"))
    return { src: v, alt: "", width: 1200, height: 800, object: /\.png(\?|$)/i.test(v) };
  return null;
}

function Media({ value }: { value: unknown }) {
  const pic = picture(value);
  if (!pic) return null;
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-xl lg:max-w-none">
      <div aria-hidden className="absolute inset-8 rounded-full bg-gold-soft/25 blur-3xl" />
      <HeroImage
        src={pic.src}
        alt={pic.alt}
        width={pic.width}
        height={pic.height}
        kind={pic.object ? "object" : "photo"}
        priority={false}
      />
    </div>
  );
}

function Placeholder({ children }: { children: ReactNode }) {
  return (
    <div className="flex aspect-video items-center justify-center rounded-feature border-2 border-dashed border-border-strong/40 bg-surface-subtle p-6 text-center text-sm text-foreground-muted">
      {children}
    </div>
  );
}

function HeroBlock({ p, first }: { p: P; first: boolean }) {
  const navy = p.tone === "navy";
  const media = picture(p.picture) ? <Media value={p.picture} /> : null;
  const Tag = first ? "h1" : "h2";
  return (
    <section
      id={s(p.anchor) || undefined}
      className={cn(
        "relative isolate overflow-hidden",
        first ? "pt-36 md:pt-44" : "pt-20 md:pt-24",
        navy ? "theme-on-brand bg-brand text-on-brand" : "bg-canvas",
      )}
    >
      <div aria-hidden className={cn("pointer-events-none absolute inset-0 hero-ambient", navy && "opacity-80")} />
      {!navy ? (
        <div
          aria-hidden
          className="ambient-orb pointer-events-none absolute -left-32 top-24 h-[28rem] w-[28rem] rounded-full bg-gold-soft/30 blur-[120px]"
        />
      ) : null}
      <Container className="relative">
        <div className={cn("grid items-center gap-12 pb-20 lg:gap-10 lg:pb-28", media && "lg:grid-cols-12")}>
          <Reveal className={cn("flex flex-col gap-7", media ? "lg:col-span-6" : "max-w-4xl")}>
            {s(p.eyebrow) ? (
              <span className={cn("label-caps", navy ? "text-gold-on-brand" : "text-gold")}>{s(p.eyebrow)}</span>
            ) : null}
            <Tag className="text-[clamp(2.6rem,5.6vw,5rem)] font-bold leading-[0.98] tracking-[-0.045em]">
              <Words variant="rise">{s(p.title) || "Headline"}</Words>
            </Tag>
            {s(p.intro) ? (
              <p
                className={cn(
                  "max-w-[62ch] text-lg leading-relaxed md:text-xl",
                  navy ? "text-on-brand/80" : "text-foreground-muted",
                )}
              >
                {s(p.intro)}
              </p>
            ) : null}
            <Buttons p={p} onDark={navy} />
          </Reveal>
          {media ? (
            <Reveal delay={0.12} className="lg:col-span-6">
              {media}
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

function TextBlock({ p }: { p: P }) {
  const onDark = p.tone === "navy";
  const href = safeHref(p.linkHref);
  return (
    <Shell p={p}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          {s(p.eyebrow) ? (
            <span className={cn("label-caps", onDark ? "text-gold-on-brand" : "text-gold")}>{s(p.eyebrow)}</span>
          ) : null}
          <Heading text={s(p.heading)} className="mt-5" />
          {href && s(p.linkLabel) ? (
            <Link
              href={href}
              className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-action"
            >
              {s(p.linkLabel)} <ArrowRight size={16} aria-hidden />
            </Link>
          ) : null}
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-7">
          <div
            className={cn("relative border-l-2 pl-6 md:pl-8", onDark ? "border-gold-on-brand/60" : "border-gold/60")}
          >
            {arr<string>(p.paragraphs).map((para, i) => (
              <p
                key={i}
                className={cn(
                  "max-w-[70ch] leading-relaxed",
                  onDark ? "text-on-brand/80" : "text-foreground-muted",
                  i === 0
                    ? cn("text-lg font-medium md:text-xl", onDark ? "text-on-brand" : "text-foreground")
                    : "mt-5 text-base",
                )}
              >
                {para}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </Shell>
  );
}

function ImageTextBlock({ p }: { p: P }) {
  const onDark = p.tone === "navy";
  const right = p.side === "right";
  return (
    <Shell p={p}>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className={cn(right && "lg:order-2")}>
          {picture(p.picture) ? <Media value={p.picture} /> : <Placeholder>Choose a picture.</Placeholder>}
        </Reveal>
        <Reveal delay={0.08} className="flex flex-col gap-5">
          {s(p.eyebrow) ? (
            <span className={cn("label-caps", onDark ? "text-gold-on-brand" : "text-gold")}>{s(p.eyebrow)}</span>
          ) : null}
          <Heading text={s(p.heading)} />
          {arr<string>(p.paragraphs).map((para, i) => (
            <p
              key={i}
              className={cn("max-w-[60ch] leading-relaxed", onDark ? "text-on-brand/80" : "text-foreground-muted")}
            >
              {para}
            </p>
          ))}
          <Buttons p={p} onDark={onDark} />
        </Reveal>
      </div>
    </Shell>
  );
}

function CardsBlock({ p }: { p: P }) {
  const items: BentoItem[] = arr<P>(p.items).map((item) => ({
    title: s(item.title),
    body: s(item.body) || undefined,
    bullets: arr<string>(item.bullets),
    image: picture(item.picture)?.src,
    href: safeHref(item.href) ?? undefined,
    linkLabel: s(item.linkLabel) || undefined,
  }));
  const layout = s(p.layout) || "grid3";
  const cols = {
    grid2: "md:grid-cols-2",
    grid3: "md:grid-cols-2 lg:grid-cols-3",
    grid4: "md:grid-cols-2 lg:grid-cols-4",
  }[layout];
  return (
    <Shell p={p}>
      <Intro p={p} />
      {layout === "bento" ? (
        <V2Bento items={items} />
      ) : (
        <Stagger className={cn("grid gap-5", cols)}>
          {items.map((item, i) => (
            <StaggerItem key={i} className="h-full">
              <V2Card item={item} index={i} feature={false} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </Shell>
  );
}

function NavyCta({ p }: { p: P }) {
  const href = safeHref(p.buttonHref) ?? site.primaryCta.href;
  return (
    <section className="theme-on-brand relative isolate overflow-hidden bg-brand py-24 text-on-brand md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 hero-ambient opacity-80" />
      <div
        aria-hidden
        className="ambient-orb pointer-events-none absolute right-0 top-0 h-[30rem] w-[30rem] rounded-full bg-gold/15 blur-[140px]"
      />
      <Container className="relative">
        <Reveal className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            {s(p.eyebrow) ? <span className="label-caps text-gold-on-brand">{s(p.eyebrow)}</span> : null}
            <h2 className="heading-plain mt-6 text-[clamp(2.6rem,5vw,4.8rem)] font-bold leading-[0.98] tracking-[-0.045em]">
              <Words variant="rise">{s(p.heading) || "Talk to us."}</Words>
            </h2>
          </div>
          <div className="lg:col-span-5">
            {s(p.body) ? <p className="max-w-[46ch] text-base leading-relaxed text-on-brand/80">{s(p.body)}</p> : null}
            <div className="mt-7 flex flex-wrap items-center gap-5">
              <Button href={href} variant="on-dark" withArrow>
                {s(p.buttonLabel) || "Talk to us"}
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

/** Labels for the builder's layer list. */
export function blockTitle(b: Block): string {
  const p = b.props as P;
  if (b.type === "section") return HOME_SECTIONS[s(p.section) as HomeSection] ?? "Homepage section";
  return s(p.title) || s(p.heading) || s(p.quote).slice(0, 50) || s(p.caption) || BLOCKS[b.type].label;
}
