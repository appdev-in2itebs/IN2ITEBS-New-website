import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/session";
import { isUuid } from "@/lib/admin/query";
import { Card, Field, Notice, PageTitle, input, primaryBtn } from "@/components/admin/ui";
import { deleteFaq, saveFaq } from "../actions";

export default async function FaqForm({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin("faqs");
  const { id } = await params;
  const { error } = await searchParams;
  const isNew = id === "new";
  if (!isNew && !isUuid(id)) notFound();
  const { data: f } = isNew
    ? { data: null }
    : await supabaseAdmin().from("chatbot_faqs").select("*").eq("id", id).maybeSingle();
  if (!isNew && !f) notFound();

  return (
    <>
      <Link href="/admin/faqs/" className="mb-3 inline-block text-sm text-action hover:underline">
        ← All answers
      </Link>
      <PageTitle title={isNew ? "Add an answer" : "Edit answer"} />
      {error ? <Notice tone="warn">{error}</Notice> : null}
      <Card className="max-w-3xl">
        <form action={saveFaq} className="space-y-4">
          <input type="hidden" name="id" value={isNew ? "" : f!.id} />
          <Field label="Question *" hint="As a visitor would ask it.">
            <input
              name="question"
              required
              minLength={5}
              maxLength={300}
              defaultValue={f?.question ?? ""}
              className={input}
            />
          </Field>
          <Field label="Answer *" hint="Plain, short and factual. Two or three sentences work best.">
            <textarea
              name="answer"
              required
              minLength={5}
              maxLength={2000}
              rows={5}
              defaultValue={f?.answer ?? ""}
              className={input}
            />
          </Field>
          <Field
            label="Keywords"
            hint="Comma-separated words or short phrases a visitor might use, e.g. sap, s/4hana, migration, rise. These matter most for matching."
          >
            <input name="keywords" maxLength={500} defaultValue={f?.keywords?.join(", ") ?? ""} className={input} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Link to a page" hint="Optional: /services/sap-sac/ or https://…">
              <input name="link_url" maxLength={300} defaultValue={f?.link_url ?? ""} className={input} />
            </Field>
            <Field label="Link label">
              <input name="link_label" maxLength={60} defaultValue={f?.link_label ?? ""} className={input} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Category">
              <input
                name="category"
                list="faq-categories"
                maxLength={60}
                defaultValue={f?.category ?? "General"}
                className={input}
              />
              <datalist id="faq-categories">
                <option value="Company" />
                <option value="Services" />
                <option value="Careers" />
                <option value="Contact" />
                <option value="General" />
              </datalist>
            </Field>
            <Field label="Order">
              <input
                name="sort_order"
                type="number"
                min={0}
                max={10000}
                defaultValue={f?.sort_order ?? 100}
                className={input}
              />
            </Field>
            <Field label="Status">
              <select name="active" defaultValue={f?.active === false ? "no" : "yes"} className={input}>
                <option value="yes">Active</option>
                <option value="no">Switched off</option>
              </select>
            </Field>
          </div>
          <button type="submit" className={primaryBtn}>
            {isNew ? "Add answer" : "Save changes"}
          </button>
        </form>
        {!isNew ? (
          <form action={deleteFaq} className="mt-6 border-t border-border-subtle pt-4">
            <input type="hidden" name="id" value={f!.id} />
            <button
              type="submit"
              className="text-sm font-semibold text-foreground-muted hover:text-foreground hover:underline"
            >
              Delete this answer
            </button>
          </form>
        ) : null}
      </Card>
    </>
  );
}
