import heroImages from "@/content/hero-images.json";
import type { Field } from "@/lib/cms/registry";

/**
 * Finds, on a page of the website shown in the visual editor's frame, the elements that display an
 * editable value, and marks them. Pages need no markup of their own: a value is matched to the
 * innermost element whose text is exactly that value (spacing and quote marks ignored), and a
 * picture to the image whose source is that picture. Runs in the admin page against the frame's
 * document, which is on the same origin.
 */

export type Mark = { target: string; path: string; label: string };
export type Annotatable = {
  id: string;
  label: string;
  fields: Field[];
  value: Record<string, unknown>;
  fallbacks?: Record<string, string>;
  hero?: boolean;
};

const TEXT_ATTR = "data-ve";
const IMG_ATTR = "data-ve-img";

/** Text compared without any spacing, quote marks or case, so markup and typography do not matter. */
export const norm = (s: string) => s.replace(/[\s"'“”‘’«»]+/g, "").toLowerCase();

type Leaf = { path: string; text: string; label: string };
type Pic = { path: string; value: string; label: string };

/** Every text value (and every picture) in a target, with its path ("sections.2.title") and a label. */
export function leaves(fields: readonly Field[], value: Record<string, unknown>, prefix = "", where = "") {
  const texts: Leaf[] = [];
  const pics: Pic[] = [];
  for (const f of fields) {
    const v = value?.[f.key];
    const path = prefix + f.key;
    const label = where + f.label;
    if (f.kind === "text" || f.kind === "textarea") {
      if (typeof v === "string") texts.push({ path, text: v, label });
    } else if (f.kind === "paragraphs" || f.kind === "lines") {
      if (Array.isArray(v))
        v.forEach((s, i) => typeof s === "string" && texts.push({ path: `${path}.${i}`, text: s, label }));
    } else if (f.kind === "picture") {
      if (typeof v === "string" && v) pics.push({ path, value: v, label });
    } else if (f.kind === "list" && Array.isArray(v)) {
      v.forEach((item, i) => {
        const sub = leaves(f.fields, item as Record<string, unknown>, `${path}.${i}.`, `${f.itemLabel} ${i + 1} · `);
        texts.push(...sub.texts);
        pics.push(...sub.pics);
      });
    }
  }
  return { texts, pics };
}

export function getAt(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o == null ? undefined : (o as Record<string, unknown>)[k]), obj);
}

/** A copy of `obj` with the value at `path` replaced, creating arrays and objects on the way. */
export function setAt<T>(obj: T, path: string, value: unknown): T {
  const [head, ...rest] = path.split(".");
  const isIndex = /^\d+$/.test(head);
  const base = (obj ?? (isIndex ? [] : {})) as Record<string, unknown> | unknown[];
  const copy = (Array.isArray(base) ? [...base] : { ...base }) as Record<string, unknown>;
  copy[head] = rest.length ? setAt(copy[head], rest.join("."), value) : value;
  return copy as T;
}

/** The URL a picture value is served from: hero-library key, uploaded image or site path. */
export function pictureSrc(value: string): string | null {
  const lib = (heroImages as Record<string, { src: string }>)[value];
  if (lib) return lib.src;
  if (/^https:\/\//.test(value) || value.startsWith("/")) return value;
  return null;
}

/** An <img>'s real source, unwrapping next/image's /_next/image?url=… */
function imageSource(img: HTMLImageElement): string {
  const raw = img.getAttribute("src") ?? "";
  try {
    const u = new URL(raw, img.ownerDocument.location.href);
    const inner = u.pathname.startsWith("/_next/image") ? u.searchParams.get("url") : null;
    const real = new URL(inner ?? u.href, u.origin);
    return real.origin === u.origin ? real.pathname : real.href;
  } catch {
    return raw;
  }
}

const sameSrc = (a: string, b: string) => {
  try {
    const x = new URL(a, "http://x");
    const y = new URL(b, "http://x");
    return x.host === y.host && decodeURIComponent(x.pathname) === decodeURIComponent(y.pathname);
  } catch {
    return a === b;
  }
};

/** Marks the frame's document. Earlier targets win where two would claim the same element. */
export function annotate(doc: Document, targets: Annotatable[]): number {
  doc.querySelectorAll(`[${TEXT_ATTR}]`).forEach((el) => el.removeAttribute(TEXT_ATTR));
  doc.querySelectorAll(`[${IMG_ATTR}]`).forEach((el) => el.removeAttribute(IMG_ATTR));
  injectStyle(doc);

  // Index every element of the page's content by its text; the site header and menus are not content.
  const byText = new Map<string, HTMLElement[]>();
  for (const el of Array.from(doc.body.querySelectorAll<HTMLElement>("*"))) {
    if (/^(SCRIPT|STYLE|SVG|PATH|NOSCRIPT|TEMPLATE|IFRAME|SELECT|OPTION|TEXTAREA|INPUT)$/i.test(el.tagName)) continue;
    if (el.closest("header, nav, [data-ve-ignore], [role=dialog]")) continue;
    const key = norm(el.textContent ?? "");
    if (key.length < 2 || key.length > 6000) continue;
    const list = byText.get(key);
    if (list) list.push(el);
    else byText.set(key, [el]);
  }
  const innermost = (els: HTMLElement[]) =>
    els.filter((el) => !els.some((other) => other !== el && el.contains(other)));

  let count = 0;
  const mark = (el: HTMLElement, m: Mark) => {
    // Never nest: one element, one value.
    if (el.closest(`[${TEXT_ATTR}]`) || el.querySelector(`[${TEXT_ATTR}]`)) return;
    el.setAttribute(TEXT_ATTR, JSON.stringify(m));
    el.title = `Click to edit · ${m.label}`;
    count++;
  };

  for (const t of targets) {
    const { texts, pics } = leaves(t.fields, t.value);
    const shown = new Map(texts.map((l) => [l.path, l]));
    for (const [path, text] of Object.entries(t.fallbacks ?? {}))
      if (!String(shown.get(path)?.text ?? "").trim())
        shown.set(path, { path, text, label: t.fields.find((f) => f.key === path)?.label ?? path });
    for (const l of shown.values()) {
      const els = byText.get(norm(l.text));
      if (!els) continue;
      for (const el of innermost(els)) mark(el, { target: t.id, path: l.path, label: `${t.label} → ${l.label}` });
    }

    // A hero with nothing edited yet: its headline is the page's h1, its introduction the paragraph after it.
    if (t.hero) {
      const h1 = doc.querySelector<HTMLElement>("main h1, h1");
      if (h1 && !h1.closest(`[${TEXT_ATTR}]`) && !String(t.value.title ?? "").trim())
        mark(h1, { target: t.id, path: "title", label: `${t.label} → Headline` });
      const intro = h1 ? nextParagraph(h1) : null;
      if (intro && !String(t.value.intro ?? "").trim())
        mark(intro, { target: t.id, path: "intro", label: `${t.label} → Introduction` });
      const img = h1?.closest("section")?.querySelector<HTMLImageElement>("img");
      if (img && !img.hasAttribute(IMG_ATTR)) {
        img.setAttribute(IMG_ATTR, JSON.stringify({ target: t.id, path: "picture", label: `${t.label} → Picture` }));
        img.title = "Click to change the picture";
      }
    }

    for (const p of pics) {
      const src = pictureSrc(p.value);
      if (!src) continue;
      for (const img of Array.from(doc.querySelectorAll<HTMLImageElement>("img"))) {
        if (img.hasAttribute(IMG_ATTR) || img.closest("header, nav")) continue;
        if (sameSrc(imageSource(img), src)) {
          img.setAttribute(IMG_ATTR, JSON.stringify({ target: t.id, path: p.path, label: `${t.label} → ${p.label}` }));
          img.title = "Click to change the picture";
        }
      }
    }
  }
  return count;
}

function nextParagraph(h1: HTMLElement): HTMLElement | null {
  let el: Element | null = h1;
  while (el && el !== h1.ownerDocument.body) {
    let sib = el.nextElementSibling;
    while (sib) {
      const p = sib.tagName === "P" ? sib : sib.querySelector("p");
      if (p) return p as HTMLElement;
      sib = sib.nextElementSibling;
    }
    el = el.parentElement;
    if (el?.tagName === "SECTION") break;
  }
  return null;
}

export const readMark = (el: Element | null, attr = TEXT_ATTR): Mark | null => {
  const raw = el?.getAttribute(attr);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Mark;
  } catch {
    return null;
  }
};
export { TEXT_ATTR, IMG_ATTR };

function injectStyle(doc: Document) {
  if (doc.getElementById("ve-style")) return;
  const style = doc.createElement("style");
  style.id = "ve-style";
  style.textContent = `
    html.ve-edit [${TEXT_ATTR}] { cursor: text; border-radius: 4px; transition: outline-color .15s, background-color .15s; outline: 2px dashed transparent; outline-offset: 3px; }
    html.ve-edit [${TEXT_ATTR}]:hover { outline-color: rgba(37, 99, 235, .7); background-color: rgba(37, 99, 235, .05); }
    html.ve-edit [${TEXT_ATTR}][contenteditable] { outline: 2px solid rgb(37, 99, 235); background-color: rgba(37, 99, 235, .07); cursor: text; }
    html.ve-edit [${TEXT_ATTR}].ve-active { outline: 2px solid rgb(37, 99, 235); }
    html.ve-edit img[${IMG_ATTR}] { cursor: pointer; transition: outline-color .15s; outline: 3px dashed transparent; outline-offset: 2px; }
    html.ve-edit img[${IMG_ATTR}]:hover { outline-color: rgba(37, 99, 235, .8); }
    html.ve-edit .reveal { opacity: 1 !important; transform: none !important; filter: none !important; }
  `;
  doc.head.appendChild(style);
}
