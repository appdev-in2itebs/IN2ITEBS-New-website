import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/session";
import { reply } from "@/lib/chatbot/engine";
import { siteIndex } from "@/lib/chatbot/site-index";
import { getCms } from "@/lib/cms/content";
import { getOpenOpenings, getSettings } from "@/lib/cms/store";
import { Badge, Card, Notice, PageTitle, Table, input, primaryBtn, secondaryBtn, td } from "@/components/admin/ui";

export default async function FaqsPage({ searchParams }: { searchParams: Promise<{ saved?: string; test?: string }> }) {
  await requireAdmin("faqs");
  const sp = await searchParams;
  const { data: faqs } = await supabaseAdmin()
    .from("chatbot_faqs")
    .select("id, question, answer, keywords, link_url, link_label, category, sort_order, active")
    .order("category")
    .order("sort_order");
  const test = (sp.test ?? "").trim().slice(0, 300);
  const answer = test
    ? reply(test, {
        faqs: (faqs ?? []).filter((f) => f.active),
        site: siteIndex(await getCms()),
        openings: (await getOpenOpenings()).map(({ id, title, location, employment_type }) => ({
          id,
          title,
          location,
          employment_type,
        })),
        quickReplies: (await getSettings()).chatbot.quickReplies,
      })
    : null;

  return (
    <>
      <PageTitle
        title="Chatbot FAQs"
        intro="The answers the website assistant gives. It matches a visitor's message against each question and its keywords; when nothing matches it points to the right page or offers to take their details."
        actions={
          <Link href="/admin/faqs/new/" className={primaryBtn}>
            Add an answer
          </Link>
        }
      />
      {sp.saved ? <Notice tone="ok">Saved. The assistant uses it from the next message.</Notice> : null}
      <Card className="mb-6">
        <form className="flex flex-wrap items-end gap-3">
          <label className="min-w-64 flex-1 text-sm font-medium">
            Try the assistant
            <input name="test" defaultValue={test} placeholder="e.g. do you do SAP migrations?" className={input} />
          </label>
          <button type="submit" className={secondaryBtn}>
            Ask
          </button>
        </form>
        {answer ? (
          <div className="mt-4 rounded-xl bg-surface-subtle p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Would answer ({answer.intent})
            </p>
            <p className="mt-1 whitespace-pre-line text-foreground">{answer.text}</p>
            {answer.links?.length ? (
              <p className="mt-2 text-action">{answer.links.map((l) => `${l.label} (${l.url})`).join(" · ")}</p>
            ) : null}
            {answer.action === "collect-lead" ? (
              <p className="mt-2 text-foreground-muted">
                Then asks for name, email, company, phone and the requirement.
              </p>
            ) : null}
          </div>
        ) : null}
      </Card>
      <Table head={["Question", "Category", "Keywords", "Link", "Status"]} empty={!faqs?.length}>
        {faqs?.map((f) => (
          <tr key={f.id}>
            <td className={td}>
              <Link href={`/admin/faqs/${f.id}/`} className="font-semibold text-action hover:underline">
                {f.question}
              </Link>
              <span className="mt-0.5 line-clamp-2 block text-xs text-foreground-muted">{f.answer}</span>
            </td>
            <td className={td}>{f.category}</td>
            <td className={`${td} max-w-56 text-xs text-foreground-muted`}>{f.keywords.join(", ")}</td>
            <td className={`${td} text-xs`}>{f.link_url ?? "—"}</td>
            <td className={td}>
              <Badge>{f.active ? "active" : "off"}</Badge>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
