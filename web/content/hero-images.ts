/**
 * THE BUILT-IN PICTURE CATALOGUE — deliberately empty.
 *
 * ── WHAT USED TO BE HERE ─────────────────────────────────────────────────────────────────────
 * Ninety-two stock photographs: cut-out business people on transparent grounds, offices, desks
 * with screens. They were the hero panel on every page without a diagram, and they came out on
 * 18 November 2026 for two reasons.
 *
 * No purchase record existed for any of them, the agency that sourced them is gone, and none
 * carried provenance metadata — which is what images saved from a web page look like. That was
 * the prompt. It was not the argument.
 *
 * The argument is that **a stock photograph is the visual form of an unfalsifiable adjective.**
 * This site fails its own build over the word "world-class" because no observation could show it
 * false. A photograph of four people who do not work here, in an office we do not occupy, smiling
 * at a screen showing nothing, makes exactly that kind of claim — and it is the same photograph
 * every competitor is using. Having built a gate against the written version, keeping the visual
 * one made no sense.
 *
 * ── WHY THE FILE REMAINS ─────────────────────────────────────────────────────────────────────
 * It is the catalogue the /admin picture picker reads. Empty means the picker offers no built-in
 * photographs, while an editor can still upload their own: a person choosing an image for a
 * reason is a different thing from a library choosing one for us, and that path is kept open.
 *
 * It is a `.ts` module rather than the `.json` it used to be because an empty JSON object infers
 * its values as `never`, which broke all six consumers the moment the last photograph came out.
 * The type is declared here instead, so the catalogue can be empty without the code pretending it
 * can never be refilled.
 *
 * Pages get `components/sections/hero-figure.tsx` instead.
 */
export interface HeroImageEntry {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const heroImages: Record<string, HeroImageEntry> = {};

export default heroImages;
