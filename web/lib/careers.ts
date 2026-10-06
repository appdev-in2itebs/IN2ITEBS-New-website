/**
 * Turning what HR types in /admin/openings into what the careers pages show: one bullet per line,
 * skills as tags, paragraphs split on blank lines, and "posted N days ago".
 */

/** One item per line; leading bullets and numbering ("-", "•", "1.") are dropped. */
export function lines(text: string | null | undefined): string[] {
  return (text ?? "")
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*([-*•●▪◦]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
}

/** Skills separated by commas, semicolons or lines. */
export function skillList(text: string | null | undefined): string[] {
  const seen = new Set<string>();
  return (text ?? "")
    .split(/[,;\n]/)
    .map((s) => s.replace(/^\s*([-*•●]|\d+[.)])\s*/, "").trim())
    .filter((s) => s && !seen.has(s.toLowerCase()) && seen.add(s.toLowerCase()));
}

export function paragraphs(text: string | null | undefined): string[] {
  return (text ?? "")
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Whole days since the job was posted (0 on the day). */
export function daysSince(iso: string | null | undefined, now = Date.now()): number {
  const t = iso ? Date.parse(iso) : NaN;
  return Number.isFinite(t) ? Math.max(0, Math.floor((now - t) / 86_400_000)) : 0;
}

export function postedLabel(days: number): string {
  if (days === 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  return `Posted ${days} days ago`;
}

/** The individual places in "Bangalore, Bhubaneswar and Chennai", for the location filter. */
export function places(location: string): string[] {
  return location
    .split(/,|\/| - | and |\+/i)
    .map((p) => p.replace(/\b\d+\s*more\b/i, "").trim())
    .filter((p) => p.length > 1);
}
