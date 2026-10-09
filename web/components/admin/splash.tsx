"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

/**
 * The In2IT EBS post-login splash, variant "Converge" (D:\MY_SKILL\in2it-brand-ui\SKILL.md §4):
 * the mark sits alone at the centre, its four shards launch one by one as comets on curved orbits
 * around where the wordmark appears, dragging Light Blue trails, while the logo slides to re-centre
 * and the letters reveal left to right; the shards land back and re-form the mark, a Pale Blue glow
 * breathes, the tagline and "Signing you in" fade in. The dashboard rises in underneath when it leaves.
 *
 * The logo is never redrawn: every piece is a crop of the official logo PNG (public/brand/
 * in2it-ebs-logo-navy.png, 1809x421) positioned with background-position, using the slice table from
 * the brand skill. The whole stage is 400x220 CSS pixels.
 */
export const SPLASH_MS = 3800;
const REDUCED_MS = 1500;

const SRC = "/brand/in2it-ebs-logo-navy.png";
const IMG = { W: 1809, H: 421 };
const BBOX = [20, 20, 1788, 400] as const;
const MARK = [20, 20, 401, 400] as const;
const WORD_ROWS = [59, 290] as const;
const TAG_ROWS = [337, 373] as const;
const TAG_COLS = [483, 1636] as const;
const LETTERS: ReadonlyArray<readonly [number, number]> = [
  [483, 523],
  [559, 720],
  [741, 902],
  [926, 966],
  [987, 1158],
  [1247, 1400],
  [1424, 1600],
  [1608, 1788],
];
/* Each cell of the 2x2 mark holds the triangle (cell top-left, cell top-right, cell bottom-right). */
const SHARDS = [
  { k: "tl", clip: "polygon(0 0, 50% 0, 50% 50%)", centroid: [0.333, 0.167] },
  { k: "tr", clip: "polygon(50% 0, 100% 0, 100% 50%)", centroid: [0.833, 0.167] },
  { k: "bl", clip: "polygon(0 50%, 50% 50%, 50% 100%)", centroid: [0.333, 0.667] },
  { k: "br", clip: "polygon(50% 50%, 100% 50%, 100% 100%)", centroid: [0.833, 0.667] },
] as const;
/* Orbits in stage coordinates. START/END become the shard's own centroid, MX/MY the mark's centre,
   so each shard launches from the mark, loops around the wordmark and lands where it began. */
const FLIGHTS: Record<string, { d: string; dur: number; delay: number; land: number }> = {
  tl: { d: "M START C MX-70 MY-95, 330 MY-110, 385 MY-25 S 240 MY+45, END", dur: 1500, delay: 300, land: 1800 },
  tr: { d: "M START C MX+30 MY+110, 300 MY+125, 395 MY+35 S 330 MY-80, END", dur: 1400, delay: 380, land: 1780 },
  bl: { d: "M START C MX-95 MY+15, MX-70 MY+120, 210 MY+110 S 160 MY-85, END", dur: 1550, delay: 460, land: 2010 },
  br: { d: "M START C 150 MY-105, 370 MY-85, 405 MY+15 S 210 MY+95, END", dur: 1450, delay: 540, land: 1990 },
};
const LOGO_WIDTH = 330;
const LOGO_LEFT = 35;
const LOGO_TOP = 75;

type Piece = { style: CSSProperties; className: string };

function buildScene() {
  const s = LOGO_WIDTH / (BBOX[2] - BBOX[0] + 1);
  const bx = BBOX[0];
  const by = BBOX[1];
  const bg = `url(${SRC})`;
  const bgSize = `${IMG.W * s}px ${IMG.H * s}px`;
  const piece = (x0: number, y0: number, x1: number, y1: number, className: string, extra?: CSSProperties): Piece => ({
    className: `splash-piece ${className}`,
    style: {
      left: LOGO_LEFT + (x0 - bx) * s,
      top: LOGO_TOP + (y0 - by) * s,
      width: (x1 - x0 + 1) * s,
      height: (y1 - y0 + 1) * s,
      backgroundImage: bg,
      backgroundSize: bgSize,
      backgroundPosition: `${-x0 * s}px ${-y0 * s}px`,
      ...extra,
    },
  });

  const letters = LETTERS.map((c, i) =>
    piece(c[0], WORD_ROWS[0], c[1], WORD_ROWS[1], "splash-letter", { "--i": i } as CSSProperties),
  );
  const tag = piece(TAG_COLS[0], TAG_ROWS[0], TAG_COLS[1], TAG_ROWS[1], "splash-tag");

  const mw = (MARK[2] - MARK[0] + 1) * s;
  const mh = (MARK[3] - MARK[1] + 1) * s;
  const markLeft = LOGO_LEFT + (MARK[0] - bx) * s;
  const markTop = LOGO_TOP + (MARK[1] - by) * s;
  const MX = markLeft + mw / 2;
  const MY = markTop + mh / 2;
  const shift = 200 - MX; // the mark alone is centred at the start, like Keka's lone "k"

  const glow: CSSProperties = {
    left: markLeft - mw * 0.25,
    top: markTop - mh * 0.25,
    width: mw * 1.5,
    height: mh * 1.5,
  };

  const shards: Piece[] = [];
  const trails: { d: string; style: CSSProperties }[] = [];
  for (const sh of SHARDS) {
    const F = FLIGHTS[sh.k];
    const cx = markLeft + sh.centroid[0] * mw;
    const cy = markTop + sh.centroid[1] * mh;
    const d = F.d
      .replace(/MX([+-]\d+)/g, (_, n) => (MX + +n).toFixed(1))
      .replace(/MY([+-]\d+)/g, (_, n) => (MY + +n).toFixed(1))
      .replace("START", `${cx.toFixed(1)} ${cy.toFixed(1)}`)
      .replace("END", `${cx.toFixed(1)} ${cy.toFixed(1)}`);
    const p = piece(MARK[0], MARK[1], MARK[2], MARK[3], `splash-shard ${sh.k}`, {
      /* The inline left/top is the shard's natural place in the mark (the fallback for browsers
         without CSS Motion Path). Where offset-path is supported, admin.css parks the box at the
         stage origin, because path() coordinates are relative to the element's own box, and the
         path then places the shard's centroid (its transform-origin) on the orbit. */
      clipPath: sh.clip,
      WebkitClipPath: sh.clip,
      transformOrigin: `${sh.centroid[0] * 100}% ${sh.centroid[1] * 100}%`,
      offsetPath: `path("${d}")`,
      offsetAnchor: "auto",
      "--dur": `${F.dur}ms`,
      "--delay": `${F.delay}ms`,
      "--land": `${F.land}ms`,
    } as CSSProperties);
    shards.push(p);
    trails.push({ d, style: { "--dur": `${F.dur}ms`, "--delay": `${F.delay}ms` } as CSSProperties });
  }
  return { letters, tag, glow, shards, trails, shift };
}

export function AdminSplash() {
  const scene = useMemo(buildScene, []);
  const [phase, setPhase] = useState<"wait" | "play" | "leave" | "gone">("wait");

  useEffect(() => {
    // The dashboard URL carried ?welcome=1 once; a reload must not replay the splash.
    try {
      window.history.replaceState(window.history.state, "", "/admin/");
    } catch {
      // ignore
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let leaveTimer = 0;
    let goneTimer = 0;
    let cancelled = false;
    const img = new Image();
    img.src = SRC;
    const start = () => {
      if (cancelled) return;
      setPhase("play");
      leaveTimer = window.setTimeout(() => setPhase("leave"), reduced ? REDUCED_MS : SPLASH_MS);
      goneTimer = window.setTimeout(() => setPhase("gone"), (reduced ? REDUCED_MS : SPLASH_MS) + 460);
    };
    img.decode().then(start, start);
    return () => {
      cancelled = true;
      window.clearTimeout(leaveTimer);
      window.clearTimeout(goneTimer);
    };
  }, []);

  if (phase === "gone") return null;
  return (
    <div
      className={`splash${phase === "play" || phase === "leave" ? " play" : ""}${phase === "leave" ? " leave" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Signing you in"
    >
      <div className="splash-stack">
        <div className="splash-stage" style={{ "--shift": `${scene.shift}px` } as CSSProperties}>
          <span className="splash-glow" style={scene.glow} aria-hidden />
          <div className="splash-logo" aria-hidden>
            {scene.letters.map((p, i) => (
              <div key={`l${i}`} className={p.className} style={p.style} />
            ))}
            <div className={scene.tag.className} style={scene.tag.style} />
            {scene.shards.map((p, i) => (
              <div key={`s${i}`} className={p.className} style={p.style} />
            ))}
          </div>
          <svg className="splash-fx" viewBox="0 0 400 220" aria-hidden>
            {scene.trails.map((t, i) => (
              <path key={i} className="splash-trail" pathLength={1000} d={t.d} style={t.style} />
            ))}
          </svg>
        </div>
        <div className="splash-status">
          Signing you in
          <span className="splash-dots" aria-hidden>
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
    </div>
  );
}
