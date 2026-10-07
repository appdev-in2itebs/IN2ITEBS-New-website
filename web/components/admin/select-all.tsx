"use client";

/** A checkbox that ticks or unticks every checkbox of one form (by its id), e.g. every job opening. */
export function SelectAll({ form, name, label = "Select all" }: { form: string; name: string; label?: string }) {
  return (
    <input
      type="checkbox"
      aria-label={label}
      title={label}
      className="h-4 w-4"
      onChange={(e) => {
        for (const box of document.querySelectorAll<HTMLInputElement>(
          `input[type="checkbox"][name="${name}"][form="${form}"]`,
        ))
          box.checked = e.currentTarget.checked;
      }}
    />
  );
}
