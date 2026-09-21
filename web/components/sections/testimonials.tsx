"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Words } from "@/components/motion/words";
import { useAutoplay } from "@/components/motion/use-autoplay";
import { ClientLogo } from "@/components/sections/client-logo";
import { clients } from "@/content/clients";
import { testimonials } from "@/content/testimonials";
import { cn } from "@/lib/utils";

/** Milliseconds a quote holds before the row steps on by one. */
const INTERVAL = 7000;

/** The roster is rendered twice so the row can turn over without ever showing an end. */
const COPIES = 2;

/**
 * "What people say" — the client quotes as a row that steps on one at a time: the leading quote
 * leaves, the one beside it takes its place, and a new one arrives behind it. Two are in view on a
 * desktop and one on a phone, which the card width decides in CSS rather than JavaScript.
 *
 * It is a real scroll container, so the step and a finger on a phone move the same property and
 * cannot fight each other; scroll snapping lands every step on a card edge. The roster is rendered
 * twice and `scrollLeft` turns over at the halfway mark, so the row never reaches an end.
 *
 * Stepping starts as soon as the section is on screen, so the row is already flowing by the time
 * anyone reaches it. It stops under `prefers-reduced-motion`, while the section is offscreen, on a
 * hidden tab, under the page pause control (`html[data-motion-paused]`), and for a few seconds
 * after the keyboard or a hand has moved the row — see `useAutoplay`. Merely hovering does not
 * stop it: that is how it used to be, and since a reader's pointer sits over the section they are
 * reading, the row only ever stepped once they had moved away from it.
 *
 * The speakers' portraits underneath are the pagination: the live quote's face is full colour and
 * ringed, the rest sit back in greyscale until hovered, focused or chosen. Only the first copy of
 * the roster is real; the second is `aria-hidden` with untabbable links.
 */
export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const { running, bump, sectionProps } = useAutoplay(root);
  const [lead, setLead] = useState(0);
  /** Set while the row is re-anchored on purpose, so the wrap handler does not undo the jump. */
  const suppressWrap = useRef(false);

  /** Width of one card plus the gap — measured, because the card width is a CSS breakpoint call. */
  const stepWidth = () => {
    const element = track.current;
    const card = element?.firstElementChild as HTMLElement | undefined;
    if (!element || !card) return 0;
    const gap = parseFloat(getComputedStyle(element).columnGap || "0") || 0;
    return card.offsetWidth + gap;
  };

  // Which quote currently leads the row, so the portrait picker can mark it.
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const sync = () => {
      const step = stepWidth();
      if (!step) return;
      setLead(Math.round(element.scrollLeft / step) % testimonials.length);
      if (suppressWrap.current) return;
      const half = element.scrollWidth / COPIES;
      if (half > 0 && element.scrollLeft >= half) element.scrollLeft -= half;
    };
    sync();
    element.addEventListener("scroll", sync, { passive: true });
    return () => element.removeEventListener("scroll", sync);
  }, []);

  const stepBy = useCallback((cards: number) => {
    const element = track.current;
    if (!element) return;
    const step = stepWidth();
    if (!step) return;
    const half = element.scrollWidth / COPIES;
    let target = element.scrollLeft + cards * step;
    // Re-anchor before the animation rather than letting it cross the seam mid-flight: a smooth
    // scroll and the wrap handler writing `scrollLeft` at once end up fighting each other.
    if (target >= half) {
      suppressWrap.current = true;
      element.scrollLeft -= half;
      target -= half;
      requestAnimationFrame(() => {
        suppressWrap.current = false;
      });
    }
    element.scrollTo({ left: target, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      if (document.hidden || document.documentElement.dataset.motionPaused === "true") return;
      stepBy(1);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [running, stepBy]);

  /** Jump straight to a speaker from their portrait, and hold the row there long enough to read. */
  const goTo = (index: number) => {
    const element = track.current;
    const step = stepWidth();
    if (!element || !step) return;
    bump();
    element.scrollTo({ left: index * step, behavior: "smooth" });
  };

  if (!testimonials.length) return null;

  return (
    <section
      ref={root}
      data-testimonials
      aria-labelledby="testimonials-title"
      aria-roledescription="carousel"
      {...sectionProps}
      className="seamless-section relative overflow-hidden bg-surface py-20 md:py-28"
    >
      <div aria-hidden className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-action/[0.06] blur-[100px]" />
      <div aria-hidden className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-gold/[0.07] blur-[110px]" />

      <Container className="relative">
        <Stagger className="text-center">
          <StaggerItem>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">In our clients&rsquo; words</p>
          </StaggerItem>
          <StaggerItem>
            <h2
              id="testimonials-title"
              /* `heading-plain` is required by the `type` variant: the clip only bites if a single
                 element paints the glyphs, and that element is the span, not this h2. */
              className="heading-plain mx-auto mt-5 max-w-[18ch] text-[clamp(2.4rem,4.4vw,4rem)] font-semibold leading-[0.98] tracking-[-0.05em]"
            >
              <Words variant="type">What people say.</Words>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-foreground-muted">
              Programme sponsors, CHROs and finance leaders on what changed once the work was done.
            </p>
          </StaggerItem>
        </Stagger>

        <Reveal className="relative mt-12">
          <ul
            ref={track}
            data-testimonial-track
            // No card here holds a link, so the row itself has to take focus or the keyboard
            // cannot move it at all (axe: scrollable-region-focusable).
            tabIndex={0}
            aria-label="What our clients say — use the arrow keys to move through the quotes"
            onPointerDown={bump}
            onTouchStart={bump}
            onKeyDown={bump}
            className="video-ribbon-track -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-pl-5 px-5 pb-3 lg:-mx-8 lg:scroll-pl-8 lg:px-8"
          >
            {Array.from({ length: COPIES }, (_, copy) =>
              testimonials.map((item) => {
                const client = clients.find((entry) => entry.slug === item.clientSlug);
                return (
                  <li
                    key={`${copy}-${item.slug}`}
                    data-testimonial={copy === 0 ? item.slug : undefined}
                    aria-hidden={copy > 0 || undefined}
                    className="w-[min(100%,26rem)] shrink-0 snap-start md:w-[calc(50%-0.625rem)]"
                  >
                    <figure className="glass-card relative flex h-full flex-col rounded-feature px-6 pb-6 pt-14 md:px-7">
                      <Quote
                        aria-hidden
                        size={30}
                        strokeWidth={1.4}
                        className="absolute left-6 top-5 rotate-180 text-gold/60 md:left-7"
                      />
                      <blockquote className="line-clamp-[9] text-pretty text-sm leading-relaxed text-foreground md:text-[0.95rem] md:leading-[1.75]">
                        {item.quote}
                      </blockquote>
                      <figcaption className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-border-subtle pt-5">
                        <span className="block h-12 w-12 shrink-0 overflow-hidden rounded-full bg-logo-surface ring-1 ring-gold/30">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.photo}
                            alt={copy === 0 ? item.name : ""}
                            width={96}
                            height={96}
                            loading="lazy"
                            className="h-full w-full object-cover object-top"
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold tracking-[-0.01em] text-foreground">
                            {item.name}
                          </span>
                          <span className="mt-0.5 block text-xs text-foreground-muted">{item.role}</span>
                        </span>
                        {client && (
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-logo-surface p-2 sm:ml-auto">
                            <ClientLogo client={client} className="h-full w-full max-w-none object-contain" />
                          </span>
                        )}
                      </figcaption>
                    </figure>
                  </li>
                );
              }),
            )}
          </ul>

          {/* Portraits in place of dots: the same direct access, but you can see whose quote you are
              moving to. Each button clears the 24px target WCAG 2.2 asks for (SC 2.5.8) several
              times over, and the portrait inside it is decorative — the button's own label already
              names the speaker, so the image must not be announced a second time. */}
          <ul className="mt-8 flex items-center justify-center gap-1 sm:gap-2">
            {testimonials.map((item, index) => (
              <li key={item.slug}>
                <button
                  type="button"
                  aria-current={index === lead ? "true" : undefined}
                  aria-label={`Show the testimonial from ${item.name}`}
                  onClick={() => goTo(index)}
                  className="group/face flex h-14 w-14 items-center justify-center rounded-full"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "block h-11 w-11 overflow-hidden rounded-full bg-logo-surface ring-2 ring-offset-2 ring-offset-surface transition-all duration-500 ease-out motion-reduce:transition-none",
                      index === lead
                        ? "scale-100 opacity-100 ring-gold grayscale-0"
                        : "scale-90 opacity-60 grayscale ring-transparent group-hover/face:scale-100 group-hover/face:opacity-100 group-hover/face:grayscale-0 group-hover/face:ring-gold/50 group-focus-visible/face:scale-100 group-focus-visible/face:opacity-100 group-focus-visible/face:grayscale-0 group-focus-visible/face:ring-gold/50",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.photo}
                      alt=""
                      width={88}
                      height={88}
                      loading="lazy"
                      className="h-full w-full object-cover object-top"
                    />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex justify-center">
            <Link
              href="/case-studies/"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold hover:underline"
            >
              Read the customer stories <ArrowUpRight aria-hidden size={17} />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
