import { randomUUID } from "node:crypto";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";
import { hashIp } from "@/lib/cms/store";
import { CV_MAX_BYTES, cvType } from "@/lib/cms/schemas";
import { badOrigin, clientAddress, json, rateLimited } from "@/lib/api-guard";
import { addNote } from "@/lib/assistant/conversation";
import type { AgentState } from "@/lib/assistant/knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * A CV uploaded in the chat, for the application the assistant is preparing: checked by its bytes
 * (PDF or Word, up to 5 MB), stored in the private `resumes` bucket, and remembered on the
 * conversation so submit_job_application attaches it. The assistant reads a note that it arrived.
 */
export async function POST(request: Request) {
  if (badOrigin(request)) return json(403, { ok: false, error: "Invalid origin." });
  const ip = clientAddress(request);
  if (rateLimited(`chatcv:${hashIp(ip) ?? "anon"}`, 5))
    return json(429, { ok: false, error: "Too many uploads. Please wait a minute." });
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data"))
    return json(415, { ok: false, error: "Use the upload button." });
  if (Number(request.headers.get("content-length") ?? 0) > CV_MAX_BYTES + 64_000)
    return json(413, { ok: false, error: "The CV must be 5 MB or smaller." });
  if (!supabaseConfigured()) return json(503, { ok: false, error: "Uploads are not available right now." });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, { ok: false, error: "Invalid upload." });
  }
  const conversationId = String(form.get("conversationId") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(conversationId)) return json(400, { ok: false, error: "Start a chat first." });
  const db = supabaseAdmin();
  const { data: convo } = await db
    .from("chat_conversations")
    .select("id, state")
    .eq("id", conversationId)
    .maybeSingle();
  if (!convo) return json(404, { ok: false, error: "This chat has expired. Please start again." });

  const file = form.get("cv");
  if (!(file instanceof File) || file.size === 0) return json(400, { ok: false, error: "Please choose your CV." });
  if (file.size > CV_MAX_BYTES) return json(413, { ok: false, error: "The CV must be 5 MB or smaller." });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = cvType(bytes);
  if (!type) return json(400, { ok: false, error: "The CV must be a PDF or Word document." });

  const path = `chat/${new Date().getUTCFullYear()}/${randomUUID()}.${type.ext}`;
  const upload = await db.storage.from("resumes").upload(path, bytes, { contentType: type.mime, upsert: false });
  if (upload.error) return json(503, { ok: false, error: "The upload failed. Please try again." });

  const name = file.name.replace(/[^\w.\- ()]/g, "").slice(0, 120) || `cv.${type.ext}`;
  const state = { ...((convo.state ?? {}) as AgentState), cvPath: path, cvName: name, purpose: "job" as const };
  const previous = ((convo.state ?? {}) as AgentState).cvPath;
  await db.from("chat_conversations").update({ state, purpose: "job" }).eq("id", conversationId);
  if (previous && previous !== path) await db.storage.from("resumes").remove([previous]);
  // An application already filed gets the CV too.
  if (state.applicationId)
    await db.from("job_applications").update({ resume_path: path }).eq("id", state.applicationId);
  await addNote(conversationId, `The visitor uploaded their CV: ${name} (${Math.round(file.size / 1024)} KB).`);
  return json(200, { ok: true, name });
}
