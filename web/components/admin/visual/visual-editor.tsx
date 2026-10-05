"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ExternalLink,
  Monitor,
  MousePointer2,
  PencilLine,
  RefreshCw,
  Smartphone,
  Tablet,
  X,
} from "lucide-react";
import { Fields, type PictureOption } from "@/components/admin/content-form";
import { cn } from "@/lib/utils";
import type { Saved } from "@/lib/cms/save";
import type { Target } from "@/app/admin/(builder)/site/actions";
import { IMG_ATTR, TEXT_ATTR, annotate, getAt, norm, readMark, setAt, type Mark } from "./annotate";

type Actions = {
  targets: (path: string) => Promise<Target[]>;
  save: (t: { kind: string; type: string; key: string; value: unknown }) => Promise<Saved>;
  pictures: () => Promise<PictureOption[]>;
};
type Editable = Extract<Target, { kind: "content" | "hero" }>;

const DEVICES = {
  desktop: { label: "Desktop", width: 1366, icon: Monitor },
  tablet: { label: "Tablet", width: 820, icon: Tablet },
  mobile: { label: "Phone", width: 390, icon: Smartphone },
} as const;
type Device = keyof typeof DEVICES;

const btn =
  "inline-flex h-9 items-center gap-1.5 rounded-full border border-border-subtle bg-surface px-3.5 text-sm font-semibold text-foreground hover:border-action hover:text-action disabled:pointer-events-none disabled:opacity-40";
const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground-muted hover:bg-surface-subtle hover:text-action disabled:opacity-30";

/**
 * The website itself, editable in place. The page is shown in a frame at the chosen device width;
 * in Edit mode every headline, paragraph, list item and picture that comes from editable content
 * is outlined on hover, text is typed straight onto the page and pictures open their picker in the
 * panel. Browse mode follows links like a visitor, and the panel follows to the page you land on.
 * Save changes puts every edit live at once, through the same saves as the form editors.
 */
export function VisualEditor({
  initialPath,
  pages,
  pictures: initialPictures,
  actions,
}: {
  initialPath: string;
  pages: string[];
  pictures: PictureOption[];
  actions: Actions;
}) {
  const [path, setPath] = useState(initialPath);
  const [src, setSrc] = useState(initialPath);
  const [targets, setTargets] = useState<Target[]>([]);
  const [values, setValues] = useState<Record<string, Record<string, unknown>>>({});
  const [saved, setSaved] = useState<Record<string, string>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [editing, setEditing] = useState(true);
  const [device, setDevice] = useState<Device>("desktop");
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(true);
  loadingRef.current = loading;
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [found, setFound] = useState(0);
  const [pictures, setPictures] = useState(initialPictures);

  const frame = useRef<HTMLIFrameElement>(null);
  const editable = useMemo(() => targets.filter((t): t is Editable => t.kind !== "link"), [targets]);
  const dirtyIds = editable.filter((t) => JSON.stringify(values[t.id]) !== saved[t.id]).map((t) => t.id);
  const dirty = dirtyIds.length > 0;

  // Keep the latest state reachable from listeners attached to the frame's document.
  const live = useRef({ editing, dirty, values, editable, path });
  live.current = { editing, dirty, values, editable, path };

  const doc = () => {
    try {
      return frame.current?.contentDocument ?? null;
    } catch {
      return null;
    }
  };

  // ---------------------------------------------------------------- loading a page's targets

  const loadTargets = useCallback(
    async (p: string) => {
      setLoading(true);
      try {
        const list = await actions.targets(p);
        setTargets(list);
        const v: Record<string, Record<string, unknown>> = {};
        const s: Record<string, string> = {};
        for (const t of list)
          if (t.kind !== "link") {
            v[t.id] = t.value;
            s[t.id] = JSON.stringify(t.value);
          }
        setValues(v);
        setSaved(s);
        setFormKey((k) => k + 1);
        setOpen((cur) => (cur && list.some((t) => t.id === cur) ? cur : (list[0]?.id ?? null)));
        return list;
      } finally {
        setLoading(false);
      }
    },
    [actions],
  );

  const mark = useCallback(() => {
    const d = doc();
    if (!d?.body) return;
    const n = annotate(
      d,
      live.current.editable.map((t) => ({
        id: t.id,
        label: t.label,
        fields: t.fields,
        value: live.current.values[t.id] ?? t.value,
        fallbacks: t.fallbacks,
        hero: t.kind === "hero",
      })),
    );
    d.documentElement.classList.toggle("ve-edit", live.current.editing);
    setFound(n);
  }, []);

  useEffect(() => {
    void loadTargets(initialPath);
  }, [initialPath, loadTargets]);

  // Annotate again once the targets for the page in the frame have arrived.
  useEffect(() => {
    if (!loading) {
      mark();
      // Some sections render their text after hydration (carousels, the map): look again shortly.
      const t = setTimeout(mark, 1200);
      return () => clearTimeout(t);
    }
  }, [loading, targets, mark]);

  useEffect(() => {
    doc()?.documentElement.classList.toggle("ve-edit", editing);
    if (!editing) stopInline();
  }, [editing]);

  // ---------------------------------------------------------------- the frame

  const onFrameLoad = () => {
    const d = doc();
    if (!d) return;
    const p = d.location.pathname;
    if (p.startsWith("/admin")) return;
    if (p !== path) {
      live.current.path = p;
      setPath(p);
      void loadTargets(p);
    } else if (!loading) mark();
    wire(d);
  };

  // The site moves between pages without reloading (client-side links), which fires no load event:
  // notice the new address and follow it.
  // The frame's load event can also fire before this page has hydrated and be missed, so every new
  // document in the frame is picked up here as well.
  const seen = useRef<Document | null>(null);
  useEffect(() => {
    const timer = setInterval(() => {
      const d = doc();
      const p = d?.location.pathname;
      if (!d || !p || !d.body || d.readyState === "loading" || p.startsWith("/admin")) return;
      const fresh = d !== seen.current;
      if (fresh) {
        seen.current = d;
        wire(d);
      }
      if (p !== live.current.path) {
        live.current.path = p;
        setPath(p);
        void loadTargets(p);
      } else if (fresh && !loadingRef.current) mark();
    }, 400);
    return () => clearInterval(timer);
  });

  const editingEl = useRef<HTMLElement | null>(null);
  const stopInline = () => {
    const el = editingEl.current;
    if (!el) return;
    el.removeAttribute("contenteditable");
    el.classList.remove("ve-active");
    editingEl.current = null;
    setFormKey((k) => k + 1);
  };

  /** Listeners on the frame's document: clicks start editing; typing updates the value. */
  const wire = (d: Document) => {
    if ((d as Document & { __ve?: boolean }).__ve) return;
    (d as Document & { __ve?: boolean }).__ve = true;
    d.addEventListener(
      "click",
      (e) => {
        const { editing: on, dirty: changed } = live.current;
        const target = e.target as HTMLElement;
        if (!on) {
          // Browsing: leaving the page drops unsaved edits, so ask first.
          const a = target.closest("a");
          if (a && changed && !confirm("You have unsaved changes on this page. Leave without saving?")) {
            e.preventDefault();
          }
          return;
        }
        const textEl = target.closest<HTMLElement>(`[${TEXT_ATTR}]`);
        const imgEl =
          (target.closest(`[${IMG_ATTR}]`) as HTMLElement | null) ??
          (d
            .elementsFromPoint((e as MouseEvent).clientX, (e as MouseEvent).clientY)
            .find((x) => x.hasAttribute(IMG_ATTR)) as HTMLElement | undefined) ??
          null;
        if (textEl) {
          e.preventDefault();
          e.stopPropagation();
          startInline(textEl);
        } else if (imgEl) {
          e.preventDefault();
          e.stopPropagation();
          const m = readMark(imgEl, IMG_ATTR);
          if (m) reveal(m);
        } else if (target.closest("a, button")) {
          // Edit mode: links and buttons do nothing, so a stray click never leaves the page.
          e.preventDefault();
        }
      },
      true,
    );
    d.addEventListener("submit", (e) => live.current.editing && e.preventDefault(), true);
    // Carousels and other moving sections replace their elements: mark the page again after a change.
    let timer: ReturnType<typeof setTimeout> | undefined;
    new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!editingEl.current) mark();
      }, 350);
    }).observe(d.body, { childList: true, subtree: true });
  };

  const startInline = (el: HTMLElement) => {
    if (editingEl.current === el) return;
    stopInline();
    const m = readMark(el);
    if (!m) return;
    editingEl.current = el;
    // Headlines arrive word by word in separate spans; edit them as one plain run of text.
    if (el.children.length) el.textContent = (el.innerText ?? "").replace(/\s+/g, " ").trim();
    try {
      el.contentEditable = "plaintext-only";
    } catch {
      el.contentEditable = "true";
    }
    if (el.contentEditable !== "plaintext-only") el.contentEditable = "true";
    el.classList.add("ve-active");
    el.focus();
    reveal(m, false);
    const onInput = () => {
      const text = (el.innerText ?? "").replace(/\s+/g, " ").trim();
      setValues((v) => ({ ...v, [m.target]: setAt(v[m.target], m.path, text) }));
      // The same value shown elsewhere on the page follows along.
      el.ownerDocument.querySelectorAll<HTMLElement>(`[${TEXT_ATTR}]`).forEach((other) => {
        const om = readMark(other);
        if (other !== el && om?.target === m.target && om.path === m.path) other.textContent = text;
      });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || (e.key === "Enter" && !e.shiftKey)) {
        e.preventDefault();
        el.blur();
      }
    };
    const onBlur = () => {
      el.removeEventListener("input", onInput);
      el.removeEventListener("keydown", onKey);
      el.removeEventListener("blur", onBlur);
      if (editingEl.current === el) stopInline();
    };
    el.addEventListener("input", onInput);
    el.addEventListener("keydown", onKey);
    el.addEventListener("blur", onBlur);
  };

  /** Opens the target in the panel and points at the field. */
  const reveal = (m: Mark, scroll = true) => {
    setOpen(m.target);
    setTimeout(() => {
      const field = m.path.split(".")[0];
      const el = document.querySelector<HTMLElement>(
        `[data-ve-panel="${CSS.escape(m.target)}"] [data-field-key="${CSS.escape(field)}"]`,
      );
      if (!el) return;
      if (scroll) el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-action", "ring-offset-4");
      setTimeout(() => el.classList.remove("ring-2", "ring-action", "ring-offset-4"), 1600);
    }, 80);
  };

  // Edits made in the panel show on the page as they are typed.
  useEffect(() => {
    const d = doc();
    if (!d) return;
    d.querySelectorAll<HTMLElement>(`[${TEXT_ATTR}]`).forEach((el) => {
      if (el === editingEl.current) return;
      const m = readMark(el);
      const v = m ? getAt(values[m.target], m.path) : undefined;
      if (typeof v === "string" && v.trim() && norm(v) !== norm(el.textContent ?? "")) el.textContent = v;
    });
  }, [values]);

  // ---------------------------------------------------------------- saving

  const saveAll = async () => {
    stopInline();
    setBusy(true);
    setMessage(null);
    const errors: string[] = [];
    for (const t of editable.filter((x) => dirtyIds.includes(x.id))) {
      const result = await actions.save({ kind: t.kind, type: t.type, key: t.key, value: values[t.id] });
      if (!result.ok) errors.push(`${t.label}: ${result.error}`);
    }
    setBusy(false);
    if (errors.length) {
      setMessage({ tone: "error", text: errors.join(" · ") });
      return;
    }
    setMessage({ tone: "ok", text: "Saved. The changes are live on the website." });
    await loadTargets(path);
    frame.current?.contentWindow?.location.reload();
  };

  const discard = () => {
    if (!confirm("Discard the changes on this page?")) return;
    stopInline();
    void loadTargets(path).then(() => frame.current?.contentWindow?.location.reload());
  };

  const go = (p: string) => {
    if (dirty && !confirm("You have unsaved changes on this page. Leave without saving?")) return;
    const clean = p.startsWith("/") ? p : `/${p}`;
    setSrc(`${clean}${clean.includes("?") ? "&" : "?"}v=${Date.now()}`);
  };

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && !busy) void saveAll();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // ---------------------------------------------------------------- fitting the device width

  const stage = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 1000, h: 700 });
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setBox({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const width = DEVICES[device].width;
  const scale = Math.min(1, (box.w - 32) / width);

  // ---------------------------------------------------------------- layout

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-surface-subtle text-foreground">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border-subtle bg-surface px-3">
        <Link href="/admin/" className={iconBtn} title="Back to the admin" aria-label="Back to the admin">
          <ArrowLeft size={18} />
        </Link>
        <p className="hidden text-sm font-bold xl:block">Visual editor</p>
        <form
          className="flex min-w-0 flex-1 items-center gap-1 lg:max-w-md"
          onSubmit={(e) => {
            e.preventDefault();
            const input = (e.currentTarget.elements.namedItem("path") as HTMLInputElement).value.trim();
            if (input) go(input);
          }}
        >
          <input
            key={path}
            name="path"
            defaultValue={path}
            list="ve-pages"
            aria-label="Page address"
            className="h-9 min-w-0 flex-1 rounded-full border border-border-subtle bg-surface-subtle px-4 text-sm focus:border-action focus:outline-none"
          />
          <datalist id="ve-pages">
            {pages.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
          <button type="submit" className={btn}>
            Go
          </button>
        </form>

        <div className="flex items-center gap-1 rounded-full bg-surface-subtle p-1" role="group" aria-label="Mode">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-pressed={editing}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-semibold",
              editing ? "bg-action text-on-action" : "text-foreground-muted hover:text-foreground",
            )}
          >
            <PencilLine size={15} /> Edit
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            aria-pressed={!editing}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-semibold",
              !editing ? "bg-surface text-action shadow-sm" : "text-foreground-muted hover:text-foreground",
            )}
          >
            <MousePointer2 size={15} /> Browse
          </button>
        </div>

        <div className="hidden items-center gap-1 rounded-full bg-surface-subtle p-1 md:flex">
          {(Object.keys(DEVICES) as Device[]).map((d) => {
            const Icon = DEVICES[d].icon;
            return (
              <button
                key={d}
                type="button"
                title={DEVICES[d].label}
                aria-label={DEVICES[d].label}
                aria-pressed={device === d}
                onClick={() => setDevice(d)}
                className={cn(
                  "inline-flex h-8 w-9 items-center justify-center rounded-full",
                  device === d ? "bg-surface text-action shadow-sm" : "text-foreground-muted hover:text-foreground",
                )}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className={iconBtn}
          title="Reload the page"
          aria-label="Reload the page"
          onClick={() => frame.current?.contentWindow?.location.reload()}
        >
          <RefreshCw size={16} />
        </button>
        <a
          href={path}
          target="_blank"
          rel="noreferrer"
          className={iconBtn}
          title="Open in a new tab"
          aria-label="Open in a new tab"
        >
          <ExternalLink size={16} />
        </a>
        <div className="ml-auto flex items-center gap-2">
          {dirty ? (
            <button type="button" className={btn} onClick={discard} disabled={busy}>
              Discard
            </button>
          ) : null}
          <button
            type="button"
            onClick={saveAll}
            disabled={!dirty || busy}
            className="inline-flex h-9 items-center rounded-full bg-action px-4 text-sm font-semibold text-on-action hover:bg-action-hover disabled:opacity-50"
          >
            {busy ? "Saving…" : dirty ? `Save changes (${dirtyIds.length})` : "Saved"}
          </button>
        </div>
      </header>

      {message ? (
        <div
          role="status"
          className={cn(
            "flex items-center justify-between gap-3 px-4 py-2 text-sm",
            message.tone === "ok" ? "bg-action/10 text-action" : "bg-red-50 text-red-800",
          )}
        >
          <span>{message.text}</span>
          <button type="button" onClick={() => setMessage(null)} aria-label="Dismiss" className="p-1">
            <X size={14} />
          </button>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1">
        <main ref={stage} className="relative min-w-0 flex-1 overflow-hidden">
          <div
            className="absolute left-1/2 top-4 origin-top overflow-hidden rounded-xl bg-canvas shadow-[0_12px_40px_-12px_rgba(15,23,42,0.35)] ring-1 ring-border-subtle"
            style={{ width, height: (box.h - 32) / scale, transform: `translateX(-50%) scale(${scale})` }}
          >
            <iframe ref={frame} src={src} title="Website" className="h-full w-full border-0" onLoad={onFrameLoad} />
          </div>
          <span className="absolute bottom-2 left-3 rounded-full bg-surface px-2.5 py-1 text-[11px] text-foreground-muted shadow">
            {editing
              ? found
                ? `Edit mode · ${found} editable items on this page · click one to edit`
                : "Edit mode · nothing on this page is editable here"
              : "Browse mode · click links to move around the site"}
            {scale < 1 ? ` · ${DEVICES[device].label} shown at ${Math.round(scale * 100)}%` : ""}
          </span>
        </main>

        <aside className="flex w-[24rem] shrink-0 flex-col border-l border-border-subtle bg-surface">
          <div className="border-b border-border-subtle p-4">
            <p className="font-bold">Editing {path}</p>
            <p className="text-xs text-foreground-muted">
              Click text on the page and type, or click a picture. Everything here is live after Save changes.
            </p>
          </div>
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
            {loading ? <p className="p-2 text-sm text-foreground-muted">Loading this page&apos;s content…</p> : null}
            {!loading && !targets.length ? (
              <p className="p-2 text-sm text-foreground-muted">
                Nothing on this page can be edited here yet. Its text is part of the website&apos;s design; ask for it
                to be made editable, or build a new version of it in the{" "}
                <Link href="/admin/builder/" className="font-semibold text-action">
                  page builder
                </Link>
                .
              </p>
            ) : null}
            {targets.map((t) =>
              t.kind === "link" ? (
                <div key={t.id} className="rounded-xl border border-border-subtle bg-canvas p-4">
                  <p className="text-sm font-semibold">{t.label}</p>
                  <p className="mt-1 text-xs text-foreground-muted">{t.text}</p>
                  <Link href={t.href} className={cn(btn, "mt-3")}>
                    {t.action}
                  </Link>
                </div>
              ) : (
                <section
                  key={t.id}
                  data-ve-panel={t.id}
                  className={cn(
                    "rounded-xl border bg-canvas",
                    open === t.id ? "border-action/60" : "border-border-subtle",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(open === t.id ? null : t.id)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                    aria-expanded={open === t.id}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{t.label}</span>
                      {dirtyIds.includes(t.id) ? (
                        <span className="text-xs font-semibold text-action">Unsaved changes</span>
                      ) : null}
                    </span>
                    <ChevronDown
                      size={16}
                      className={cn("shrink-0 transition-transform", open === t.id && "rotate-180")}
                    />
                  </button>
                  {open === t.id ? (
                    <div className="space-y-5 border-t border-border-subtle p-4">
                      <div className="space-y-5">
                        <Fields
                          key={`${t.id}:${formKey}`}
                          fields={t.fields}
                          value={values[t.id] ?? {}}
                          pictures={t.recent?.length ? [...t.recent, ...pictures] : pictures}
                          onChange={(next) => setValues((v) => ({ ...v, [t.id]: next }))}
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-3 border-t border-border-subtle pt-3 text-xs">
                        {t.editorHref ? (
                          <Link href={t.editorHref} className="font-semibold text-action">
                            Open the full editor (history, reset)
                          </Link>
                        ) : null}
                        <button
                          type="button"
                          className="font-semibold text-action"
                          onClick={async () => setPictures(await actions.pictures())}
                        >
                          Refresh pictures
                        </button>
                        <Link href="/admin/media/" target="_blank" className="font-semibold text-action">
                          Upload pictures
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </section>
              ),
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
