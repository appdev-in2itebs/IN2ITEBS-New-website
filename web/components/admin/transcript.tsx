import { supabaseAdmin } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { when } from "./ui";

/** A chat conversation as the visitor saw it, oldest message first. */
export async function Transcript({ conversationId }: { conversationId: string }) {
  const { data } = await supabaseAdmin()
    .from("chat_messages")
    .select("id, created_at, role, content, model")
    .eq("conversation_id", conversationId)
    .order("created_at")
    .limit(400);
  if (!data?.length) return <p className="text-sm text-foreground-muted">No messages stored.</p>;
  return (
    <ol className="space-y-3">
      {data.map((m) => (
        <li key={m.id} className={cn("flex flex-col", m.role === "user" ? "items-end" : "items-start")}>
          <p
            className={cn(
              "max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2 text-sm",
              m.role === "user" ? "bg-action text-on-action" : "bg-surface-subtle text-foreground",
            )}
          >
            {m.content}
          </p>
          <span className="mt-1 text-[11px] text-foreground-muted">
            {m.role === "user" ? "Visitor" : "Assistant"} · {when(m.created_at)}
            {m.model?.startsWith("rules:") ? ` · ${m.model.slice(6)}` : ""}
          </span>
        </li>
      ))}
    </ol>
  );
}
