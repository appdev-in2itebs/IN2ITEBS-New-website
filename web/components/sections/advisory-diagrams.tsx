import type { CSSProperties } from "react";
import { ScrollScene } from "@/components/motion/scroll-scene";
import "./advisory-diagrams.css";

/**
 * The four Advisory diagrams, drawn live in HTML and CSS rather than shipped as pictures, so they
 * match the rest of the site's explainers (components/explainers): they draw themselves as the
 * reader scrolls, stay sharp at any size, and their words are real text.
 *
 * Every piece takes the scene's scroll progress `--p` (0..1, from ScrollScene) and an `--at`
 * threshold: it arrives as the drawing passes it. The finished drawing is the default, so it is
 * what shows before the script runs, without JavaScript, and under reduced motion.
 */
export type AdvisoryVisual = "stage-gates" | "eight-systems" | "dpdp-timetable" | "risk-tiers";

type Vars = CSSProperties & Record<`--${string}`, string | number>;
const at = (v: number, extra?: Vars): Vars => ({ "--at": v.toFixed(3), ...extra });

export function AdvisoryDiagram({ visual, alt }: { visual: AdvisoryVisual; alt: string }) {
  return (
    <ScrollScene className="adv-dg" aria-label={alt} data-scene-travel="0.6">
      {visual === "stage-gates" ? <StageGates /> : null}
      {visual === "eight-systems" ? <EightSystems /> : null}
      {visual === "dpdp-timetable" ? <DpdpTimetable /> : null}
      {visual === "risk-tiers" ? <RiskTiers /> : null}
    </ScrollScene>
  );
}

/* ------------------------------------------------------------------ stage gates */

const GATES = [
  { name: "Case approved", note: "Sponsor and budget named" },
  { name: "Design signed off", note: "One process template" },
  { name: "Build accepted", note: "Tested against the template" },
  { name: "Ready to go live", note: "Data, people and cutover" },
  { name: "Value reviewed", note: "Measured against the case" },
];
const GATE_X = [0.09, 0.295, 0.5, 0.705, 0.91];
/** Money committed against programme time: slow while deciding and designing, steep in the build. */
const spend = (x: number) => {
  const k = 9;
  const f = (v: number) => 1 / (1 + Math.exp(-k * (v - 0.52)));
  return (f(x) - f(0)) / (f(1) - f(0));
};
const curvePoints = Array.from({ length: 61 }, (_, i) => {
  const x = i / 60;
  return [x * 1000, 300 - spend(x) * 270] as const;
});
const curvePath = curvePoints.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");

function StageGates() {
  return (
    <div className="adv-gates">
      <div className="adv-gates__head">
        <p className="adv-dg__eyebrow">Money committed</p>
        <p className="adv-gates__quote font-display">Stopping at Gate 1 costs a fraction of stopping at Gate 3.</p>
      </div>
      <div className="adv-gates__plot">
        <svg viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden className="adv-gates__svg">
          <path className="adv-gates__area" d={`${curvePath} L1000 300 L0 300 Z`} />
          <path className="adv-gates__curve" d={curvePath} vectorEffect="non-scaling-stroke" />
        </svg>
        <span aria-hidden className="adv-gates__axis" />
        {GATE_X.map((x, i) => {
          const y = spend(x);
          const style = at(0.12 + x * 0.78, { left: `${x * 100}%`, "--y": `${(y * 90).toFixed(2)}%` });
          return (
            <span key={x} aria-hidden className="adv-gates__mark" style={style}>
              {i > 0 ? <span className="adv-gates__drop" /> : null}
              <span className="adv-gates__dot" />
              <span className="adv-gates__diamond" />
            </span>
          );
        })}
      </div>
      <ol className="adv-gates__labels">
        {GATES.map((g, i) => (
          <li key={g.name} style={at(0.12 + GATE_X[i] * 0.78)}>
            <b>
              Gate {i} · {g.name}
            </b>
            <span>{g.note}</span>
          </li>
        ))}
      </ol>
      <p className="adv-gates__time">Programme time →</p>
    </div>
  );
}

/* ------------------------------------------------------------------ eight systems */

/** Eight systems round an octagon, in a 100 × 84 box (percent of the panel). */
const SYSTEMS: { name: string; x: number; y: number }[] = [
  { name: "ERP", x: 50, y: 8 },
  { name: "PLM", x: 78, y: 20 },
  { name: "Projects", x: 89, y: 46 },
  { name: "e-Procure", x: 78, y: 72 },
  { name: "HR", x: 50, y: 84 },
  { name: "Plant", x: 22, y: 72 },
  { name: "Reporting", x: 11, y: 46 },
  { name: "Portal", x: 22, y: 20 },
];
const PAIRS = SYSTEMS.flatMap((a, i) => SYSTEMS.slice(i + 1).map((b) => [a, b] as const));

function EightSystems() {
  return (
    <div className="adv-mesh">
      <div className="adv-mesh__panel">
        <p className="adv-dg__eyebrow adv-mesh__label">Point to point</p>
        <div className="adv-mesh__field">
          <svg viewBox="0 0 100 92" aria-hidden className="adv-mesh__svg">
            {PAIRS.map(([a, b], i) => (
              <line
                key={`${a.name}-${b.name}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                pathLength={1}
                className="adv-mesh__wire"
                style={at(0.05 + (i / PAIRS.length) * 0.4)}
              />
            ))}
          </svg>
          {SYSTEMS.map((s, i) => (
            <span
              key={s.name}
              className="adv-mesh__node"
              style={at(i * 0.012, { left: `${s.x}%`, top: `${(s.y / 92) * 100}%` })}
            >
              {s.name}
            </span>
          ))}
        </div>
        <p className="adv-mesh__count font-display" style={at(0.42)}>
          28 interfaces
        </p>
        <p className="adv-mesh__sub" style={at(0.45)}>
          A ninth system adds 8 more
        </p>
      </div>
      <div className="adv-mesh__panel adv-mesh__panel--hub">
        <p className="adv-dg__eyebrow adv-mesh__label">Through one layer</p>
        <div className="adv-mesh__field">
          <svg viewBox="0 0 100 92" aria-hidden className="adv-mesh__svg">
            {SYSTEMS.map((s, i) => (
              <line
                key={s.name}
                x1={50}
                y1={46}
                x2={s.x}
                y2={s.y}
                pathLength={1}
                className="adv-mesh__spoke"
                style={at(0.55 + i * 0.035)}
              />
            ))}
          </svg>
          {SYSTEMS.map((s, i) => (
            <span
              key={s.name}
              className="adv-mesh__node"
              style={at(0.5 + i * 0.012, { left: `${s.x}%`, top: `${(s.y / 92) * 100}%` })}
            >
              {s.name}
            </span>
          ))}
          <span className="adv-mesh__hub" style={at(0.5)}>
            <b>Integration layer</b>
            <span>+ master data</span>
          </span>
        </div>
        <p className="adv-mesh__count font-display" style={at(0.85)}>
          8 connections
        </p>
        <p className="adv-mesh__sub" style={at(0.88)}>
          A ninth system adds 1
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ DPDP timetable */

const DPDP_START = Date.UTC(2025, 10, 13);
const DPDP_CONSENT = Date.UTC(2026, 10, 13);
const DPDP_END = Date.UTC(2027, 4, 13);
const WORDS = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
];

/** "About five and a half months left", rounded to the half month, from the day the page was built. */
function monthsLeft(now: number) {
  const halves = Math.round(((DPDP_END - now) / (1000 * 60 * 60 * 24 * 30.44)) * 2);
  if (halves <= 0) return null;
  if (halves === 1) return "About two weeks left";
  const whole = Math.floor(halves / 2);
  const half = halves % 2 === 1;
  const word = WORDS[whole] ?? String(whole);
  const n = half ? `${word} and a half months` : `${word} month${whole === 1 ? "" : "s"}`;
  return `About ${n} left`;
}

function DpdpTimetable() {
  // The "Today" marker is placed from the date the page is built; each deploy moves it on. Once
  // May 2027 has passed it disappears and the whole line reads as in force.
  const now = Date.now();
  const span = DPDP_END - DPDP_START;
  const pos = (t: number) => Math.min(1, Math.max(0, (t - DPDP_START) / span));
  const today = pos(now);
  const left = now < DPDP_END ? monthsLeft(now) : null;
  const consent = pos(DPDP_CONSENT);
  return (
    <div className="adv-time" style={{ "--today": today, "--consent": consent } as Vars}>
      <div className="adv-time__top">
        <div className="adv-time__event" style={at(0.05)}>
          <b className="font-display">13 Nov 2025</b>
          <span>Rules notified</span>
          <span>Data Protection Board set up</span>
        </div>
        <div className="adv-time__event adv-time__event--end" style={at(0.8)}>
          <b className="font-display">May 2027</b>
          <span>Notice, consent, rights,</span>
          <span>safeguards, breach intimation</span>
        </div>
      </div>
      <div className="adv-time__track">
        <span className="adv-time__line" />
        {left ? (
          <>
            <span className="adv-time__left" style={at(0.7)} />
            <span className="adv-time__today" style={at(0.62)}>
              <span>Today</span>
            </span>
            <span className="adv-time__months" style={at(0.75)}>
              {left}
            </span>
          </>
        ) : null}
        <span className="adv-time__dot" style={at(0.04, { left: "0%" })} />
        <span className="adv-time__dot" style={at(0.04 + consent * 0.6, { left: `${consent * 100}%` })} />
        <span className="adv-time__dot" style={at(0.72, { left: "100%" })} />
      </div>
      <div className="adv-time__bottom">
        <div className="adv-time__event adv-time__event--mid" style={at(0.5)}>
          <b className="font-display">Nov 2026</b>
          <span>Consent manager</span>
          <span>provisions take effect</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ risk tiers */

const PHASES = ["Idea", "Pilot", "Production", "In use"];
const PHASE_X = [0, 0.33, 0.66, 1];
const TIERS = [
  { name: "Low risk", example: "Document search assistant", controls: [0.165] },
  { name: "Moderate risk", example: "Fleet dispatch optimisation", controls: [0.165, 0.5, 0.6] },
  {
    name: "High risk",
    example: "Maintenance on safety-critical machinery",
    controls: [0.12, 0.24, 0.5, 0.6, 1],
    note: "A named person signs off each recommendation",
  },
];

function RiskTiers() {
  return (
    <div className="adv-tiers">
      <div className="adv-tiers__phases" aria-hidden>
        <span />
        <div className="adv-tiers__axis">
          {PHASES.map((p, i) => (
            <span key={p} style={{ left: `${PHASE_X[i] * 100}%` }}>
              {p}
            </span>
          ))}
        </div>
        <span />
      </div>
      {TIERS.map((tier, r) => {
        const base = 0.06 + r * 0.28;
        return (
          <div key={tier.name} className={`adv-tiers__row adv-tiers__row--${r}`}>
            <div className="adv-tiers__name" style={at(base)}>
              <b className="font-display">{tier.name}</b>
              <span>e.g. {tier.example}</span>
            </div>
            <div className="adv-tiers__track" style={at(base)}>
              {PHASE_X.map((x) => (
                <span key={x} className="adv-tiers__phase" style={{ left: `${x * 100}%` }} />
              ))}
              {tier.controls.map((x, i) => {
                const last = tier.note && i === tier.controls.length - 1;
                return (
                  <span
                    key={x}
                    className={last ? "adv-tiers__control adv-tiers__control--person" : "adv-tiers__control"}
                    style={at(base + 0.04 + x * 0.16, { left: `${x * 100}%` })}
                  >
                    {i + 1}
                  </span>
                );
              })}
            </div>
            <p className="adv-tiers__note" style={at(base + 0.22)}>
              {tier.note ?? ""}
            </p>
          </div>
        );
      })}
    </div>
  );
}
