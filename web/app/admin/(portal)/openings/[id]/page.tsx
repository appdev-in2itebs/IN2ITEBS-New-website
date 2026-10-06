import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/session";
import { isUuid } from "@/lib/admin/query";
import { Card, Field, Notice, PageTitle, input, primaryBtn, secondaryBtn } from "@/components/admin/ui";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { deleteOpening, saveOpening } from "../actions";

/**
 * Create (/admin/openings/new/) or edit one opening. The fields follow the job posts on the
 * in2itebs Keka careers page; the website shows them the same way on /careers/current-openings/.
 */
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
      <PageTitle
        title={isNew ? "Add an opening" : `Edit: ${o!.title}`}
        intro="Shown on the website under Career → Current Openings as a full job post with an Apply button. The AI assistant also screens candidates on these details."
        actions={
          !isNew && o!.status === "open" ? (
            <Link href={`/careers/current-openings/${o!.id}/`} target="_blank" className={secondaryBtn}>
              View on the website
            </Link>
          ) : null
        }
      />
      {error ? <Notice tone="warn">{error}</Notice> : null}
      <form action={saveOpening} className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <input type="hidden" name="id" value={isNew ? "" : o!.id} />
        <Card className="space-y-5">
          <Field label="Job title *" hint="For example: SAP ABAP Consultant (Onsite)">
            <input
              name="title"
              required
              minLength={3}
              maxLength={160}
              defaultValue={o?.title ?? ""}
              className={input}
            />
          </Field>
          <Field label="Job overview" hint="Two or three sentences at the top of the post: the role in a nutshell.">
            <textarea name="overview" rows={3} maxLength={1500} defaultValue={o?.overview ?? ""} className={input} />
          </Field>
          <Field label="Job description" hint="The role and the team. Blank lines start new paragraphs.">
            <textarea
              name="description"
              rows={6}
              maxLength={8000}
              defaultValue={o?.description ?? ""}
              className={input}
            />
          </Field>
          <Field label="Key responsibilities" hint="One per line; each line becomes a bullet point.">
            <textarea
              name="responsibilities"
              rows={7}
              maxLength={8000}
              defaultValue={o?.responsibilities ?? ""}
              className={input}
            />
          </Field>
          <Field label="Required qualifications" hint="One per line; each line becomes a bullet point.">
            <textarea
              name="requirements"
              rows={6}
              maxLength={8000}
              defaultValue={o?.requirements ?? ""}
              className={input}
            />
          </Field>
          <Field
            label="Key skills"
            hint="Separated by commas or one per line; shown as tags. Example: ABAP, OData, CDS Views"
          >
            <textarea name="skills" rows={3} maxLength={2000} defaultValue={o?.skills ?? ""} className={input} />
          </Field>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-4">
            <Field label="Location(s) *" hint="For example: Bangalore, Bhubaneswar">
              <input
                name="location"
                required
                minLength={2}
                maxLength={200}
                defaultValue={o?.location ?? ""}
                className={input}
              />
            </Field>
            <Field label="Experience" hint="For example: 3+ Years, or 2 to 5 Years">
              <input name="experience" maxLength={60} defaultValue={o?.experience ?? ""} className={input} />
            </Field>
            <Field label="Department" hint="Openings are grouped by department on the website.">
              <input
                name="department"
                maxLength={120}
                list="departments"
                defaultValue={o?.department ?? ""}
                className={input}
              />
              <datalist id="departments">
                <option value="SAP" />
                <option value="Finance & Accounts" />
                <option value="Technology" />
                <option value="Human Resources" />
                <option value="Sales & Marketing" />
                <option value="Delivery" />
              </datalist>
            </Field>
            <Field label="Job type *">
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
            <Field label="Status">
              <select name="status" defaultValue={o?.status ?? "open"} className={input}>
                <option value="open">Open (shown on the website)</option>
                <option value="closed">Closed (hidden)</option>
              </select>
            </Field>
            <Field label="Order" hint="Lower numbers come first within a department.">
              <input
                name="sort_order"
                type="number"
                min={0}
                max={10000}
                defaultValue={o?.sort_order ?? 100}
                className={`${input} max-w-32`}
              />
            </Field>
            {!isNew ? (
              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" name="repost" className="mt-0.5 h-4 w-4" />
                <span>
                  Post again today
                  <span className="block text-xs text-foreground-muted">
                    The website shows how long ago a job was posted; this resets it to today.
                  </span>
                </span>
              </label>
            ) : null}
          </Card>
          <button type="submit" className={`${primaryBtn} w-full`}>
            {isNew ? "Publish opening" : "Save changes"}
          </button>
        </div>
      </form>
      {!isNew ? (
        <form action={deleteOpening} className="mt-8">
          <input type="hidden" name="id" value={o!.id} />
          <ConfirmSubmit
            message={`Delete the opening "${o!.title}" for good? Applications already received are kept.`}
            className="text-sm font-semibold text-red-800 hover:underline"
          >
            Delete this opening
          </ConfirmSubmit>
        </form>
      ) : null}
    </>
  );
}
