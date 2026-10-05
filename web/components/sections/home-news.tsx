"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Words } from "@/components/motion/words";
import { useAutoplay } from "@/components/motion/use-autoplay";
import { cn } from "@/lib/utils";
import { insights as shippedInsights } from "@/content/insights";
import type { Insight } from "@/content/types";

/** Pixels a second the strip travels on its own — a read, not a ride. */
const DRIFT = 28;

/** How many times the archive is rendered. See the wrap rule in `home-team.tsx` for why it is not 2. */
const COPIES = 3;

/** "08 DEC" — the badge format the old site used, pinned to UTC so server and client agree. */
const badgeFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  timeZone: "UTC",
});

function badge(iso: string) {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : badgeFormatter.format(date).toUpperCase();
}

/**
 * "News & articles" — the article strip, travelling right to left on its own the way the service
 * and leadership ribbons do, so the closing run of the page shares one motion language.
 *
 * It is a real scroll container whose `scrollLeft` a rAF loop advances, so a trackpad, a swipe or a
 * drag move the very same property and never fight the animation. The archive is rendered `COPIES`
 * times and `scrollLeft` turns over a copy at a time, so the strip never shows an end.
 *
 * It runs as soon as the section is on screen and stops under `prefers-reduced-motion`, offscreen,
 * on a hidden tab, under the page pause control, and for a few seconds after a hand has moved it —
 * see `useAutoplay`. Only the first copy is the real list; the rest are `aria-hidden` with
 * untabbable links, so assistive technology and the keyboard meet each article exactly once.
 */
export function HomeNews({ insights = shippedInsights }: { insights?: Insight[] }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const { running, bump, sectionProps } = useAutoplay(root);
  /** Set while the strip is re-anchored on purpose, so the wrap handler does not undo the jump. */
  const suppressWrap = useRef(false);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const wrap = () => {
      if (suppressWrap.current) return;
      const span = element.scrollWidth / COPIES;
      if (span <= 0) return;
      if (element.scrollLeft >= span * 2) element.scrollLeft -= span;
      else if (element.scrollLeft <= 0) element.scrollLeft += span;
    };
    element.addEventListener("scroll", wrap, { passive: true });
    return () => element.removeEventListener("scroll", wrap);
  }, []);

  useEffect(() => {
    if (!running) return;
    const element = track.current;
    if (!element) return;
    let frame: number;
    let last = performance.now();
    let offset = element.scrollLeft;
    const step = (now: number) => {
      const elapsed = now - last;
      last = now;
      if (!document.hidden && document.documentElement.dataset.motionPaused !== "true") {
        // See home-team.tsx: `scrollLeft` snaps to whole pixels, so the sub-pixel step has to be
        // carried in `offset` or the strip never moves. Re-anchor when something else moved it.
        if (Math.abs(element.scrollLeft - offset) > 1.5) offset = element.scrollLeft;
        offset += (DRIFT * elapsed) / 1000;
        element.scrollLeft = offset;
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame((now) => {
      last = now;
      frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [running]);

  if (!insights.length) return null;

  return (
    <section
      ref={root}
      data-home-news
      aria-labelledby="home-news-title"
      {...sectionProps}
      className="seamless-section relative overflow-hidden border-t border-border-subtle bg-surface py-20 md:py-28"
    >
      <div aria-hidden className="absolute -right-32 top-16 h-96 w-96 rounded-full bg-action/[0.05] blur-[110px]" />

      <Container className="relative">
        {/* Centred like the rest of the closing run. */}
        <Stagger className="mb-10 text-center">
          <StaggerItem>
            <h2
              id="home-news-title"
              className="mx-auto max-w-[16ch] text-[clamp(2.4rem,4.4vw,4rem)] font-semibold leading-[0.98] tracking-[-0.05em]"
            >
              <Words variant="bloom">News &amp; articles.</Words>
            </h2>
          </StaggerItem>
        </Stagger>

        <ul
          ref={track}
          data-news-track
          aria-label="News and articles"
          onPointerDown={bump}
          onTouchStart={bump}
          onKeyDown={bump}
          // No scroll snapping here: snap points fight a continuous drift, dragging each frame back
          // to the nearest card edge instead of letting it travel.
          className="video-ribbon-track -mx-5 flex gap-5 overflow-x-auto px-5 pb-4 lg:-mx-8 lg:px-8"
        >
          {Array.from({ length: COPIES }, (_, copy) =>
            insights.map((article) => {
              // The live listing prints a day and month on every card; only some articles state a
              // year, so fall back to that listing label rather than leaving a card undated.
              const day = badge(article.date) ?? article.dateLabel?.toUpperCase();
              return (
                <li
                  key={`${copy}-${article.slug}`}
                  className={cn("w-[16.5rem] shrink-0", copy === 0 ? "news-list" : "news-copy")}
                  aria-hidden={copy > 0 || undefined}
                >
                  <Link
                    href={article.href ?? `/insights/${article.slug}/`}
                    data-news-article={copy === 0 ? article.slug : undefined}
                    tabIndex={copy > 0 ? -1 : undefined}
                    className="glass-card group flex h-full flex-col overflow-hidden rounded-surface"
                  >
                    <span className="relative block aspect-[16/9] w-full overflow-hidden bg-surface-subtle">
                      {article.image && (
                        <Image
                          src={article.image}
                          alt=""
                          fill
                          sizes="16.5rem"
                          loading="lazy"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                        />
                      )}
                      <span
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-brand/70 via-brand/10 to-transparent"
                      />
                      {/* Every card carries its date, as the live listing does. */}
                      {day && (
                        <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-gold px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-on-action">
                          {day}
                        </span>
                      )}
                    </span>

                    <span className="flex flex-1 flex-col gap-2 p-4">
                      <span className="label-caps text-gold">{article.category}</span>
                      <span className="text-[0.95rem] font-semibold leading-snug tracking-[-0.02em] text-foreground transition-colors group-hover:text-action">
                        {article.title}
                      </span>
                      <span className="line-clamp-2 text-[0.82rem] leading-relaxed text-foreground-muted">
                        {article.excerpt}
                      </span>
                      <span className="mt-auto inline-flex items-center gap-2 pt-3 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-foreground group-hover:text-action">
                        Read more
                        <ArrowRight
                          aria-hidden
                          size={16}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            }),
          )}
        </ul>
        <div className="mt-8 flex justify-center">
          <Link
            href="/insights/"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold hover:underline"
          >
            All insights <ArrowUpRight aria-hidden size={18} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
