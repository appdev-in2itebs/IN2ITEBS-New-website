import { supabaseAdmin } from "@/lib/supabase";

/**
 * Permanent deletion of a client's or a candidate's data, for /admin. Each function removes the
 * records from the database and the files from storage (CVs in the private "resumes" bucket), so
 * nothing about the person is left behind in the live system. A chat that also belongs to another
 * record (a lead and an application from the same conversation) is kept for that record unless the
 * whole person is erased.
 *
 * On paid Supabase plans the daily database backups still hold a copy until they expire (the free
 * plan keeps none); nothing else holds personal data (the server logs carry no names or emails).
 */

export type Erased = { leads: number; applications: number; conversations: number; files: number };

const empty = (): Erased => ({ leads: 0, applications: 0, conversations: 0, files: 0 });

type Convo = { id: string; state: { cvPath?: string } | null; lead_id: string | null; application_id: string | null };

async function removeFiles(paths: (string | null | undefined)[]): Promise<number> {
  const list = [...new Set(paths.filter((p): p is string => !!p))];
  if (!list.length) return 0;
  const { data } = await supabaseAdmin().storage.from("resumes").remove(list);
  return data?.length ?? 0;
}

/** Deletes conversations (their messages go with them) and any CV uploaded in them. */
async function removeConversations(convos: Convo[], out: Erased) {
  if (!convos.length) return;
  out.files += await removeFiles(convos.map((c) => c.state?.cvPath));
  const { data } = await supabaseAdmin()
    .from("chat_conversations")
    .delete()
    .in(
      "id",
      convos.map((c) => c.id),
    )
    .select("id");
  out.conversations += data?.length ?? 0;
}

async function conversations(filter: { ids?: string[]; leadId?: string; applicationId?: string }): Promise<Convo[]> {
  const db = supabaseAdmin();
  const found = new Map<string, Convo>();
  const add = (rows: Convo[] | null) => rows?.forEach((r) => found.set(r.id, r));
  const cols = "id, state, lead_id, application_id";
  const ids = (filter.ids ?? []).filter(Boolean);
  if (ids.length) add((await db.from("chat_conversations").select(cols).in("id", ids)).data as Convo[]);
  if (filter.leadId)
    add((await db.from("chat_conversations").select(cols).eq("lead_id", filter.leadId)).data as Convo[]);
  if (filter.applicationId)
    add((await db.from("chat_conversations").select(cols).eq("application_id", filter.applicationId)).data as Convo[]);
  return [...found.values()];
}

/** One lead, with its chat (unless that chat also led to a job application that is kept). */
export async function eraseLead(id: string): Promise<Erased> {
  const out = empty();
  const db = supabaseAdmin();
  const { data: lead } = await db.from("leads").select("id, conversation_id").eq("id", id).maybeSingle();
  if (!lead) return out;
  const convos = (await conversations({ ids: [lead.conversation_id], leadId: id })).filter((c) => !c.application_id);
  const { data } = await db.from("leads").delete().eq("id", id).select("id");
  out.leads += data?.length ?? 0;
  await removeConversations(convos, out);
  return out;
}

/** One job application, its CV file and its chat (unless that chat also led to a kept lead). */
export async function eraseApplication(id: string): Promise<Erased> {
  const out = empty();
  const db = supabaseAdmin();
  const { data: app } = await db
    .from("job_applications")
    .select("id, resume_path, conversation_id")
    .eq("id", id)
    .maybeSingle();
  if (!app) return out;
  const convos = (await conversations({ ids: [app.conversation_id], applicationId: id })).filter((c) => !c.lead_id);
  out.files += await removeFiles([app.resume_path]);
  const { data } = await db.from("job_applications").delete().eq("id", id).select("id");
  out.applications += data?.length ?? 0;
  await removeConversations(convos, out);
  return out;
}

/** One chat conversation, its messages and any CV uploaded in it. Leads and applications stay. */
export async function eraseConversation(id: string): Promise<Erased> {
  const out = empty();
  await removeConversations(await conversations({ ids: [id] }), out);
  return out;
}

/**
 * Everything held about one email address: every lead and application with that email, their CVs,
 * and every chat linked to them or in which the visitor gave that email. For privacy requests.
 */
export async function eraseEmail(rawEmail: string): Promise<Erased> {
  const out = empty();
  const email = rawEmail.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return out;
  const db = supabaseAdmin();
  const [{ data: leads }, { data: apps }, { data: chats }] = await Promise.all([
    db.from("leads").select("id, conversation_id").ilike("email", email),
    db.from("job_applications").select("id, resume_path, conversation_id").ilike("email", email),
    db.from("chat_conversations").select("id").ilike("visitor_email", email),
  ]);
  const convos = await conversations({
    ids: [
      ...(leads ?? []).map((l) => l.conversation_id),
      ...(apps ?? []).map((a) => a.conversation_id),
      ...(chats ?? []).map((c) => c.id),
    ],
  });
  // Chats linked through a lead or application id rather than the conversation id.
  for (const l of leads ?? []) for (const c of await conversations({ leadId: l.id })) convos.push(c);
  for (const a of apps ?? []) for (const c of await conversations({ applicationId: a.id })) convos.push(c);
  const unique = [...new Map(convos.map((c) => [c.id, c])).values()];

  out.files += await removeFiles((apps ?? []).map((a) => a.resume_path));
  if (leads?.length) {
    const { data } = await db
      .from("leads")
      .delete()
      .in(
        "id",
        leads.map((l) => l.id),
      )
      .select("id");
    out.leads += data?.length ?? 0;
  }
  if (apps?.length) {
    const { data } = await db
      .from("job_applications")
      .delete()
      .in(
        "id",
        apps.map((a) => a.id),
      )
      .select("id");
    out.applications += data?.length ?? 0;
  }
  await removeConversations(unique, out);
  return out;
}

export const erasedText = (e: Erased) =>
  [
    e.leads && `${e.leads} lead${e.leads > 1 ? "s" : ""}`,
    e.applications && `${e.applications} application${e.applications > 1 ? "s" : ""}`,
    e.conversations && `${e.conversations} chat${e.conversations > 1 ? "s" : ""}`,
    e.files && `${e.files} file${e.files > 1 ? "s" : ""}`,
  ]
    .filter(Boolean)
    .join(", ") || "nothing (it was already gone)";
