"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Field } from "@/lib/cms/registry";
import { PICTURE_GROUPS, pictureGroup, type PictureOption } from "@/lib/cms/picture-groups";

/**
 * The editor for one piece of website content, rendered from its field definitions
 * (lib/cms/registry.ts). The whole value travels to the server action as one JSON field, where it is
 * sanitised against the same definitions.
 */
export type { PictureOption };

type Value = Record<string, unknown>;

const inputCls = "aura-input";
const smallBtn =
  "rounded-md border border-border-subtle px-2 py-1 text-xs font-semibold text-foreground hover:border-action hover:text-action disabled:opacity-40";

export function ContentForm({
  fields,
  initial,
  action,
  hidden,
  pictures,
  submitLabel = "Save and publish",
  footer,
}: {
  fields: readonly Field[];
  initial: Value;
  action: (form: FormData) => void | Promise<void>;
  hidden: Record<string, string>;
  pictures: PictureOption[];
  submitLabel?: string;
  footer?: ReactNode;
}) {
  const [value, setValue] = useState<Value>(initial);
  const [saving, setSaving] = useState(false);
  const dirty = useRef(false);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  return (
    <form
      action={action}
      onSubmit={() => {
        dirty.current = false;
        setSaving(true);
      }}
      className="space-y-5"
    >
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <input type="hidden" name="data" value={JSON.stringify(value)} />
      <Fields
        fields={fields}
        value={value}
        pictures={pictures}
        onChange={(next) => {
          dirty.current = true;
          setValue(next);
        }}
      />
      <div className="sticky bottom-0 z-10 -mx-5 flex flex-wrap items-center gap-3 border-t border-border-subtle bg-surface/95 px-5 py-3 backdrop-blur">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex min-h-10 items-center rounded-full bg-action px-5 text-sm font-semibold text-on-action hover:bg-action-hover disabled:opacity-60"
        >
          {saving ? "Saving…" : submitLabel}
        </button>
        {footer}
      </div>
    </form>
  );
}

export function Fields({
  fields,
  value,
  onChange,
  pictures,
}: {
  fields: readonly Field[];
  value: Value;
  onChange: (v: Value) => void;
  pictures: PictureOption[];
}) {
  const set = (key: string, v: unknown) => onChange({ ...value, [key]: v });
  return (
    <>
      {fields.map((f) => (
        <div key={f.key} data-field-key={f.key} className="scroll-mt-4 rounded-lg">
          <FieldInput field={f} value={value[f.key]} onChange={(v) => set(f.key, v)} pictures={pictures} />
        </div>
      ))}
    </>
  );
}

function Label({ field, children }: { field: Field; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium text-foreground">
      {field.label}
      {"required" in field && field.required ? " *" : ""}
      {children}
      {field.hint ? <span className="mt-1 block text-xs font-normal text-foreground-muted">{field.hint}</span> : null}
    </label>
  );
}

function FieldInput({
  field,
  value,
  onChange,
  pictures,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
  pictures: PictureOption[];
}) {
  switch (field.kind) {
    case "text":
      return (
        <Label field={field}>
          <input
            value={typeof value === "string" ? value : ""}
            maxLength={field.max}
            onChange={(e) => onChange(e.target.value)}
            className={inputCls}
          />
        </Label>
      );
    case "textarea":
      return (
        <Label field={field}>
          <textarea
            value={typeof value === "string" ? value : ""}
            maxLength={field.max}
            rows={field.rows ?? 4}
            onChange={(e) => onChange(e.target.value)}
            className={inputCls}
          />
          {field.max ? (
            <span className="mt-0.5 block text-right text-[11px] text-foreground-muted">
              {typeof value === "string" ? value.length : 0}/{field.max}
            </span>
          ) : null}
        </Label>
      );
    case "paragraphs":
    case "lines": {
      const sep = field.kind === "paragraphs" ? "\n\n" : "\n";
      const arr = Array.isArray(value) ? (value as string[]) : [];
      return (
        <Label field={field}>
          <TextArray
            initial={arr.join(sep)}
            rows={field.kind === "paragraphs" ? Math.min(14, 3 + arr.length * 3) : Math.min(10, 2 + arr.length)}
            split={field.kind === "paragraphs" ? /\n\s*\n/ : /\n/}
            onChange={onChange}
          />
        </Label>
      );
    }
    case "select":
      return (
        <Label field={field}>
          <select
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            className={inputCls}
          >
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Label>
      );
    case "picture":
      return (
        <PictureInput
          field={field}
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
          pictures={pictures}
        />
      );
    case "list":
      return (
        <ListInput
          field={field}
          value={Array.isArray(value) ? (value as Value[]) : []}
          onChange={onChange}
          pictures={pictures}
        />
      );
  }
}

/** A textarea holding several strings; it keeps its own text so typing a blank line is not lost. */
function TextArray({
  initial,
  rows,
  split,
  onChange,
}: {
  initial: string;
  rows: number;
  split: RegExp;
  onChange: (v: unknown) => void;
}) {
  const [text, setText] = useState(initial);
  return (
    <textarea
      value={text}
      rows={rows}
      onChange={(e) => {
        setText(e.target.value);
        onChange(
          e.target.value
            .split(split)
            .map((s) => s.trim())
            .filter(Boolean),
        );
      }}
      className={inputCls}
    />
  );
}

function PictureInput({
  field,
  value,
  onChange,
  pictures,
}: {
  field: Field;
  value: string;
  onChange: (v: unknown) => void;
  pictures: PictureOption[];
}) {
  const known = pictures.find((p) => p.value === value);
  const src = known?.src ?? (value.startsWith("https://") || value.startsWith("/") ? value : "");
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
      <Label field={field}>
        <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
          <option value="">— none / keep the page&apos;s own —</option>
          {value && !known ? <option value={value}>Current: {value.split("/").pop()}</option> : null}
          {PICTURE_GROUPS.map(([group, label]) => {
            const list = pictures.filter((p) => pictureGroup(p) === group);
            return list.length ? (
              <optgroup key={group} label={label}>
                {list.map((p) => (
                  <option key={`${group}:${p.value}`} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </optgroup>
            ) : null;
          })}
        </select>
      </Label>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin preview of an arbitrary image
        <img
          src={src}
          alt=""
          className="h-20 w-28 rounded-md border border-border-subtle bg-surface-subtle object-contain"
        />
      ) : null}
    </div>
  );
}

function ListInput({
  field,
  value,
  onChange,
  pictures,
}: {
  field: Extract<Field, { kind: "list" }>;
  value: Value[];
  onChange: (v: unknown) => void;
  pictures: PictureOption[];
}) {
  const move = (from: number, to: number) => {
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };
  // Drag to reorder: only the grip starts a drag, so selecting text in a field never does.
  const [grip, setGrip] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  return (
    <fieldset className="min-w-0 rounded-xl border border-border-subtle p-4">
      <legend className="px-1 text-sm font-semibold text-foreground">
        {field.label} <span className="font-normal text-foreground-muted">({value.length})</span>
      </legend>
      {field.hint ? <p className="mb-3 text-xs text-foreground-muted">{field.hint}</p> : null}
      <ol className="space-y-3">
        {value.map((item, i) => {
          const title = String(item[field.titleKey] ?? "").slice(0, 90);
          return (
            <li
              key={i}
              draggable={grip === i}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", String(i));
              }}
              onDragEnd={() => (setGrip(null), setOver(null))}
              onDragOver={(e) => {
                if (grip === null) return;
                e.preventDefault();
                setOver(i);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (grip !== null && grip !== i) move(grip, i);
                setGrip(null);
                setOver(null);
              }}
              className={over === i && grip !== null && grip !== i ? "rounded-lg ring-2 ring-action" : undefined}
            >
              <details className="rounded-lg border border-border-subtle bg-canvas" open={!title}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden
                      title="Drag to move"
                      onMouseDown={() => setGrip(i)}
                      onMouseUp={() => setGrip(null)}
                      className="cursor-grab select-none px-1 text-base leading-none text-foreground-muted hover:text-action active:cursor-grabbing"
                    >
                      ⠿
                    </span>
                    <span className="min-w-0 truncate font-medium text-foreground">
                      {i + 1}. {title || `New ${field.itemLabel}`}
                    </span>
                  </span>
                  <span className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      className={smallBtn}
                      disabled={i === 0}
                      onClick={(e) => (e.preventDefault(), move(i, i - 1))}
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className={smallBtn}
                      disabled={i === value.length - 1}
                      onClick={(e) => (e.preventDefault(), move(i, i + 1))}
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className={smallBtn}
                      onClick={(e) => {
                        e.preventDefault();
                        if (confirm(`Remove this ${field.itemLabel}?`)) onChange(value.filter((_, j) => j !== i));
                      }}
                    >
                      Remove
                    </button>
                  </span>
                </summary>
                <div className="space-y-4 border-t border-border-subtle p-3">
                  <Fields
                    fields={field.fields}
                    value={item}
                    pictures={pictures}
                    onChange={(next) => onChange(value.map((v, j) => (j === i ? next : v)))}
                  />
                </div>
              </details>
            </li>
          );
        })}
      </ol>
      {!field.max || value.length < field.max ? (
        <button
          type="button"
          className={`${smallBtn} mt-3`}
          onClick={() => onChange([...value, field.itemLabel === "block" ? { type: "paragraph", text: "" } : {}])}
        >
          + Add {field.itemLabel}
        </button>
      ) : null}
    </fieldset>
  );
}
