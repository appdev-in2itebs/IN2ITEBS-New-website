"use server";

import { redirect } from "next/navigation";
import { audit, requireAdmin } from "@/lib/admin/session";
import { isUuid } from "@/lib/admin/query";
import { eraseConversation, erasedText } from "@/lib/admin/erase";

/** Deletes one chat, its messages and any CV uploaded in it. Leads and applications stay. */
export async function deleteChat(form: FormData) {
  const admin = await requireAdmin("chats");
  const id = String(form.get("id") ?? "");
  if (!isUuid(id)) redirect("/admin/chats/");
  const erased = await eraseConversation(id);
  await audit(admin, "delete", "chat", id, erased);
  redirect(`/admin/chats/?deleted=${encodeURIComponent(erasedText(erased))}`);
}
