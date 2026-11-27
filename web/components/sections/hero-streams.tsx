"use client";

import { useEffect, useRef } from "react";

/**
 * The homepage hero's background (owner's choice, 27 Nov 2026: sample C, "Converged Streams").
 *
 * Streams of light flow in from both edges and converge into one glowing core under the headline,
 * the picture of the line under our logo, "Converged Intelligence". Small points of light ride the
 * streams towards the core. Drawn on a canvas: no image to load, sharp on any screen, a few
 * kilobytes of code.
 *
 * The centre stays calm (light fades where the words sit). The loop pauses while the hero is
 * offscreen, while the tab is hidden and under the site's motion pause control; with
 * prefers-reduced-motion it draws one still frame.
 */

const GLOW: [number, number, number] = [110, 185, 255];
const ICE: [number, number, number] = [175, 210, 245];
const SPARK: [number, number, number] = [225, 242, 255];
const rgba = (c: [number, number, number], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

type Line = { side: 1 | -1; k: number; ph: number; amp: number; w: number };
type Dot = { l: Line; s: number; v: number };

export function HeroStreams({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let frame = 0;
    let visible = true;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const lines: Line[] = Array.from({ length: 34 }, (_, i) => ({
      side: i % 2 ? 1 : -1,
      k: i / 34,
      ph: rand(0, 6.28),
      amp: rand(20, 70),
      w: rand(0.6, 1.8),
    }));
    let dots: Dot[] = [];

    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // 0 behind the words, 1 away from them.
    const calm = (x: number, y: number) => {
      const dx = (x - W / 2) / (W * 0.3);
      const dy = (y - H * 0.45) / (H * 0.32);
      return Math.min(1, Math.max(0.12, Math.hypot(dx, dy) - 0.35));
    };

    const point = (l: Line, s: number, t: number): [number, number] => {
      const cx = W / 2;
      const cy = H * 0.92;
      const sx = l.side < 0 ? -40 : W + 40;
      const sy = H * (0.1 + l.k * 0.9);
      const e = s * s * (3 - 2 * s);
      return [sx + (cx - sx) * s, sy + (cy - sy) * e + Math.sin(s * 5 + l.ph + t / 1600) * l.amp * (1 - s)];
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      for (const l of lines) {
        ctx.beginPath();
        for (let s = 0; s <= 1.0001; s += 0.02) {
          const [x, y] = point(l, s, t);
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const g = ctx.createLinearGradient(l.side < 0 ? 0 : W, 0, W / 2, 0);
        g.addColorStop(0, rgba(GLOW, 0));
        g.addColorStop(0.55, rgba(ICE, 0.28 * l.w));
        g.addColorStop(1, rgba(GLOW, 0.55));
        ctx.strokeStyle = g;
        ctx.lineWidth = l.w;
        ctx.stroke();
      }
      if (!reduce && Math.random() < 0.35) {
        dots.push({ l: lines[Math.floor(Math.random() * lines.length)], s: 0, v: rand(0.0025, 0.006) });
      }
      dots = dots.filter((d) => (d.s += d.v) < 1);
      for (const d of dots) {
        const [x, y] = point(d.l, d.s, t);
        ctx.fillStyle = rgba(SPARK, 0.9 * Math.sin(d.s * Math.PI) * calm(x, y));
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, 7);
        ctx.fill();
      }
      const cx = W / 2;
      const cy = H * 0.92;
      const r = 260 * (0.7 + 0.3 * Math.sin(t / 900));
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      core.addColorStop(0, rgba([210, 236, 255], 0.55));
      core.addColorStop(0.25, rgba(GLOW, 0.22));
      core.addColorStop(1, rgba(GLOW, 0));
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 7);
      ctx.fill();
    };

    const start = performance.now();
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible || document.hidden || document.documentElement.dataset.motionPaused === "true") return;
      draw(now - start);
    };

    size();
    if (reduce) draw(0);
    else frame = requestAnimationFrame(loop);

    const onResize = () => {
      size();
      if (reduce) draw(0);
    };
    window.addEventListener("resize", onResize);
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
