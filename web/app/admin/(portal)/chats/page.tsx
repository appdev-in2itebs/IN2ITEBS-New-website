import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/session";
import { PAGE_SIZE, listUrl, pageOf } from "@/lib/admin/query";
import { PageTitle, Pager, Table, secondaryBtn, td, when } from "@/components/admin/ui";

export default async function ChatsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; leads?: string }>;
}) {
  await requireAdmin("chats");
  const sp = await searchParams;
  const page = pageOf(sp.page);
  const onlyLeads = sp.leads === "1";
  let query = supabaseAdmin()
    .from("chat_conversations")
    .select("id, started_at, last_message_at, message_count, page_url, visitor_name, visitor_email, lead_id")
    .order("last_message_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  if (onlyLeads) query = query.not("lead_id", "is", null);
  const { data, error } = await query;
  const rows = (data ?? []).slice(0, PAGE_SIZE);

  return (
    <>
      <PageTitle
        title="Chat transcripts"
        intro="Conversations with the website assistant. Read them to see what visitors ask, then add or improve answers under Chatbot FAQs."
      />
      <form className="mb-5 flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="leads" value="1" defaultChecked={onlyLeads} className="h-4 w-4" />
          Only conversations that left contact details
        </label>
        <button type="submit" className={secondaryBtn}>
          Filter
        </button>
      </form>
      {error ? <p className="mb-4 text-sm">Could not load chats: {error.message}</p> : null}
      <Table head={["Last message", "Visitor", "Messages", "Started on page", "Lead"]} empty={!rows.length}>
        {rows.map((c) => (
          <tr key={c.id}>
            <td className={`${td} whitespace-nowrap`}>
              <Link href={`/admin/chats/${c.id}/`} className="font-semibold text-action hover:underline">
                {when(c.last_message_at)}
              </Link>
            </td>
            <td className={td}>
              {c.visitor_name ?? "Anonymous"}
              {c.visitor_email ? <span className="block text-xs text-foreground-muted">{c.visitor_email}</span> : null}
            </td>
            <td className={td}>{c.message_count}</td>
            <td className={`${td} max-w-56 truncate`}>{c.page_url ?? "—"}</td>
            <td className={td}>
              {c.lead_id ? (
                <Link href={`/admin/leads/${c.lead_id}/`} className="text-action hover:underline">
                  Open lead
                </Link>
              ) : (
                "—"
              )}
            </td>
          </tr>
        ))}
      </Table>
      <Pager
        page={page}
        hasMore={(data?.length ?? 0) > PAGE_SIZE}
        base={listUrl("/admin/chats/", { leads: onlyLeads ? "1" : undefined })}
      />
    </>
  );
}
