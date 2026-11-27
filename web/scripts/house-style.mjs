import { readFileSync, readdirSync } from "node:fs";

/**
 * THE ADJECTIVE GATE — shared by the test suite and the production build.
 *
 * ── WHERE THIS CAME FROM ─────────────────────────────────────────────────────────────────────
 * The SAP service page ends: "Depth is a number and a name. It should not be an adjective
 * anywhere on this site." That is the house style, and a house style nobody enforces survives
 * about one marketing hire. This turns it into a failing test and a failing build.
 *
 * ── WHAT EARNS A PLACE ON THE LIST ───────────────────────────────────────────────────────────
 * Only words that are *unfalsifiable by construction* — where there is no observation a reader
 * could make that would show the sentence to be false. "World-class" has no test. "Seamless" has
 * no test. "Robust" does have one, which is why it is not here despite being tired, and "scalable"
 * is not here either because a load figure settles it.
 *
 * That bar is high on purpose. A lint that grows into a list of somebody's pet peeves gets
 * switched off within a quarter and takes the useful half with it when it goes. If you want to add
 * a word, first write down the observation that would falsify a sentence containing it. If you can,
 * it does not belong here.
 *
 * ── SCOPE ────────────────────────────────────────────────────────────────────────────────────
 * content/ only. That directory is the copy; components and comments can say what they like, and
 * this file would otherwise fail the build on its own word list, which would be a funny way to
 * find out the rule works. Comments inside content files are stripped before scanning, so a note
 * explaining why a phrase was removed does not re-trip the gate that removed it.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */
export const BANNED = [
  "world.class",
  "best.in.class",
  "cutting.edge",
  "state.of.the.art",
  "industry.leading",
  "market.leading",
  "unparalleled",
  "unrivall?ed",
  "seamless",
  "synerg(y|ies)",
  "one.stop shop",
  "thought leader",
];

/**
 * A person's own biography is their words about their own career, not a claim this firm is making
 * about its capability. The style rule governs the second. Nothing else is exempt, and adding a
 * file to this set should feel uncomfortable.
 */
export const EXEMPT = new Set(["content/leadership.ts"]);

const stripComments = (src) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

/** Returns "file:line \"word\"" for every unfalsifiable adjective in shipped copy. */
export function houseStyleOffenders(root = "content") {
  const offenders = [];
  const files = readdirSync(root, { recursive: true })
    .map((f) => `${root}/${f}`)
    .filter((f) => f.endsWith(".ts") && !EXEMPT.has(f));
  for (const file of files) {
    stripComments(readFileSync(file, "utf8"))
      .split("\n")
      .forEach((line, i) => {
        for (const word of BANNED) {
          const m = line.match(new RegExp(word, "i"));
          if (m) offenders.push(`${file}:${i + 1} "${m[0]}"`);
        }
      });
  }
  return offenders;
}
