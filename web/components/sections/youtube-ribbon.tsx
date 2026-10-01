"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { YOUTUBE_CHANNEL_URL, youtubeVideos, type YoutubeVideo } from "@/content/youtube";

/**
 * YouTube Ribbon section featuring:
 * 1. Continuous smooth auto-scrolling carousel (left to right) with pause on hover/focus.
 * 2. Uniform 16:9 cards with fixed heights and clean self-hosted thumbnails (play icon removed).
 * 3. In-site modal video player for watching videos directly on the website (framed bounded lightbox).
 */
export function YoutubeRibbon() {
  const track = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);
  const [activeVideo, setActiveVideo] = useState<YoutubeVideo | null>(null);

  // Smooth continuous auto-scroll track (left to right)
  useEffect(() => {
    if (paused || activeVideo || !youtubeVideos.length) return;
    const el = track.current;
    if (!el) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    // See home-team.tsx: `scrollLeft` snaps to whole pixels, so a sub-pixel step per frame is lost
    // on read and the ribbon barely moves. The fraction is carried here and the total assigned.
    let offset = el.scrollLeft;

    const scrollStep = (time: number) => {
      if (!el) return;
      const delta = time - lastTime;
      lastTime = time;

      // Smooth continuous scrolling speed (~30px per second). The page pause control and a hidden
      // tab stop it, the same contract the team, service and article ribbons keep.
      if (!document.hidden && document.documentElement.dataset.motionPaused !== "true") {
        if (Math.abs(el.scrollLeft - offset) > 1.5) offset = el.scrollLeft;
        offset += (30 * delta) / 1000;
        el.scrollLeft = offset;
      }

      // Wrap around seamlessly when reaching the end of the track
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) {
        el.scrollLeft = 0;
        offset = 0;
      }

      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame((time) => {
      lastTime = time;
      animationFrameId = requestAnimationFrame(scrollStep);
    });

    return () => cancelAnimationFrame(animationFrameId);
  }, [paused, activeVideo]);

  // Handle escape key to close video modal
  useEffect(() => {
    if (!activeVideo) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeVideo]);

  if (!youtubeVideos.length) return null;

  return (
    <section
      data-youtube-ribbon
      aria-label="Latest videos from the In2IT EBS channel"
      className="overflow-x-hidden border-t border-border-subtle bg-surface py-14 md:py-20"
    >
      <Container>
        {/* The arrows went on 2026-09-17 at the owner's request ("the arrows under any animation i
            dont need"). They had been kept as `sr-only` buttons, which is worse than removing them:
            they sat under the cards where no pointer could reach them, and the ribbon is a real
            scroll container that a trackpad, a swipe and the keyboard already move. The channel
            link stays — it is the section's only piece of navigation. */}
        <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="sr-only">
          Visit our YouTube channel
        </a>

        {/* Carousel Track with Continuous Auto-scroll and Hover Pause */}
        <ul
          ref={track}
          data-youtube-track
          aria-label="Latest videos, newest first"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
          }}
          className="video-ribbon-track -mx-5 flex gap-5 overflow-x-auto px-5 pb-4 lg:-mx-8 lg:px-8 scrollbar-none"
        >
          {youtubeVideos.map((video) => (
            <li key={video.id} className="w-[18.5rem] sm:w-[20rem] shrink-0 snap-start flex flex-col">
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                data-youtube-video={video.id}
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                    e.preventDefault();
                    setActiveVideo(video);
                  }
                }}
                className="glass-card group flex flex-col h-full overflow-hidden rounded-surface transition-all duration-300 hover:shadow-lg hover:border-gold/40"
              >
                {/* 16:9 Clean Thumbnail without Play Icon */}
                <span className="relative block aspect-video w-full bg-logo-surface overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/youtube/${video.id}.jpg`}
                    alt={video.title}
                    width={480}
                    height={360}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </span>

                {/* Card Content - Clean Uniform Height (Date removed) */}
                <span className="flex flex-col justify-between flex-1 p-4 bg-surface/50">
                  <span className="line-clamp-2 text-sm font-semibold text-foreground leading-snug">{video.title}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* In-Site Video Modal Lightbox (Framed bounded modal like Screenshot 1) */}
        {activeVideo && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setActiveVideo(null)}
          >
            <div
              className="relative w-full max-w-3xl md:max-w-4xl overflow-hidden rounded-feature bg-surface shadow-2xl border border-glass/40 my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3.5 md:px-6 md:py-4">
                <h3
                  id="video-modal-title"
                  className="text-sm md:text-base font-semibold text-foreground line-clamp-1 pr-4"
                >
                  {activeVideo.title}
                </h3>
                <button
                  type="button"
                  aria-label="Close video"
                  onClick={() => setActiveVideo(null)}
                  className="glass-pill h-8 w-8 md:h-9 md:w-9 justify-center p-0 text-foreground hover:text-action shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Embedded 16:9 YouTube Video Player */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>

              {/* Modal Footer with External Direct Link (Date removed) */}
              <div className="flex items-center justify-end border-t border-border-subtle px-5 py-3 md:px-6 md:py-3.5 bg-subtle/30">
                <a
                  href={`https://www.youtube.com/watch?v=${activeVideo.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-1.5 text-xs font-semibold text-on-action shadow-md transition-transform hover:scale-105"
                >
                  Open on YouTube <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
