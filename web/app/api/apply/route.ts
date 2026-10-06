import { randomUUID } from "node:crypto";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";
import { getOpening, hashIp } from "@/lib/cms/store";
import { applySchema, CV_MAX_BYTES, cvType } from "@/lib/cms/schemas";
import { badOrigin, clientAddress, json, rateLimited } from "@/lib/api-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * A job application from a job post (/careers/current-openings/<opening>/#apply): the CV goes to the private `resumes` bucket and
 * the details to job_applications, where HR sees them in /admin/applications.
 */
export async function POST(request: Request) {
  if (badOrigin(request)) return json(403, { ok: false, error: "Invalid origin." });
  const ip = clientAddress(request);
  if (rateLimited(`apply:${hashIp(ip) ?? "anon"}`, 5))
    return json(429, { ok: false, error: "Too many attempts. Please wait a minute." });
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data"))
    return json(415, { ok: false, error: "Use the form." });
  if (Number(request.headers.get("content-length") ?? 0) > CV_MAX_BYTES + 64_000)
    return json(413, { ok: false, error: "The CV must be 5 MB or smaller." });
  if (!supabaseConfigured())
    return json(503, { ok: false, error: "Online applications are not available yet. Please email hr@in2itebs.com." });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, { ok: false, error: "Invalid form." });
  }
  const fields = Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === "string"));
  const parsed = applySchema.safeParse(fields);
  if (!parsed.success)
    return json(400, { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form." });
  if (parsed.data.website) return json(400, { ok: false, error: "Unable to accept this application." });

  const opening = await getOpening(parsed.data.openingId);
  if (!opening) return json(404, { ok: false, error: "This role is no longer open." });

  const file = form.get("cv");
  if (!(file instanceof File) || file.size === 0) return json(400, { ok: false, error: "Please attach your CV." });
  if (file.size > CV_MAX_BYTES) return json(413, { ok: false, error: "The CV must be 5 MB or smaller." });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = cvType(bytes);
  if (!type) return json(400, { ok: false, error: "The CV must be a PDF or Word document." });

  const db = supabaseAdmin();
  const path = `${new Date().getUTCFullYear()}/${randomUUID()}.${type.ext}`;
  const upload = await db.storage.from("resumes").upload(path, bytes, { contentType: type.mime, upsert: false });
  if (upload.error) {
    console.error(JSON.stringify({ event: "cv_upload_failed" }));
    return json(503, { ok: false, error: "We could not upload your CV. Please try again or email hr@in2itebs.com." });
  }
  const d = parsed.data;
  const { error } = await db.from("job_applications").insert({
    opening_id: opening.id,
    role_applied: opening.title,
    name: d.name,
    email: d.email,
    phone: d.phone,
    location: d.location || null,
    current_position: d.currentRole || null,
    notice_period: d.noticePeriod || null,
    expected_ctc: d.expectedCtc || null,
    linkedin_url: d.linkedinUrl || null,
    cover_note: d.coverNote || null,
    resume_path: path,
    consent_at: new Date().toISOString(),
    source: "website",
  });
  if (error) {
    await db.storage.from("resumes").remove([path]);
    console.error(JSON.stringify({ event: "application_save_failed" }));
    return json(503, {
      ok: false,
      error: "We could not save your application. Please try again or email hr@in2itebs.com.",
    });
  }
  console.info(JSON.stringify({ event: "application_saved" }));
  return json(200, { ok: true });
}
