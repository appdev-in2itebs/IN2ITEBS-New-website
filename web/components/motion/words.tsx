import { Fragment } from "react";
import { cn } from "@/lib/utils";

/**
 * The three ways a display heading can arrive. They are one family — the same slow exponential
 * settle, the same soft focus — so a page that uses all three still reads as one hand:
 *
 * - `rise`  — each word climbs out from behind its own mask: a hard edge, and the most editorial.
 * - `bloom` — no mask; the words float up from below and grow the last few per cent into place.
 * - `blur`  — no mask and almost no travel, just a focus. For the long sentence headings, where
 *             either of the others would ripple across a line and a half.
 * - `type`   — the line lifts into place, then types itself out under a blinking caret. Not a
 *              per-word cascade at all, so it is the one variant that is its own thing; use it
 *              once on a page, on a short heading.
 */
export type WordsVariant = "rise" | "blur" | "bloom" | "type";

/** The longest a heading's last word will wait before it starts, in milliseconds. */
const MAX_CASCADE = 300;

/** `type` only: milliseconds a character takes, and the lift that runs before the typing starts. */
const TYPE_PER_CHAR = 48;
const TYPE_LIFT = 360;
/** How long the caret keeps blinking once the last character has landed. */
const CARET_TAIL = 900;
/** One on, one off, per this many milliseconds. */
const CARET_BLINK = 900;

/**
 * A heading whose words arrive one after another.
 *
 * This is the display treatment: section headings get it, body copy keeps the plain block rise of
 * `Reveal`, so the two read as different moments rather than the same move repeated. It is CSS
 * only — no client component, no JavaScript beyond the `data-reveal` flag that `MotionObserver`
 * already sets on every `.reveal`, which means `repeat` works here too.
 *
 * The text is split on spaces and never on characters: a screen reader reads the heading as one
 * string either way, but a per-letter split breaks text selection, search-in-page and word
 * wrapping.
 *
 * Before hydration and under `prefers-reduced-motion` every word is simply in place — see the
 * `.words` rules in globals.css, which mirror the visible-first guards `.reveal` uses.
 */
export function Words({
  children,
  className,
  variant = "rise",
  /** Milliseconds between the first word and the second, before the cap below applies. */
  step = 74,
}: {
  children: string;
  className?: string;
  variant?: WordsVariant;
  step?: number;
}) {
  // `type` is not a cascade: the whole line is one element, revealed by a clip that steps one
  // character at a time. Nothing is split, so selection, find-in-page and wrapping are untouched —
  // a `clip-path` changes what is painted, never the layout.
  if (variant === "type") {
    const chars = children.length;
    const duration = chars * TYPE_PER_CHAR;
    const reveal = `${duration}ms steps(${chars}, end) ${TYPE_LIFT}ms`;
    return (
      <span className={cn("words words-type", className)}>
        <span className="type-line">
          <span
            className="type-text"
            style={{
              transition: `clip-path ${reveal}, transform 520ms cubic-bezier(0.16, 0.84, 0.24, 1), opacity 300ms ease-out`,
            }}
          >
            {children}
          </span>
          <span
            aria-hidden
            className="type-caret"
            style={{
              transition: `left ${reveal}, opacity 160ms ease-out ${TYPE_LIFT}ms`,
              // The blink runs through the typing and a beat past it, then the caret goes: a
              // heading that blinks for ever is a distraction, and a repaint that never stops.
              ["--caret-blinks" as string]: Math.ceil((duration + TYPE_LIFT + CARET_TAIL) / CARET_BLINK),
              ["--caret-end" as string]: `${duration + TYPE_LIFT + CARET_TAIL}ms`,
            }}
          />
        </span>
      </span>
    );
  }

  const words = children.split(" ");
  // Every heading takes the same time to arrive, whatever its length. At `step` apart, a
  // three-word heading launches in 150ms and a seven-word one in 440ms — the long one then reads
  // as laboured next to the short one. Capping the span and easing the distribution keeps one
  // rhythm across the page: the first word always leads, the last always lands together with it.
  const last = Math.min(step * (words.length - 1), MAX_CASCADE);
  const delay = (index: number) => (words.length < 2 ? 0 : Math.round(last * (index / (words.length - 1)) ** 0.8));
  return (
    <span className={cn("words", `words-${variant}`, className)}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="word">
            <span
              className="word-rise"
              // `--word-base` lets a container hold the whole heading back (a card waiting its turn).
              style={{ transitionDelay: `calc(var(--word-base, 0ms) + ${delay(index)}ms)` }}
            >
              {word}
            </span>
          </span>
          {/* The space is a sibling of the word, never a child of it: `rise` and `bloom` mask
              `.word` with `overflow: hidden`, and a trailing space inside an inline-block collapses
              to nothing, which ran every heading together as "Servicesweoffer." */}
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
