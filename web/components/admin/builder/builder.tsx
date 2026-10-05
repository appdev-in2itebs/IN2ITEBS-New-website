"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type DragEvent, type ReactNode } from "react";
import {
  AlignLeft,
  ArrowLeft,
  Building2,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Columns2,
  Copy,
  ExternalLink,
  Eye,
  GripVertical,
  Hash,
  House,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  Mail,
  Megaphone,
  MessageSquareQuote,
  Monitor,
  MoveVertical,
  PanelTop,
  Pilcrow,
  Plus,
  Quote,
  Redo2,
  RefreshCw,
  Settings2,
  Smartphone,
  Tablet,
  Trash2,
  Undo2,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import { Fields, type PictureOption } from "@/components/admin/content-form";
import { blockTitle } from "@/components/blocks/render";
import {
  BLOCKS,
  BLOCK_GROUPS,
  HOME_SECTIONS,
  blockId,
  isBlockType,
  newBlock,
  slugify,
  type Block,
  type BlockType,
  type BuiltPage,
  type HomeSection,
  type PageDoc,
} from "@/lib/builder/blocks";
import { cn } from "@/lib/utils";
import { DRAG_BLOCK, DRAG_NEW, type FromCanvas, type ToCanvas } from "./protocol";
import type { SaveResult } from "@/app/admin/(portal)/builder/actions";

export type Version = { id: string; action: string; at: string; by: string | null };

type Actions = {
  save: (key: string, doc: PageDoc) => Promise<SaveResult>;
  publish: (key: string, doc: PageDoc) => Promise<SaveResult>;
  unpublish: (key: string) => Promise<SaveResult>;
  loadVersion: (key: string, id: string) => Promise<PageDoc | null>;
  pictures: () => Promise<PictureOption[]>;
};

const ICONS: Record<BlockType, LucideIcon> = {
  hero: PanelTop,
  text: AlignLeft,
  richText: Pilcrow,
  imageText: Columns2,
  cards: LayoutGrid,
  stats: Hash,
  quote: Quote,
  faq: CircleHelp,
  image: ImageIcon,
  video: Video,
  testimonials: MessageSquareQuote,
  logos: Building2,
  contact: Mail,
  cta: Megaphone,
  spacer: MoveVertical,
  section: House,
};

const DEVICES = {
  desktop: { label: "Desktop", width: 1280, icon: Monitor },
  tablet: { label: "Tablet", width: 820, icon: Tablet },
  mobile: { label: "Phone", width: 390, icon: Smartphone },
} as const;
type Device = keyof typeof DEVICES;

const btn =
  "inline-flex h-9 items-center gap-1.5 rounded-full border border-border-subtle bg-surface px-3.5 text-sm font-semibold text-foreground hover:border-action hover:text-action disabled:pointer-events-none disabled:opacity-40";
const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground-muted hover:bg-surface-subtle hover:text-action disabled:pointer-events-none disabled:opacity-30";

/**
 * The page builder: block library and layers on the left, the live page in the middle, the selected
 * block's settings on the right. Blocks are dragged from the library onto the page or the layer
 * list, and dragged within either to reorder. Ctrl+Z / Ctrl+Shift+Z undo and redo, Ctrl+S saves.
 */
export function Builder({
  pageKey,
  initial,
  home,
  pictures: initialPictures,
  versions,
  siteUrl,
  actions,
}: {
  pageKey: string;
  initial: BuiltPage;
  home: boolean;
  pictures: PictureOption[];
  versions: Version[];
  siteUrl: string;
  actions: Actions;
}) {
  const [doc, setDoc] = useState<PageDoc>(initial.draft);
  const [live, setLive] = useState<PageDoc | null>(initial.live);
  const [saved, setSaved] = useState(() => JSON.stringify(initial.draft));
  const [selected, setSelected] = useState<string | null>(null);
  const [left, setLeft] = useState<"add" | "layers">("add");
  const [insertAt, setInsertAt] = useState<number | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [busy, setBusy] = useState<"" | "save" | "publish" | "unpublish">("");
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [pictures, setPictures] = useState(initialPictures);
  const [past, setPast] = useState<PageDoc[]>([]);
  const [future, setFuture] = useState<PageDoc[]>([]);
  const lastEdit = useRef<{ key: string; at: number } | null>(null);

  const dirty = JSON.stringify(doc) !== saved;
  const published = Boolean(live);
  const liveMatches = published && JSON.stringify(live) === JSON.stringify(doc);
  const selectedBlock = doc.blocks.find((b) => b.id === selected) ?? null;
  const address = home ? "/" : `/${doc.slug}/`;

  /** Every change goes through here, so it can be undone. Typing in one field counts as one step. */
  const current = useRef(doc);
  current.current = doc;
  const change = (next: PageDoc, coalesce?: string) => {
    const now = Date.now();
    const same = coalesce && lastEdit.current?.key === coalesce && now - lastEdit.current.at < 1500;
    lastEdit.current = coalesce ? { key: coalesce, at: now } : null;
    if (!same) setPast((p) => [...p.slice(-49), current.current]);
    setFuture([]);
    setDoc(next);
  };

  const setBlocks = (blocks: Block[], coalesce?: string) => change({ ...doc, blocks }, coalesce);

  const undo = () => {
    if (!past.length) return;
    setFuture([current.current, ...future]);
    setDoc(past[past.length - 1]);
    setPast(past.slice(0, -1));
    lastEdit.current = null;
  };
  const redo = () => {
    if (!future.length) return;
    setPast([...past, current.current]);
    setDoc(future[0]);
    setFuture(future.slice(1));
    lastEdit.current = null;
  };

  // ---------------------------------------------------------------- block operations

  const insert = (type: BlockType, index: number, props?: Record<string, unknown>) => {
    const b = newBlock(type);
    if (props) b.props = props;
    const blocks = [...doc.blocks];
    blocks.splice(Math.max(0, Math.min(index, blocks.length)), 0, b);
    setBlocks(blocks);
    setSelected(b.id);
    setInsertAt(null);
    setTimeout(() => post({ kind: "reveal", id: b.id }), 120);
  };

  const addSection = (section: HomeSection, index: number) => insert("section", index, { section });

  const move = (id: string, index: number) => {
    const from = doc.blocks.findIndex((b) => b.id === id);
    if (from < 0) return;
    const blocks = [...doc.blocks];
    const [b] = blocks.splice(from, 1);
    blocks.splice(index > from ? index - 1 : index, 0, b);
    setBlocks(blocks);
    setSelected(id);
  };

  const act = (id: string, action: "up" | "down" | "duplicate" | "delete") => {
    const i = doc.blocks.findIndex((b) => b.id === id);
    if (i < 0) return;
    if (action === "up" && i > 0) move(id, i - 1);
    if (action === "down" && i < doc.blocks.length - 1) move(id, i + 2);
    if (action === "duplicate") {
      const copy: Block = { ...structuredClone(doc.blocks[i]), id: blockId() };
      const blocks = [...doc.blocks];
      blocks.splice(i + 1, 0, copy);
      setBlocks(blocks);
      setSelected(copy.id);
    }
    if (action === "delete") {
      setBlocks(doc.blocks.filter((b) => b.id !== id));
      setSelected(null);
    }
  };

  const insertIndex = () => {
    if (insertAt !== null) return insertAt;
    const i = doc.blocks.findIndex((b) => b.id === selected);
    return i >= 0 ? i + 1 : doc.blocks.length;
  };

  // ---------------------------------------------------------------- the canvas

  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const post = (m: ToCanvas) => frame.current?.contentWindow?.postMessage(m, window.location.origin);

  useEffect(() => {
    if (ready) post({ kind: "render", blocks: doc.blocks, selected });
  }, [ready, doc.blocks, selected]);

  // The canvas talks back: keep the latest handlers in a ref so the listener is added once.
  const handlers = useRef<(m: FromCanvas) => void>(() => {});
  handlers.current = (m) => {
    if (m.kind === "ready") setReady(true);
    if (m.kind === "select") setSelected(m.id);
    if (m.kind === "move") move(m.id, m.index);
    if (m.kind === "insert") insert(m.type, m.index);
    if (m.kind === "action") act(m.id, m.action);
    if (m.kind === "addAt") {
      setInsertAt(m.index);
      setLeft("add");
    }
  };
  useEffect(() => {
    const onMessage = (e: MessageEvent<FromCanvas>) => {
      if (e.origin !== window.location.origin || e.source !== frame.current?.contentWindow) return;
      handlers.current(e.data);
    };
    window.addEventListener("message", onMessage);
    // Either side may start first: the canvas says "ready" when it starts, and is asked here too.
    post({ kind: "hello" });
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Fit the chosen device width into the space available, scaled down when it does not fit.
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

  // ---------------------------------------------------------------- saving

  const run = async (kind: "save" | "publish" | "unpublish") => {
    setBusy(kind);
    setMessage(null);
    try {
      const result =
        kind === "unpublish"
          ? await actions.unpublish(pageKey)
          : await (kind === "publish" ? actions.publish : actions.save)(pageKey, doc);
      if (!result.ok) {
        setMessage({ tone: "error", text: result.error });
        return false;
      }
      setSaved(JSON.stringify(doc));
      if (kind === "publish") setLive(structuredClone(doc));
      if (kind === "unpublish") setLive(null);
      setMessage({
        tone: "ok",
        text:
          kind === "publish"
            ? `Published. It is live at ${address}`
            : kind === "unpublish"
              ? home
                ? "The homepage is back to its original layout."
                : "Taken off the website. The draft is kept here."
              : "Draft saved. Visitors still see the published version.",
      });
      return true;
    } catch {
      setMessage({ tone: "error", text: "Could not reach the server. Check the connection and try again." });
      return false;
    } finally {
      setBusy("");
    }
  };

  const preview = async () => {
    const tab = window.open("about:blank", "_blank");
    if (dirty && !(await run("save"))) {
      tab?.close();
      return;
    }
    if (tab) tab.location.href = `/admin/builder/${pageKey}/preview/`;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      const typing = (e.target as HTMLElement)?.closest?.("input, textarea, select");
      if (k === "s") {
        e.preventDefault();
        void run("save");
      } else if (k === "z" && !typing) {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (k === "y" && !typing) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const status = !published
    ? {
        text: home ? "Original layout live" : "Draft · not on the website",
        cls: "bg-surface-subtle text-foreground-muted",
      }
    : liveMatches
      ? { text: "Published", cls: "bg-action/10 text-action" }
      : { text: "Changes not published", cls: "bg-gold-soft/30 text-foreground" };

  // ---------------------------------------------------------------- layout

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-surface-subtle text-foreground">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border-subtle bg-surface px-3">
        <Link href="/admin/builder/" className={iconBtn} title="Back to all pages" aria-label="Back to all pages">
          <ArrowLeft size={18} />
        </Link>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-tight">
            {home ? "Homepage layout" : doc.title || "Untitled"}
          </p>
          <p className="truncate text-xs text-foreground-muted">{address}</p>
        </div>
        <span className={cn("hidden shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold sm:inline", status.cls)}>
          {status.text}
        </span>
        {dirty ? <span className="hidden text-xs text-foreground-muted lg:inline">Unsaved changes</span> : null}

        <div className="mx-auto flex items-center gap-1 rounded-full bg-surface-subtle p-1">
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
          onClick={undo}
          disabled={!past.length}
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
        >
          <Undo2 size={17} />
        </button>
        <button
          type="button"
          className={iconBtn}
          onClick={redo}
          disabled={!future.length}
          title="Redo (Ctrl+Shift+Z)"
          aria-label="Redo"
        >
          <Redo2 size={17} />
        </button>

        {versions.length ? (
          <select
            aria-label="Earlier versions"
            className="hidden h-9 max-w-[11rem] rounded-full border border-border-subtle bg-surface px-3 text-sm lg:block"
            value=""
            onChange={async (e) => {
              const id = e.target.value;
              if (
                !id ||
                !confirm("Load this earlier version into the editor? Nothing changes on the website until you publish.")
              )
                return;
              const v = await actions.loadVersion(pageKey, id);
              if (v) {
                change(v);
                setSelected(null);
                setMessage({
                  tone: "ok",
                  text: "Earlier version loaded. Save or publish to keep it; Undo to go back.",
                });
              }
            }}
          >
            <option value="">Versions…</option>
            {versions.map((v) => (
              <option key={v.id} value={v.id}>
                {new Date(v.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} · {v.action}
                {v.by ? ` · ${v.by.split("@")[0]}` : ""}
              </option>
            ))}
          </select>
        ) : null}

        <button
          type="button"
          className={btn}
          onClick={preview}
          disabled={!!busy}
          title="Open the saved draft in a new tab"
        >
          <Eye size={15} /> <span className="hidden md:inline">Preview</span>
        </button>
        <button type="button" className={btn} onClick={() => run("save")} disabled={!!busy || !dirty}>
          {busy === "save" ? "Saving…" : "Save draft"}
        </button>
        <button
          type="button"
          onClick={() => run("publish")}
          disabled={!!busy || (liveMatches && !dirty)}
          className="inline-flex h-9 items-center rounded-full bg-action px-4 text-sm font-semibold text-on-action hover:bg-action-hover disabled:opacity-50"
        >
          {busy === "publish" ? "Publishing…" : published ? "Update live page" : "Publish"}
        </button>
      </header>

      {message ? (
        <div
          role="status"
          className={cn(
            "flex items-center justify-between gap-3 px-4 py-2 text-sm",
            message.tone === "ok" ? "bg-action/10 text-action" : "bg-red-50 text-red-800",
          )}
        >
          <span>
            {message.text}
            {message.tone === "ok" && published && !home && message.text.startsWith("Published") ? (
              <a href={address} target="_blank" rel="noreferrer" className="ml-2 font-semibold underline">
                Open it
              </a>
            ) : null}
          </span>
          <button type="button" onClick={() => setMessage(null)} aria-label="Dismiss" className="p-1">
            <X size={14} />
          </button>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1">
        {/* Left: library and layers */}
        <aside className="flex w-72 shrink-0 flex-col border-r border-border-subtle bg-surface">
          <div className="flex border-b border-border-subtle p-1.5">
            {(
              [
                ["add", "Add blocks", Plus],
                ["layers", "Layers", Layers],
              ] as const
            ).map(([k, label, Icon]) => (
              <button
                key={k}
                type="button"
                onClick={() => setLeft(k)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold",
                  left === k ? "bg-surface-subtle text-action" : "text-foreground-muted hover:text-foreground",
                )}
              >
                <Icon size={15} /> {label}
                {k === "layers" ? <span className="text-xs font-normal">({doc.blocks.length})</span> : null}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {left === "add" ? (
              <Library
                home={home}
                used={new Set(doc.blocks.filter((b) => b.type === "section").map((b) => String(b.props.section)))}
                insertAt={insertAt}
                onCancelInsert={() => setInsertAt(null)}
                onAdd={(type) => insert(type, insertIndex())}
                onAddSection={(s) => addSection(s, insertIndex())}
              />
            ) : (
              <LayerList
                blocks={doc.blocks}
                selected={selected}
                onSelect={(id) => {
                  setSelected(id);
                  post({ kind: "reveal", id });
                }}
                onMove={move}
                onInsert={(type, index) => insert(type, index)}
                onAction={act}
              />
            )}
          </div>
        </aside>

        {/* Middle: the live page */}
        <main ref={stage} className="relative min-w-0 flex-1 overflow-hidden">
          <div
            className="absolute left-1/2 top-4 origin-top overflow-hidden rounded-xl bg-canvas shadow-[0_12px_40px_-12px_rgba(15,23,42,0.35)] ring-1 ring-border-subtle"
            style={{
              width,
              height: (box.h - 32) / scale,
              transform: `translateX(-50%) scale(${scale})`,
            }}
          >
            <iframe
              ref={frame}
              src="/admin/canvas/"
              title="Page preview"
              className="h-full w-full border-0"
              onLoad={() => post({ kind: "hello" })}
            />
          </div>
          {scale < 1 ? (
            <span className="absolute bottom-2 right-3 rounded-full bg-surface px-2 py-0.5 text-[11px] text-foreground-muted shadow">
              {DEVICES[device].label} · {width}px · shown at {Math.round(scale * 100)}%
            </span>
          ) : null}
        </main>

        {/* Right: settings */}
        <aside className="flex w-[22rem] shrink-0 flex-col border-l border-border-subtle bg-surface">
          {selectedBlock ? (
            <BlockSettings
              key={selectedBlock.id}
              block={selectedBlock}
              index={doc.blocks.indexOf(selectedBlock)}
              count={doc.blocks.length}
              pictures={pictures}
              onRefreshPictures={async () => setPictures(await actions.pictures())}
              onClose={() => setSelected(null)}
              onAction={(a) => act(selectedBlock.id, a)}
              onChange={(props, field) =>
                setBlocks(
                  doc.blocks.map((b) => (b.id === selectedBlock.id ? { ...b, props } : b)),
                  `${selectedBlock.id}:${field}`,
                )
              }
            />
          ) : (
            <PageSettings
              doc={doc}
              home={home}
              siteUrl={siteUrl}
              published={published}
              liveSlug={live?.slug}
              busy={!!busy}
              onChange={(next, field) => change(next, `page:${field}`)}
              onUnpublish={() => {
                if (
                  confirm(
                    home
                      ? "Go back to the original homepage layout? Your layout stays here as a draft."
                      : "Take this page off the website? The draft stays here.",
                  )
                )
                  void run("unpublish");
              }}
            />
          )}
        </aside>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ left panel

function Library({
  home,
  used,
  insertAt,
  onCancelInsert,
  onAdd,
  onAddSection,
}: {
  home: boolean;
  used: Set<string>;
  insertAt: number | null;
  onCancelInsert: () => void;
  onAdd: (type: BlockType) => void;
  onAddSection: (s: HomeSection) => void;
}) {
  const missing = (Object.keys(HOME_SECTIONS) as HomeSection[]).filter((s) => !used.has(s));
  return (
    <div className="space-y-5">
      {insertAt !== null ? (
        <div className="flex items-center justify-between rounded-lg bg-action/10 px-3 py-2 text-xs font-semibold text-action">
          Adding at position {insertAt + 1}
          <button type="button" onClick={onCancelInsert} aria-label="Cancel">
            <X size={14} />
          </button>
        </div>
      ) : (
        <p className="text-xs text-foreground-muted">
          Drag a block onto the page, or click it to add it below the selected block.
        </p>
      )}
      {home && missing.length ? (
        <Group title="Homepage sections (removed)">
          {missing.map((s) => (
            <Item
              key={s}
              icon={House}
              label={HOME_SECTIONS[s]}
              description="Put this section back."
              onClick={() => onAddSection(s)}
            />
          ))}
        </Group>
      ) : null}
      {BLOCK_GROUPS.map((g) => (
        <Group key={g} title={g}>
          {(Object.keys(BLOCKS) as BlockType[])
            .filter((t) => BLOCKS[t].group === g)
            .map((t) => (
              <Item
                key={t}
                icon={ICONS[t]}
                label={BLOCKS[t].label}
                description={BLOCKS[t].description}
                onClick={() => onAdd(t)}
                drag={t}
              />
            ))}
        </Group>
      ))}
    </div>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">{title}</p>
      <div className="grid grid-cols-2 gap-2">{children}</div>
    </div>
  );
}

function Item({
  icon: Icon,
  label,
  description,
  onClick,
  drag,
}: {
  icon: LucideIcon;
  label: string;
  description: string;
  onClick: () => void;
  drag?: BlockType;
}) {
  return (
    <button
      type="button"
      title={description}
      onClick={onClick}
      draggable={Boolean(drag)}
      onDragStart={(e) => {
        if (!drag) return;
        e.dataTransfer.effectAllowed = "copy";
        e.dataTransfer.setData(DRAG_NEW, drag);
      }}
      className="flex cursor-grab flex-col items-center gap-1.5 rounded-xl border border-border-subtle bg-canvas px-2 py-3 text-center text-xs font-semibold text-foreground transition-colors hover:border-action hover:text-action active:cursor-grabbing"
    >
      <Icon size={20} strokeWidth={1.6} aria-hidden />
      {label}
    </button>
  );
}

function LayerList({
  blocks,
  selected,
  onSelect,
  onMove,
  onInsert,
  onAction,
}: {
  blocks: Block[];
  selected: string | null;
  onSelect: (id: string) => void;
  onMove: (id: string, index: number) => void;
  onInsert: (type: BlockType, index: number) => void;
  onAction: (id: string, a: "up" | "down" | "duplicate" | "delete") => void;
}) {
  const [over, setOverState] = useState<number | null>(null);
  // The drop reads the ref: a drop can arrive before React has re-rendered the last drag-over.
  const overRef = useRef<number | null>(null);
  const setOver = (i: number | null) => {
    overRef.current = i;
    setOverState(i);
  };
  const accepts = (e: DragEvent) =>
    e.dataTransfer.types.includes(DRAG_BLOCK) || e.dataTransfer.types.includes(DRAG_NEW);
  const drop = (e: DragEvent) => {
    e.preventDefault();
    const index = overRef.current ?? blocks.length;
    setOver(null);
    const id = e.dataTransfer.getData(DRAG_BLOCK);
    const type = e.dataTransfer.getData(DRAG_NEW);
    if (id) onMove(id, index);
    else if (isBlockType(type)) onInsert(type, index);
  };
  if (!blocks.length) return <p className="text-sm text-foreground-muted">No blocks yet. Add one from “Add blocks”.</p>;
  return (
    <ol
      className="space-y-1.5"
      onDragOver={(e) => {
        if (accepts(e)) e.preventDefault();
      }}
      onDrop={drop}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(null);
      }}
    >
      {blocks.map((b, i) => {
        const Icon = ICONS[b.type];
        return (
          <li
            key={b.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData(DRAG_BLOCK, b.id);
            }}
            onDragEnd={() => setOver(null)}
            onDragOver={(e) => {
              if (!accepts(e)) return;
              e.preventDefault();
              const box = e.currentTarget.getBoundingClientRect();
              setOver(e.clientY < box.top + box.height / 2 ? i : i + 1);
            }}
            className={cn(
              "group relative flex cursor-grab items-center gap-2 rounded-lg border px-2 py-2 text-sm active:cursor-grabbing",
              selected === b.id ? "border-action bg-action/5" : "border-border-subtle bg-canvas hover:border-action/50",
              over === i &&
                "before:absolute before:-top-1.5 before:left-0 before:right-0 before:h-0.5 before:bg-action",
              over === i + 1 &&
                i === blocks.length - 1 &&
                "after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:h-0.5 after:bg-action",
            )}
            onClick={() => onSelect(b.id)}
          >
            <GripVertical size={14} className="shrink-0 text-foreground-muted" aria-hidden />
            <Icon size={15} className="shrink-0 text-action" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{blockTitle(b)}</span>
              <span className="block text-[11px] text-foreground-muted">{BLOCKS[b.type].label}</span>
            </span>
            <span className="hidden shrink-0 group-hover:flex">
              <button
                type="button"
                className={iconBtn}
                disabled={i === 0}
                onClick={(e) => (e.stopPropagation(), onAction(b.id, "up"))}
                aria-label="Move up"
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                className={iconBtn}
                disabled={i === blocks.length - 1}
                onClick={(e) => (e.stopPropagation(), onAction(b.id, "down"))}
                aria-label="Move down"
              >
                <ChevronDown size={14} />
              </button>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

// ------------------------------------------------------------------ right panel

function BlockSettings({
  block,
  index,
  count,
  pictures,
  onRefreshPictures,
  onClose,
  onAction,
  onChange,
}: {
  block: Block;
  index: number;
  count: number;
  pictures: PictureOption[];
  onRefreshPictures: () => Promise<void>;
  onClose: () => void;
  onAction: (a: "up" | "down" | "duplicate" | "delete") => void;
  onChange: (props: Record<string, unknown>, field: string) => void;
}) {
  const def = BLOCKS[block.type];
  const Icon = ICONS[block.type];
  const [refreshing, setRefreshing] = useState(false);
  const hasPicture = useMemo(() => JSON.stringify(def.fields).includes('"kind":"picture"'), [def.fields]);
  return (
    <>
      <div className="flex items-start gap-3 border-b border-border-subtle p-4">
        <span className="icon-tile h-9 w-9 shrink-0 rounded-lg">
          <Icon size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold">{def.label}</p>
          <p className="text-xs text-foreground-muted">
            Block {index + 1} of {count} · {def.description}
          </p>
        </div>
        <button
          type="button"
          className={iconBtn}
          onClick={onClose}
          title="Page settings"
          aria-label="Close block settings"
        >
          <Settings2 size={16} />
        </button>
      </div>
      <div className="flex gap-1 border-b border-border-subtle px-3 py-2">
        <button
          type="button"
          className={iconBtn}
          disabled={index === 0}
          onClick={() => onAction("up")}
          title="Move up"
          aria-label="Move up"
        >
          <ChevronUp size={16} />
        </button>
        <button
          type="button"
          className={iconBtn}
          disabled={index === count - 1}
          onClick={() => onAction("down")}
          title="Move down"
          aria-label="Move down"
        >
          <ChevronDown size={16} />
        </button>
        {block.type !== "section" ? (
          <button
            type="button"
            className={iconBtn}
            onClick={() => onAction("duplicate")}
            title="Duplicate"
            aria-label="Duplicate"
          >
            <Copy size={15} />
          </button>
        ) : null}
        <button
          type="button"
          className={cn(iconBtn, "ml-auto hover:text-red-700")}
          onClick={() => onAction("delete")}
          title="Remove block"
          aria-label="Remove block"
        >
          <Trash2 size={15} />
        </button>
      </div>
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        {block.type === "section" ? (
          <p className="text-sm text-foreground-muted">
            This is the homepage&apos;s own <strong>{HOME_SECTIONS[block.props.section as HomeSection]}</strong>{" "}
            section. Drag it to move it, or remove it to hide it. Its text is edited in Website content.
          </p>
        ) : block.type === "testimonials" ? (
          <p className="text-sm text-foreground-muted">
            Shows the client quotes from{" "}
            <Link href="/admin/content/testimonials/" target="_blank" className="font-semibold text-action">
              Website content → Testimonials
            </Link>
            .
          </p>
        ) : (
          <Fields
            fields={def.fields}
            value={block.props}
            pictures={pictures}
            onChange={(next) => {
              const field = Object.keys(next).find((k) => next[k] !== block.props[k]) ?? "";
              onChange(next, field);
            }}
          />
        )}
        {hasPicture ? (
          <p className="flex flex-wrap items-center gap-2 text-xs text-foreground-muted">
            Need a new picture?
            <Link
              href="/admin/media/"
              target="_blank"
              className="inline-flex items-center gap-1 font-semibold text-action"
            >
              Upload it <ExternalLink size={12} />
            </Link>
            then
            <button
              type="button"
              className="inline-flex items-center gap-1 font-semibold text-action"
              onClick={async () => {
                setRefreshing(true);
                await onRefreshPictures();
                setRefreshing(false);
              }}
            >
              <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} /> refresh the list
            </button>
          </p>
        ) : null}
      </div>
    </>
  );
}

function PageSettings({
  doc,
  home,
  siteUrl,
  published,
  liveSlug,
  busy,
  onChange,
  onUnpublish,
}: {
  doc: PageDoc;
  home: boolean;
  siteUrl: string;
  published: boolean;
  liveSlug?: string;
  busy: boolean;
  onChange: (doc: PageDoc, field: string) => void;
  onUnpublish: () => void;
}) {
  const field =
    "mt-1 block w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-foreground focus:border-action focus:outline-none";
  return (
    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
      <div>
        <p className="font-bold">{home ? "Homepage layout" : "Page settings"}</p>
        <p className="text-xs text-foreground-muted">Click a block on the page to edit it.</p>
      </div>
      {home ? (
        <p className="text-sm text-foreground-muted">
          The dashed boxes are the homepage&apos;s own sections. Drag them into a new order, remove the ones you do not
          want, and add your own blocks between them. Publish to put the new layout live.
        </p>
      ) : (
        <>
          <label className="block text-sm font-medium">
            Page title *
            <input
              className={field}
              value={doc.title}
              maxLength={120}
              onChange={(e) => onChange({ ...doc, title: e.target.value }, "title")}
            />
            <span className="mt-1 block text-xs text-foreground-muted">Shown in the browser tab and in Google.</span>
          </label>
          <label className="block text-sm font-medium">
            Address *
            <span className="mt-1 flex items-center rounded-lg border border-border-subtle bg-surface-subtle text-sm focus-within:border-action">
              <span className="pl-3 text-foreground-muted">/</span>
              <input
                className="min-w-0 flex-1 bg-transparent px-1 py-2 focus:outline-none"
                value={doc.slug}
                maxLength={180}
                onChange={(e) => onChange({ ...doc, slug: e.target.value.toLowerCase() }, "slug")}
                onBlur={() => onChange({ ...doc, slug: slugify(doc.slug) }, "slug")}
              />
              <span className="pr-3 text-foreground-muted">/</span>
            </span>
            <span className="mt-1 block break-all text-xs text-foreground-muted">
              {siteUrl}/{slugify(doc.slug)}/
              {published && liveSlug && liveSlug !== slugify(doc.slug)
                ? ` · now live at /${liveSlug}/; the new address applies when you publish.`
                : ""}
            </span>
          </label>
          <label className="block text-sm font-medium">
            Search engine description
            <textarea
              className={field}
              rows={3}
              maxLength={200}
              value={doc.description ?? ""}
              onChange={(e) => onChange({ ...doc, description: e.target.value }, "description")}
            />
            <span className="mt-1 block text-xs text-foreground-muted">
              What Google shows under the title. 70–160 characters ({(doc.description ?? "").length}).
            </span>
          </label>
        </>
      )}
      {published ? (
        <div className="border-t border-border-subtle pt-5">
          {!home && liveSlug ? (
            <a href={`/${liveSlug}/`} target="_blank" rel="noreferrer" className={cn(btn, "mb-3")}>
              View live page <ExternalLink size={14} />
            </a>
          ) : null}
          <button
            type="button"
            className={cn(btn, "hover:border-red-700 hover:text-red-700")}
            disabled={busy}
            onClick={onUnpublish}
          >
            {home ? "Go back to the original layout" : "Unpublish"}
          </button>
        </div>
      ) : null}
      <div className="border-t border-border-subtle pt-5 text-xs text-foreground-muted">
        <p className="font-semibold text-foreground">Shortcuts</p>
        <p className="mt-1">Ctrl+S save draft · Ctrl+Z undo · Ctrl+Shift+Z redo</p>
      </div>
    </div>
  );
}
