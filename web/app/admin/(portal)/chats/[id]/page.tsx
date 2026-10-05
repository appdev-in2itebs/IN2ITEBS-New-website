import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/session";
import { can } from "@/lib/admin/permissions";
import { isUuid } from "@/lib/admin/query";
import { Card, PageTitle, secondaryBtn, when } from "@/components/admin/ui";
import { Transcript } from "@/components/admin/transcript";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin("chats");
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const { data: c } = await supabaseAdmin().from("chat_conversations").select("*").eq("id", id).maybeSingle();
  if (!c) notFound();
  return (
    <>
      <Link href="/admin/chats/" className="mb-3 inline-block text-sm text-action hover:underline">
        ← All chats
      </Link>
      <PageTitle
        title={c.visitor_name ? `Chat with ${c.visitor_name}` : "Chat with a visitor"}
        intro={`Started ${when(c.started_at)}${c.page_url ? ` on ${c.page_url}` : ""} · ${c.message_count} messages`}
        actions={
          c.lead_id && can(admin.role, "leads") ? (
            <Link href={`/admin/leads/${c.lead_id}/`} className={secondaryBtn}>
              Open the lead
            </Link>
          ) : null
        }
      />
      <Card className="max-w-3xl">
        <Transcript conversationId={c.id} />
      </Card>
    </>
  );
}
