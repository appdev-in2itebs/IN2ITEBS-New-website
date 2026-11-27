"use client";

import { useEffect, useState } from "react";
import type { HeroSlide } from "@/content/home-hero";

/**
 * A Firefly motion clip behind each homepage message (27 Nov 2026). Prompts and settings:
 * docs/FIREFLY_HERO_MOTION_PROMPTS.md. Abstract motion graphics only, in the brand navy, nothing to
 * read and a dark centre where the words sit.
 *
 * Played as ANIMATED IMAGES, not video (owner, 27 Nov): a background <video> is refused by iPhones
 * in Low Power Mode, by data-saver modes and by some in-app browsers, which then show a still or a
 * play button. An animated WebP is an ordinary image, so it plays the same on every current
 * browser (Chrome, Edge, Firefox, Safari on Mac and iPhone, Samsung Internet). Each clip is a
 * 10-second forward-and-back loop at 12 fps, in a 1280 px file for laptops and desktops and a
 * 768 px file for phones; a browser that cannot animate WebP shows the still frame instead.
 *
 * Only the slide on screen (and, for the one-second cross-fade, the one leaving) is in the page,
 * and the next slide's image is fetched in the background so it is ready when its turn comes.
 * Under prefers-reduced-motion the still frame shows and nothing moves.
 */
const CLIPS: Record<string, { large: string; small: string; still: string }> = {
  brand: {
    large: "/video/hero/brand-1280.webp",
    small: "/video/hero/brand-768.webp",
    still: "/video/hero/brand.jpg",
  },
  sap: { large: "/video/hero/sap-1280.webp", small: "/video/hero/sap-768.webp", still: "/video/hero/sap.jpg" },
  applications: {
    large: "/video/hero/applications-1280.webp",
    small: "/video/hero/applications-768.webp",
    still: "/video/hero/applications.jpg",
  },
  platforms: {
    large: "/video/hero/platforms-1280.webp",
    small: "/video/hero/platforms-768.webp",
    still: "/video/hero/platforms.jpg",
  },
  "data-ai": {
    large: "/video/hero/data-ai-1280.webp",
    small: "/video/hero/data-ai-768.webp",
    still: "/video/hero/data-ai.jpg",
  },
};

const WIDE = "(min-width: 768px)";
const FADE_MS = 1000;

export function hasHeroClip(id: string | undefined) {
  return Boolean(id && CLIPS[id]);
}

export function HeroVideos({ slides, active, reduced }: { slides: HeroSlide[]; active: number; reduced: boolean }) {
  // The slide leaving keeps its image for the length of the cross-fade.
  const [leaving, setLeaving] = useState<number | null>(null);
  const [current, setCurrent] = useState(active);

  useEffect(() => {
    if (active === current) return;
    setLeaving(current);
    setCurrent(active);
    const timer = window.setTimeout(() => setLeaving(null), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [active, current]);

  // Fetch the next slide's animation in the background so it is ready when its turn comes.
  useEffect(() => {
    if (reduced || slides.length < 2) return;
    const next = CLIPS[slides[(active + 1) % slides.length]?.id];
    if (!next) return;
    const img = new Image();
    img.src = window.matchMedia(WIDE).matches ? next.large : next.small;
  }, [active, reduced, slides]);

  const layer = (index: number, visible: boolean) => {
    const slide = slides[index];
    const clip = slide && CLIPS[slide.id];
    if (!clip) return null;
    return (
      <picture key={`${slide.id}-${index}`}>
        {reduced ? null : <source media={WIDE} srcSet={clip.large} type="image/webp" />}
        {reduced ? null : <source srcSet={clip.small} type="image/webp" />}
        <img
          src={clip.still}
          alt=""
          decoding="async"
          fetchPriority={index === 0 ? "high" : "auto"}
          className="hero-motion-layer absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: visible ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ease-out`,
            // The still frame sits behind the animation, so there is never an empty frame while
            // the animated file arrives.
            backgroundImage: `url(${clip.still})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </picture>
    );
  };

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {leaving !== null && leaving !== current ? layer(leaving, false) : null}
      {layer(current, true)}
      {/* A navy wash, strongest behind the words, so the headline always reads first. */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_45%,oklch(var(--color-bg-brand)/0.72),oklch(var(--color-bg-brand)/0.35)_60%,oklch(var(--color-bg-brand)/0.15))]" />
    </div>
  );
}
