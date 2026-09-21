"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Words } from "@/components/motion/words";
import { useAutoplay } from "@/components/motion/use-autoplay";
import { services } from "@/content/services";
import { cn } from "@/lib/utils";

/** Pixels a second the ribbon travels on its own — a read, not a ride. */
const DRIFT = 34;

/** How many times the roster is rendered. See the wrap rule in `home-team.tsx` for why it is not 2. */
const COPIES = 3;

/**
 * "Services we offer" — the existing site's service set, directly under the client ribbon where it
 * sits there too, on a ribbon that travels left to right on its own.
 *
 * The mechanics are the leadership ribbon's, for one motion language across the page: a real
 * horizontal scroll container whose `scrollLeft` a rAF loop advances, so a trackpad, a swipe or a
 * drag move the very same property and never fight the animation. The roster is rendered `COPIES`
 * times and `scrollLeft` turns over a copy at a time, so the loop never shows an end.
 *
 * It runs as soon as the section is on screen, and stops under `prefers-reduced-motion` (the CSS
 * then lays the cards out as a static grid), offscreen, on a hidden tab, under the page pause
 * control and for a few seconds after a hand has moved it — see `useAutoplay`.
 *
 * Only the first copy is the real list; the rest are `aria-hidden` with untabbable links, so
 * assistive technology and the keyboard meet each service exactly once while a mouse can still
 * click whichever copy happens to be on screen.
 */
export function HomeServices() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const { running, bump, sectionProps } = useAutoplay(root);
  /** Set while the ribbon is re-anchored on purpose, so the wrap handler does not undo the jump. */
  const suppressWrap = useRef(false);

  // One wrap rule for the drift and for anything done by hand, so travelling past either end lands
  // inside another copy instead of hitting a wall.
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

  if (!services.length) return null;

  return (
    <section
      ref={root}
      id="services"
      data-home-services
      aria-labelledby="home-services-title"
      {...sectionProps}
      className="seamless-section relative scroll-mt-20 overflow-hidden bg-surface py-20 md:py-28"
    >
      <div aria-hidden className="absolute -left-28 top-24 h-96 w-96 rounded-full bg-action/[0.05] blur-[110px]" />
      <div aria-hidden className="absolute -right-24 bottom-8 h-80 w-80 rounded-full bg-gold/[0.06] blur-[110px]" />

      <Container className="relative">
        <Stagger className="mb-14 text-center">
          <StaggerItem>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">What we deliver</p>
          </StaggerItem>
          <StaggerItem>
            <h2
              id="home-services-title"
              className="mx-auto mt-5 max-w-[16ch] text-[clamp(2.65rem,5vw,5rem)] font-semibold leading-[0.97] tracking-[-0.05em]"
            >
              <Words>Services we offer.</Words>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-foreground-muted">
              The SAP core, the analytics around it and the applications either side — each one run by the same
              accountable team.
            </p>
          </StaggerItem>
        </Stagger>
      </Container>

      {/* The ribbon runs the full width of the viewport rather than the container, so cards travel in
          and out of frame from the page edges instead of appearing from behind a margin. */}
      <div
        ref={track}
        data-services-track
        onPointerDown={bump}
        onTouchStart={bump}
        onKeyDown={bump}
        className="services-ribbon video-ribbon-track relative flex overflow-x-auto px-5 pb-3 lg:px-8"
      >
        {Array.from({ length: COPIES }, (_, copy) => (
          <ul
            key={copy}
            aria-hidden={copy > 0 || undefined}
            aria-label={copy === 0 ? "Services we offer" : undefined}
            className={cn("flex shrink-0 gap-4 pr-4", copy === 0 ? "services-ribbon-list" : "services-ribbon-copy")}
          >
            {services.map((service) => (
              <li
                key={service.slug}
                data-service={copy === 0 ? service.slug : undefined}
                className="flex w-[82vw] shrink-0 sm:w-[17.5rem]"
              >
                <Link
                  href={service.href}
                  tabIndex={copy > 0 ? -1 : undefined}
                  className="service-card glass-card group flex h-full w-full flex-col overflow-hidden rounded-feature focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  <span className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden bg-brand">
                    <Image
                      src={service.image}
                      alt={copy === 0 ? service.imageAlt : ""}
                      fill
                      sizes="(min-width: 640px) 17.5rem, 82vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045] motion-reduce:transition-none"
                    />
                  </span>

                  <span className="flex flex-1 flex-col p-5">
                    {/* A fixed line budget for the name: the longest one (ADMS) must not push its own
                        blurb below every neighbour's. */}
                    <h3 className="line-clamp-2 min-h-[2.75rem] text-lg font-semibold leading-tight tracking-[-0.02em] text-foreground transition-colors duration-200 group-hover:text-action">
                      {service.name}
                    </h3>
                    <p className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-foreground-muted">
                      {service.blurb}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-gold">
                      Explore
                      <ArrowUpRight
                        aria-hidden
                        size={17}
                        className="transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none"
                      />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </div>

      <Container className="relative">
        <div className="mt-12 flex justify-center">
          <Button href="/services/" variant="secondary" withArrow>
            See everything we do
          </Button>
        </div>
      </Container>
    </section>
  );
}
