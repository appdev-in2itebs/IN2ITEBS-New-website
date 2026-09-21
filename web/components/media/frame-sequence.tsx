"use client";
import { useEffect, useRef, useState } from "react";
import { heroFrameUrl, heroPosterUrl, HERO_FRAME_SETS, type HeroFrameSequence } from "@/content/hero-frames";
import { cn } from "@/lib/utils";

type State = "pending" | "poster" | "loading" | "playing" | "paused";

/**
 * Decorative background footage played as a flip book (owner, 2026-09-21): no video element at
 * all. The clip was sampled into WebP stills by scripts/extract-hero-frames.mjs; this draws them
 * one after another on a canvas at the sequence's frame rate, looping, from the moment enough of
 * them have arrived. Frames are fetched in order in small batches, so the picture starts within a
 * few hundred milliseconds and fills in behind itself.
 *
 * It reports what it is doing on `data-frame-sequence` so tests and styles can react:
 * - `poster`: `prefers-reduced-motion` or data saver — no frame is ever fetched; the poster shows.
 * - `loading`: the first frames are on their way.
 * - `paused`: the page pause control (`html[data-motion-paused="true"]`), a hidden tab or the
 *   section being offscreen. Frames are fetched only once the sequence is first asked to run.
 * - `playing`: running.
 *
 * The set is chosen once on the client (`narrow` under 768px), which keeps the server markup free
 * of any frame request; only the JPEG poster is in the HTML.
 */
export function FrameSequence({ sequence, className }: { sequence: HeroFrameSequence; className?: string }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<State>("pending");
  const [set, setSet] = useState<string | null>(null);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const context = element.getContext("2d");
    if (!context) return;
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;

    const frames: (HTMLImageElement | null)[] = new Array(sequence.frames).fill(null);
    let chosenSet: string | null = null;
    let loadingStarted = false;
    let loadedCount = 0;
    let lastDrawn = -1;
    let onScreen = false;
    let running = false;
    let raf = 0;
    let startedAt = 0;
    let stopRunning: (() => void) | null = null;

    const draw = (index: number) => {
      const image = frames[index];
      if (!image || index === lastDrawn) return;
      element.width = image.naturalWidth;
      element.height = image.naturalHeight;
      context.drawImage(image, 0, 0);
      lastDrawn = index;
    };

    const tick = (now: number) => {
      if (!running) return;
      if (!startedAt) startedAt = now;
      const index = Math.floor(((now - startedAt) / 1000) * sequence.fps) % sequence.frames;
      // A frame that has not arrived yet leaves the last one on screen; the loop never waits.
      if (frames[index]) draw(index);
      raf = requestAnimationFrame(tick);
    };

    /** Fetch the frames in order, a few at a time, so the first ones land before the rest queue. */
    const load = () => {
      if (loadingStarted || !chosenSet) return;
      loadingStarted = true;
      setState("loading");
      let next = 0;
      const BATCH = 6;
      const START_AT = Math.min(sequence.frames, sequence.fps);
      const fetchOne = () => {
        if (next >= sequence.frames) return;
        const index = next++;
        const image = new Image();
        image.decoding = "async";
        image.onload = () => {
          frames[index] = image;
          loadedCount++;
          if (index === 0) draw(0);
          if (loadedCount >= START_AT && running && !raf) {
            setState("playing");
            raf = requestAnimationFrame(tick);
          }
          fetchOne();
        };
        image.onerror = fetchOne;
        image.src = heroFrameUrl(sequence.slug, chosenSet!, index);
      };
      for (let i = 0; i < BATCH; i++) fetchOne();
    };

    const sync = () => {
      const shouldRun = onScreen && root.dataset.motionPaused !== "true" && !document.hidden;
      if (!shouldRun) {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        startedAt = 0;
        setState(loadingStarted ? "paused" : "pending");
        return;
      }
      running = true;
      if (!loadingStarted) load();
      else if (loadedCount >= Math.min(sequence.frames, sequence.fps) && !raf) {
        setState("playing");
        raf = requestAnimationFrame(tick);
      } else if (!raf) setState("loading");
    };
    const startRunning = () => {
      chosenSet = matchMedia("(max-width: 767px)").matches ? HERO_FRAME_SETS.narrow : HERO_FRAME_SETS.wide;
      setSet(chosenSet);
      const visibility = new IntersectionObserver((entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
        sync();
      });
      visibility.observe(wrapper.current ?? element);
      const attributes = new MutationObserver(sync);
      attributes.observe(root, { attributes: true, attributeFilter: ["data-motion-paused"] });
      document.addEventListener("visibilitychange", sync);
      stopRunning = () => {
        visibility.disconnect();
        attributes.disconnect();
        document.removeEventListener("visibilitychange", sync);
        running = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        stopRunning = null;
      };
    };
    // The gate is decided before any observer is wired, so a reduced-motion visitor never sees a
    // frame request, and a change of preference tears the observers down again.
    const evaluate = () => {
      if (reduced.matches || connection?.saveData === true) {
        stopRunning?.();
        setState("poster");
        return;
      }
      if (!stopRunning) startRunning();
    };
    evaluate();
    reduced.addEventListener("change", evaluate);
    return () => {
      reduced.removeEventListener("change", evaluate);
      stopRunning?.();
    };
  }, [sequence]);

  return (
    <div
      ref={wrapper}
      aria-hidden
      data-frame-sequence={state}
      data-frame-set={set ?? undefined}
      data-frame-count={sequence.frames}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* The poster paints first and stays under the canvas, so an undrawn canvas is never a hole. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={heroPosterUrl(sequence.slug)}
        alt=""
        width={sequence.width}
        height={sequence.height}
        className="ambient-video absolute inset-0 h-full w-full object-cover"
      />
      <canvas
        ref={canvas}
        width={sequence.width}
        height={sequence.height}
        className="ambient-video absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
