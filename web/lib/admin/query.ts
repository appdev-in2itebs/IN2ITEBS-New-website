/** Helpers for the admin list pages: paging and a search term safe to put in a PostgREST filter. */
export const PAGE_SIZE = 25;

export function pageOf(raw?: string) {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

/** Keeps letters, digits, spaces and @ . _ -: PostgREST filter syntax uses , ( ) and quotes. */
export function searchTerm(raw?: string) {
  return (raw ?? "")
    .replace(/[^\p{L}\p{N}\s@._-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

export const isUuid = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

/** Builds a list URL from the current filters, dropping empty ones. */
export function listUrl(base: string, params: Record<string, string | undefined>) {
  const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]).toString();
  return q ? `${base}?${q}` : base;
}

/** One CSV cell: quoted, with formula-starting characters neutralised so Excel never runs them. */
export function csvCell(value: unknown) {
  let s = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}
