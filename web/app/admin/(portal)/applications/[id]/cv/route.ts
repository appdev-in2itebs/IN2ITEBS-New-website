import { supabaseAdmin } from "@/lib/supabase";
import { audit, getAdmin } from "@/lib/admin/session";
import { can } from "@/lib/admin/permissions";
import { isUuid } from "@/lib/admin/query";

export const dynamic = "force-dynamic";

/** Sends HR to a 10-minute signed link for the CV. The bucket is private; nothing else can read it. */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdmin();
  if (!admin || !can(admin.role, "applications")) return new Response("Not allowed", { status: 403 });
  const { id } = await params;
  if (!isUuid(id)) return new Response("Not found", { status: 404 });
  const db = supabaseAdmin();
  const { data: app } = await db.from("job_applications").select("resume_path, name").eq("id", id).maybeSingle();
  if (!app?.resume_path) return new Response("No CV on this application", { status: 404 });
  const ext = app.resume_path.split(".").pop();
  const { data, error } = await db.storage.from("resumes").createSignedUrl(app.resume_path, 600, {
    download: `${app.name.replace(/[^\w\s-]/g, "").trim() || "cv"} CV.${ext}`,
  });
  if (error || !data) return new Response("Could not open the CV", { status: 500 });
  await audit(admin, "download", "cv", id);
  return Response.redirect(data.signedUrl, 302);
}
