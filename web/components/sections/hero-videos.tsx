"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HeroSlide } from "@/content/home-hero";

/**
 * A Firefly motion clip behind each homepage message (27 Nov 2026). Prompts and settings:
 * docs/FIREFLY_HERO_MOTION_PROMPTS.md. Abstract motion graphics only, in the brand navy, nothing to
 * read and a dark centre where the words sit.
 *
 * Three ways to play, picked per visitor, so it is sharp where it can be and plays everywhere:
 *  1. VIDEO (default): Full HD on laptops and desktops, 1080 px on phones; VP9 WebM for Chrome,
 *     Edge, Firefox and Android, H.264 MP4 for Safari and iPhone. Sharpest for the bytes.
 *  2. ANIMATED IMAGE: if a browser refuses to start a background video (iPhone Low Power Mode,
 *     some in-app browsers) or it has not started within a few seconds, the same clip plays as an
 *     animated WebP, which no browser blocks.
 *  3. STILL: with reduced motion or data saver switched on, the still frame only.
 *
 * Only the slide on screen (and, for the one-second cross-fade, the one leaving) is in the page;
 * the next slide's clip is fetched in the background. A still frame sits behind each clip, so
 * there is never an empty frame while it loads.
 */
type Clip = { v1920: [string, string]; v1080: [string, string]; anim: [string, string]; still: string };
const CLIPS: Record<string, Clip> = {
  brand: {
    v1920: ["/video/hero/brand-1920.webm", "/video/hero/brand-1920.mp4"],
    v1080: ["/video/hero/brand-1080.webm", "/video/hero/brand-1080.mp4"],
    anim: ["/video/hero/brand-1280.webp", "/video/hero/brand-768.webp"],
    still: "/video/hero/brand.jpg",
  },
  sap: {
    v1920: ["/video/hero/sap-1920.webm", "/video/hero/sap-1920.mp4"],
    v1080: ["/video/hero/sap-1080.webm", "/video/hero/sap-1080.mp4"],
    anim: ["/video/hero/sap-1280.webp", "/video/hero/sap-768.webp"],
    still: "/video/hero/sap.jpg",
  },
  applications: {
    v1920: ["/video/hero/applications-1920.webm", "/video/hero/applications-1920.mp4"],
    v1080: ["/video/hero/applications-1080.webm", "/video/hero/applications-1080.mp4"],
    anim: ["/video/hero/applications-1280.webp", "/video/hero/applications-768.webp"],
    still: "/video/hero/applications.jpg",
  },
  platforms: {
    v1920: ["/video/hero/platforms-1920.webm", "/video/hero/platforms-1920.mp4"],
    v1080: ["/video/hero/platforms-1080.webm", "/video/hero/platforms-1080.mp4"],
    anim: ["/video/hero/platforms-1280.webp", "/video/hero/platforms-768.webp"],
    still: "/video/hero/platforms.jpg",
  },
  "data-ai": {
    v1920: ["/video/hero/data-ai-1920.webm", "/video/hero/data-ai-1920.mp4"],
    v1080: ["/video/hero/data-ai-1080.webm", "/video/hero/data-ai-1080.mp4"],
    anim: ["/video/hero/data-ai-1280.webp", "/video/hero/data-ai-768.webp"],
    still: "/video/hero/data-ai.jpg",
  },
};

const WIDE = "(min-width: 768px)";
const FADE_MS = 1000;
/** A video that has its data but still has not started by now is treated as blocked. */
const START_TIMEOUT_MS = 6000;

type Mode = "video" | "image" | "still";

export function hasHeroClip(id: string | undefined) {
  return Boolean(id && CLIPS[id]);
}

function canPlayWebm() {
  if (typeof document === "undefined") return true;
  return document.createElement("video").canPlayType('video/webm; codecs="vp9"') !== "";
}

export function HeroVideos({ slides, active, reduced }: { slides: HeroSlide[]; active: number; reduced: boolean }) {
  const [leaving, setLeaving] = useState<number | null>(null);
  const [current, setCurrent] = useState(active);
  const [mode, setMode] = useState<Mode>("video");
  const [wide, setWide] = useState(true);
  const [webm, setWebm] = useState(true);
  const blocked = useCallback(() => setMode((m) => (m === "video" ? "image" : m)), []);

  // Decide once on the visitor's device: screen size, codec, data saver, reduced motion.
  useEffect(() => {
    const mq = window.matchMedia(WIDE);
    setWide(mq.matches);
    setWebm(canPlayWebm());
    const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    if (reduced || saveData) setMode("still");
    const onChange = () => setWide(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [reduced]);

  useEffect(() => {
    if (active === current) return;
    setLeaving(current);
    setCurrent(active);
    const timer = window.setTimeout(() => setLeaving(null), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [active, current]);

  const videoSrc = (clip: Clip) => {
    const pair = wide ? clip.v1920 : clip.v1080;
    return webm ? pair[0] : pair[1];
  };

  // Fetch the next slide's clip in the background so it is ready when its turn comes.
  useEffect(() => {
    if (mode === "still" || slides.length < 2) return;
    const next = CLIPS[slides[(active + 1) % slides.length]?.id];
    if (!next) return;
    if (mode === "video") {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "video";
      link.href = videoSrc(next);
      document.head.appendChild(link);
      return () => link.remove();
    }
    const img = new Image();
    img.src = wide ? next.anim[0] : next.anim[1];
    // videoSrc depends only on wide/webm, both listed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, mode, slides, wide, webm]);

  const layer = (index: number, visible: boolean) => {
    const slide = slides[index];
    const clip = slide && CLIPS[slide.id];
    if (!clip) return null;
    const style = {
      opacity: visible ? 1 : 0,
      transition: `opacity ${FADE_MS}ms ease-out`,
      backgroundImage: `url(${clip.still})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    } as const;
    const key = `${slide.id}-${index}-${mode}`;
    if (mode === "video") {
      return <HeroVideo key={key} src={videoSrc(clip)} poster={clip.still} style={style} onBlocked={blocked} />;
    }
    return (
      <picture key={key}>
        {mode === "image" ? <source media={WIDE} srcSet={clip.anim[0]} type="image/webp" /> : null}
        {mode === "image" ? <source srcSet={clip.anim[1]} type="image/webp" /> : null}
        <img
          src={clip.still}
          alt=""
          decoding="async"
          className="hero-motion-layer absolute inset-0 h-full w-full object-cover"
          style={style}
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

/** One background clip. Reports itself blocked if the browser refuses or never starts it. */
function HeroVideo({
  src,
  poster,
  style,
  onBlocked,
}: {
  src: string;
  poster: string;
  style: React.CSSProperties;
  onBlocked: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let started = false;
    const onPlaying = () => (started = true);
    video.addEventListener("playing", onPlaying);
    video.muted = true;
    const attempt = video.play();
    if (attempt) attempt.catch(() => onBlocked());
    // A slow connection is not a block: only a video that has loaded enough to play and still
    // sits paused counts (autoplay silently refused).
    const timer = window.setTimeout(() => {
      if (!started && video.paused && video.readyState >= 3) onBlocked();
    }, START_TIMEOUT_MS);
    return () => {
      window.clearTimeout(timer);
      video.removeEventListener("playing", onPlaying);
    };
  }, [src, onBlocked]);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      disablePictureInPicture
      className="hero-motion-layer absolute inset-0 h-full w-full object-cover"
      style={style}
    />
  );
}
