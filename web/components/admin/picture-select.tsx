import heroImages from "@/content/hero-images.json";
import { PICTURE_GROUPS, pictureGroup, type PictureOption } from "@/lib/cms/picture-groups";
import { input } from "./ui";

/**
 * One picture choice for an editor: keep the page's own, or any picture from the groups of
 * lib/cms/picture-options.ts (used before, uploads, the website's own images, the hero library).
 */
export function PictureSelect({
  name,
  value,
  options,
  emptyLabel = "Keep the page's own picture",
}: {
  name: string;
  value?: string | null;
  options: PictureOption[];
  emptyLabel?: string;
}) {
  const known = options.some((o) => o.value === value);
  return (
    <select name={name} defaultValue={value ?? ""} className={input}>
      <option value="">{emptyLabel}</option>
      {value && !known ? <option value={value}>Current: {value.split("/").pop()}</option> : null}
      {PICTURE_GROUPS.map(([group, label]) => {
        const list = options.filter((o) => pictureGroup(o) === group);
        return list.length ? (
          <optgroup key={group} label={label}>
            {list.map((o) => (
              <option key={`${group}:${o.value}`} value={o.value}>
                {o.label}
              </option>
            ))}
          </optgroup>
        ) : null;
      })}
    </select>
  );
}

/** A small preview of a saved picture choice. */
export function PicturePreview({ value }: { value?: string | null }) {
  if (!value) return <p className="text-sm text-foreground-muted">The page keeps its own picture.</p>;
  const lib = heroImages[value as keyof typeof heroImages];
  const src = lib ? lib.src : value;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- admin preview of an arbitrary uploaded image
    <img
      src={src}
      alt={lib?.alt ?? ""}
      className="max-h-56 w-auto rounded-lg border border-border-subtle bg-surface-subtle object-contain"
    />
  );
}
