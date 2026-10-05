import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/session";
import { isUuid } from "@/lib/admin/query";
import { Card, Field, Notice, PageTitle, input, primaryBtn } from "@/components/admin/ui";
import { saveOpening } from "../actions";

/** Create (/admin/openings/new/) or edit one opening. */
export default async function OpeningForm({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin("openings");
  const { id } = await params;
  const { error } = await searchParams;
  const isNew = id === "new";
  if (!isNew && !isUuid(id)) notFound();
  const { data: o } = isNew
    ? { data: null }
    : await supabaseAdmin().from("job_openings").select("*").eq("id", id).maybeSingle();
  if (!isNew && !o) notFound();

  return (
    <>
      <Link href="/admin/openings/" className="mb-3 inline-block text-sm text-action hover:underline">
        ← All openings
      </Link>
      <PageTitle title={isNew ? "Add an opening" : `Edit: ${o!.title}`} />
      {error ? <Notice tone="warn">{error}</Notice> : null}
      <Card className="max-w-3xl">
        <form action={saveOpening} className="space-y-4">
          <input type="hidden" name="id" value={isNew ? "" : o!.id} />
          <Field label="Job title *">
            <input
              name="title"
              required
              minLength={3}
              maxLength={160}
              defaultValue={o?.title ?? ""}
              className={input}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Employment type *">
              <input
                name="employment_type"
                required
                list="employment-types"
                defaultValue={o?.employment_type ?? "Full Time"}
                className={input}
              />
              <datalist id="employment-types">
                <option value="Full Time" />
                <option value="Part Time" />
                <option value="Contract" />
                <option value="Internship" />
                <option value="Walk-in" />
              </datalist>
            </Field>
            <Field label="Department">
              <input name="department" maxLength={120} defaultValue={o?.department ?? ""} className={input} />
            </Field>
            <Field label="Status">
              <select name="status" defaultValue={o?.status ?? "open"} className={input}>
                <option value="open">Open (shown on the site)</option>
                <option value="closed">Closed (hidden)</option>
              </select>
            </Field>
          </div>
          <Field label="Location(s) *" hint="For example: Bangalore, Bhubaneshwar">
            <input
              name="location"
              required
              minLength={2}
              maxLength={200}
              defaultValue={o?.location ?? ""}
              className={input}
            />
          </Field>
          <Field label="About the role" hint="Shown on the apply page. Line breaks are kept.">
            <textarea
              name="description"
              rows={7}
              maxLength={8000}
              defaultValue={o?.description ?? ""}
              className={input}
            />
          </Field>
          <Field label="What we are looking for" hint="Skills, experience and qualifications.">
            <textarea
              name="requirements"
              rows={7}
              maxLength={8000}
              defaultValue={o?.requirements ?? ""}
              className={input}
            />
          </Field>
          <Field label="Order" hint="Lower numbers are listed first.">
            <input
              name="sort_order"
              type="number"
              min={0}
              max={10000}
              defaultValue={o?.sort_order ?? 100}
              className={`${input} max-w-32`}
            />
          </Field>
          <button type="submit" className={primaryBtn}>
            {isNew ? "Add opening" : "Save changes"}
          </button>
        </form>
      </Card>
    </>
  );
}
