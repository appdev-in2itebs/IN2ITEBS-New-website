"use client";

import { useEffect, useLayoutEffect, useRef, useState, type DragEvent } from "react";
import { ChevronDown, ChevronUp, Copy, GripVertical, Plus, Trash2 } from "lucide-react";
import { BlockView, blockTitle } from "@/components/blocks/render";
import { BLOCKS, isBlockType, type Block } from "@/lib/builder/blocks";
import { cn } from "@/lib/utils";
import { DRAG_BLOCK, DRAG_NEW, type FromCanvas, type ToCanvas } from "./protocol";

/**
 * The builder's live preview, inside an iframe so the page is laid out at the chosen device width
 * with the site's real styles. It draws the blocks the builder sends, outlines the selected one, and
 * reports clicks, drags and toolbar actions back. The blocks themselves are inert here: links,
 * buttons and the enquiry form do nothing, so editing can never send a real enquiry.
 */
export function BuilderCanvas() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [dropAt, setDropAtState] = useState<number | null>(null);
  // The drop reads the ref: a drop can arrive before React has re-rendered the last drag-over.
  const dropRef = useRef<number | null>(null);
  const setDropAt = (i: number | null) => {
    dropRef.current = i;
    setDropAtState(i);
  };
  const refs = useRef(new Map<string, HTMLDivElement>());

  const send = (m: FromCanvas) => window.parent.postMessage(m, window.location.origin);

  useEffect(() => {
    const onMessage = (e: MessageEvent<ToCanvas>) => {
      if (e.origin !== window.location.origin || e.source !== window.parent) return;
      if (e.data?.kind === "hello") send({ kind: "ready" });
      else if (e.data?.kind === "render") {
        setBlocks(e.data.blocks);
        setSelected(e.data.selected);
      } else if (e.data?.kind === "reveal") {
        refs.current.get(e.data.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    window.addEventListener("message", onMessage);
    send({ kind: "ready" });
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Scroll-in animations would leave freshly added blocks hidden: show everything at once.
  useLayoutEffect(() => {
    document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => (el.dataset.reveal = "in"));
  });

  const accepts = (e: DragEvent) =>
    e.dataTransfer.types.includes(DRAG_BLOCK) || e.dataTransfer.types.includes(DRAG_NEW);

  const onDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    if (!accepts(e)) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = e.dataTransfer.types.includes(DRAG_BLOCK) ? "move" : "copy";
    const box = e.currentTarget.getBoundingClientRect();
    setDropAt(e.clientY < box.top + box.height / 2 ? index : index + 1);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    const index = dropRef.current ?? blocks.length;
    setDropAt(null);
    const id = e.dataTransfer.getData(DRAG_BLOCK);
    const type = e.dataTransfer.getData(DRAG_NEW);
    if (id) send({ kind: "move", id, index });
    else if (isBlockType(type)) send({ kind: "insert", type, index });
  };

  return (
    <div
      className="min-h-svh bg-canvas pb-24"
      onDragOver={(e) => {
        if (!accepts(e)) return;
        e.preventDefault();
        if (!blocks.length) setDropAt(0);
      }}
      onDragLeave={(e) => {
        if (!e.relatedTarget) setDropAt(null);
      }}
      onDrop={onDrop}
      onClick={() => send({ kind: "select", id: null })}
    >
      {blocks.map((b, i) => (
        <div
          key={b.id}
          ref={(el) => {
            if (el) refs.current.set(b.id, el);
            else refs.current.delete(b.id);
          }}
          className="group/block relative"
          onDragOver={(e) => onDragOver(e, i)}
        >
          {dropAt === i ? <DropLine /> : null}
          <div className="pointer-events-none" aria-hidden>
            <BlockView block={b} first={i === 0} ctx={{ preview: true }} />
          </div>
          <button
            type="button"
            aria-label={`Select ${BLOCKS[b.type].label}`}
            onClick={(e) => {
              e.stopPropagation();
              send({ kind: "select", id: b.id });
            }}
            className={cn(
              "absolute inset-0 z-10 cursor-pointer outline-none",
              selected === b.id ? "ring-[3px] ring-inset ring-action" : "ring-inset hover:ring-2 hover:ring-action/50",
            )}
          />
          <div
            className={cn(
              "absolute right-3 top-3 z-20 flex items-center gap-0.5 rounded-full bg-brand p-1 text-on-brand shadow-lg transition-opacity",
              selected === b.id ? "opacity-100" : "opacity-0 group-hover/block:opacity-100",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData(DRAG_BLOCK, b.id);
                send({ kind: "select", id: b.id });
              }}
              onDragEnd={() => setDropAt(null)}
              title="Drag to move"
              className="flex cursor-grab items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold active:cursor-grabbing"
            >
              <GripVertical size={14} aria-hidden />
              <span className="max-w-[16rem] truncate">{blockTitle(b)}</span>
            </span>
            <Tool label="Move up" disabled={i === 0} onClick={() => send({ kind: "action", id: b.id, action: "up" })}>
              <ChevronUp size={15} />
            </Tool>
            <Tool
              label="Move down"
              disabled={i === blocks.length - 1}
              onClick={() => send({ kind: "action", id: b.id, action: "down" })}
            >
              <ChevronDown size={15} />
            </Tool>
            {b.type !== "section" ? (
              <Tool label="Duplicate" onClick={() => send({ kind: "action", id: b.id, action: "duplicate" })}>
                <Copy size={14} />
              </Tool>
            ) : null}
            <Tool label="Remove" onClick={() => send({ kind: "action", id: b.id, action: "delete" })}>
              <Trash2 size={14} />
            </Tool>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              send({ kind: "addAt", index: i + 1 });
            }}
            className="absolute -bottom-4 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-1 rounded-full bg-action px-3 py-1.5 text-xs font-semibold text-on-action shadow-lg group-hover/block:inline-flex"
          >
            <Plus size={14} aria-hidden /> Add block here
          </button>
          {dropAt === i + 1 && i === blocks.length - 1 ? <DropLine bottom /> : null}
        </div>
      ))}
      {!blocks.length ? (
        <div className="mx-auto max-w-xl px-6 pt-32 text-center">
          <div
            className={cn(
              "rounded-3xl border-2 border-dashed p-12",
              dropAt === 0 ? "border-action bg-action/5" : "border-border-strong/40",
            )}
          >
            <p className="text-xl font-bold">Your page is empty</p>
            <p className="mt-2 text-sm text-foreground-muted">
              Drag a block here from the left, or click one to add it.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DropLine({ bottom = false }: { bottom?: boolean }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 z-40 flex items-center",
        bottom ? "-bottom-1.5" : "-top-1.5",
      )}
    >
      <span className="h-3 w-3 rounded-full bg-action" />
      <span className="h-1 flex-1 bg-action" />
      <span className="h-3 w-3 rounded-full bg-action" />
    </div>
  );
}

function Tool({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="rounded-full p-1.5 hover:bg-on-brand/15 disabled:opacity-30"
    >
      {children}
    </button>
  );
}
