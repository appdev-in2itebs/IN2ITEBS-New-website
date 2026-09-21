"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LinkedInMark } from "@/components/ui/linkedin-mark";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Words } from "@/components/motion/words";
import { useAutoplay } from "@/components/motion/use-autoplay";
import { leadership, leaderInitials } from "@/content/leadership";
import { cn } from "@/lib/utils";

/** Pixels a second the roster drifts by on its own — a read, not a ride. */
const DRIFT = 26;

/** How many times the roster is rendered. See the wrap rule below for why it is not 2. */
const COPIES = 3;

/**
 * "Meet our team" — the senior leadership on a ribbon that drifts left on its own and that anyone
 * can also drag, swipe, wheel or page through in either direction.
 *
 * It is a real scroll container rather than a CSS transform marquee, which is what makes both true
 * at once: the drift is `scrollLeft` advancing a few pixels a frame, so a trackpad, a touch swipe or
 * the arrow buttons move the same property and never fight the animation. The roster is rendered
 * `COPIES` times and `scrollLeft` is turned over a copy at a time, so the loop is seamless in both
 * directions with no visible jump at the seam.
 *
 * The drift starts as soon as the section is on screen, so the ribbon is already moving by the time
 * anyone reads it. It stops under `prefers-reduced-motion` (the CSS then lays the roster out as a
 * static grid), while the section is offscreen, on a hidden tab, under the page pause control, and
 * for a few seconds after the keyboard or a hand has moved it — see `useAutoplay`. Merely hovering
 * does not stop it: that is how it used to be, and it meant the drift only ever ran once you had
 * moved the pointer off the section you were looking at.
 *
 * Only the first copy is the real roster; the rest are `aria-hidden` with untabbable links, so
 * assistive technology and the keyboard meet each leader exactly once while a mouse can still click
 * whichever copy happens to be on screen.
 */
export function HomeTeam() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const { running, bump, sectionProps } = useAutoplay(root);
  /** Set while the ribbon is re-anchored on purpose, so the wrap handler does not undo the jump. */
  const suppressWrap = useRef(false);

  // One wrap rule for both the drift and anything the visitor does by hand, so a swipe past either
  // end lands inside another copy instead of hitting a wall.
  //
  // The resting range is [0, 2 × span), not [0, span): a browser cannot scroll past
  // `scrollWidth - clientWidth`, and with a short roster one copy is barely wider than the
  // container, which would put a wrap point at `span` out of reach and stall the drift at the end.
  // Keeping COPIES at 3 and turning over a copy early keeps the wrap point comfortably reachable.
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
    const step = (now: number) => {
      const elapsed = now - last;
      last = now;
      if (!document.hidden && document.documentElement.dataset.motionPaused !== "true") {
        element.scrollLeft += (DRIFT * elapsed) / 1000;
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame((now) => {
      last = now;
      frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [running]);

  if (!leadership.length) return null;

  return (
    <section
      ref={root}
      id="team"
      data-home-team
      aria-labelledby="home-team-title"
      {...sectionProps}
      className="seamless-section relative scroll-mt-20 overflow-hidden bg-surface py-20 md:py-28"
    >
      <div aria-hidden className="absolute -left-24 top-16 h-96 w-96 rounded-full bg-action/[0.05] blur-[110px]" />
      <div aria-hidden className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-gold/[0.06] blur-[110px]" />

      <Container className="relative">
        <Stagger className="mb-10 text-center">
          <StaggerItem>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">The people behind the work</p>
          </StaggerItem>
          <StaggerItem>
            <h2
              id="home-team-title"
              className="mx-auto mt-5 max-w-[16ch] text-[clamp(2.4rem,4.4vw,4rem)] font-semibold leading-[0.98] tracking-[-0.05em]"
            >
              <Words>Meet our team.</Words>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-foreground-muted">
              Founder-led, with leadership that has built and scaled enterprise practices across India, the Middle East,
              Africa and South-East Asia.
            </p>
          </StaggerItem>
        </Stagger>

        <div
          ref={track}
          data-team-track
          onPointerDown={bump}
          onTouchStart={bump}
          onKeyDown={bump}
          className="team-ribbon video-ribbon-track -mx-5 flex overflow-x-auto px-5 pb-4 lg:-mx-8 lg:px-8"
        >
          {Array.from({ length: COPIES }, (_, copy) => (
            <ul
              key={copy}
              aria-hidden={copy > 0 || undefined}
              aria-label={copy === 0 ? "In2IT EBS leadership" : undefined}
              className={cn("flex shrink-0 gap-5 pr-5", copy === 0 ? "team-ribbon-list" : "team-ribbon-copy")}
            >
              {leadership.map((leader) => (
                <li key={leader.slug} data-team-member={leader.slug} className="flex w-[18rem] shrink-0">
                  <article className="glass-card group flex h-full w-full flex-col gap-3.5 rounded-feature p-5">
                    <div className="flex items-center gap-4">
                      {leader.photo ? (
                        <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-surface ring-1 ring-border-subtle">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={leader.photo}
                            alt={copy === 0 ? leader.name : ""}
                            width={128}
                            height={128}
                            loading="lazy"
                            className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                          />
                        </span>
                      ) : (
                        <span
                          aria-hidden
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-surface bg-gold/10 text-base font-semibold tracking-[-0.02em] text-gold ring-1 ring-gold/25 transition-colors duration-300 group-hover:bg-gold/15"
                        >
                          {leaderInitials(leader.name)}
                        </span>
                      )}
                      {/* Fixed line budgets for the name and the title: a two-line name must not push
                          one card's bio below its neighbours'. */}
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 min-h-[2.4rem] text-[0.95rem] font-semibold leading-tight tracking-[-0.02em] text-foreground">
                          {leader.name}
                        </h3>
                        <p className="label-caps mt-1 line-clamp-2 block text-[0.66rem] leading-tight text-gold">
                          {leader.title}
                        </p>
                      </div>
                    </div>

                    {/* The bios run from one line to a full page on the source pages, so the card shows
                        a fixed five and /about/#leadership carries every word. */}
                    <p className="line-clamp-4 min-h-[5.1rem] text-[0.84rem] leading-relaxed text-foreground-muted">
                      {leader.bio}
                    </p>

                    {leader.linkedin ? (
                      <a
                        href={leader.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={copy > 0 ? -1 : undefined}
                        className="mt-auto inline-flex min-h-11 items-center gap-2 text-[0.84rem] font-semibold text-gold hover:underline"
                      >
                        <LinkedInMark />
                        LinkedIn
                      </a>
                    ) : (
                      <span aria-hidden className="mt-auto min-h-11" />
                    )}
                  </article>
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/about/#leadership"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold hover:underline"
          >
            Read the full profiles <ArrowUpRight aria-hidden size={18} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
