import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Words } from "@/components/motion/words";
import { cn } from "@/lib/utils";

/**
 * The bento cards of the v2 page design (see v2.tsx). Kept apart from the hero, which reads the CMS
 * on the server, so the admin's page builder can render the same cards in its live preview.
 */

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

/** Entrance order inside a card (globals.css, "Cinematic entrances"): milliseconds after the card. */
const cine = (ms: number) => ({ "--cine-d": `${ms}ms` }) as CSSProperties;
/** Text arrives after the icon and the title; list items follow it one by one. */
const TEXT_AT = 420;
const itemAt = (index: number) => cine(TEXT_AT + 120 + Math.min(index, 10) * 90);

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
      {items.map((item, index) => (
        <li
          key={item}
          style={itemAt(index)}
          className={cn(
            "cine-item cine-left flex gap-3 text-[0.95rem] leading-relaxed",
            onDark ? "text-on-brand/80" : "text-foreground-muted",
          )}
        >
          <span
            aria-hidden
            className={cn("cine-dot mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full", onDark ? "bg-gold-on-brand" : "bg-gold")}
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
        <li
          key={item.label}
          style={itemAt(index)}
          className="cine-item cine-left flex gap-3 text-[0.95rem] leading-relaxed"
        >
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
        "cine group relative flex h-full flex-col overflow-hidden rounded-feature border border-border-subtle/70 bg-surface p-7 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-gold-soft/70 hover:shadow-glass-hover md:p-8",
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
            style={cine(0)}
            className={cn(
              "cine-pop relative inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-control",
              feature ? "bg-on-brand/95 p-1.5" : "bg-logo-surface p-1.5 ring-1 ring-border-subtle",
            )}
          >
            <Image src={item.iconImage} alt="" width={56} height={56} className="h-full w-full object-contain" />
            <span aria-hidden className="cine-sheen" style={cine(0)} />
          </span>
        ) : Icon ? (
          <span
            style={cine(0)}
            className={cn(
              "cine-pop relative inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-control",
              feature ? "bg-on-brand/10 text-gold-on-brand ring-1 ring-on-brand/15" : "icon-tile",
            )}
          >
            <Icon size={26} strokeWidth={1.5} />
            <span aria-hidden className="cine-sheen" style={cine(0)} />
          </span>
        ) : (
          <span />
        )}
        <span
          aria-hidden
          style={cine(120)}
          className={cn(
            "cine-slide label-caps pt-1 tabular-nums",
            feature ? "text-gold-on-brand" : "text-foreground-muted",
          )}
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
            <Words>{item.title}</Words>
          </Link>
        ) : (
          <Words>{item.title}</Words>
        )}
      </h3>
      {item.body ? (
        <p
          style={cine(TEXT_AT)}
          className={cn(
            "cine-focus relative mt-4 text-[0.95rem] leading-relaxed",
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
          style={cine(TEXT_AT + 300)}
          className={cn(
            "cine-focus relative mt-auto inline-flex min-h-11 items-center gap-2 pt-6 text-sm font-semibold",
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
