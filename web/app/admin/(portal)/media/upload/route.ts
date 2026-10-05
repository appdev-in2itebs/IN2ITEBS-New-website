import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { audit, getAdmin } from "@/lib/admin/session";
import { can } from "@/lib/admin/permissions";
import { MEDIA_MAX_BYTES, imageInfo } from "@/lib/cms/media";

export const dynamic = "force-dynamic";

/** Back to the media page, relative, so it stays on whatever host the admin is using. */
const back = (_: Request, query: string) =>
  new Response(null, { status: 303, headers: { Location: `/admin/media/?${query}` } });

/** The form must come from this site: the Origin header's host against the Host the browser used. */
function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return request.headers.get("sec-fetch-site") !== "cross-site";
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

/**
 * Upload from /admin/media: one or more PNG, JPEG or WebP images (checked by their bytes, up to 5 MB
 * each) into the public "media" bucket, each with a row in `media` carrying its size and alt text.
 * A route rather than a server action, so large files are not held to the server-action body limit.
 */
export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin || !can(admin.role, "media")) return new Response("Not allowed", { status: 403 });
  if (!sameOrigin(request)) return new Response("Bad origin", { status: 403 });
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return back(request, "error=" + encodeURIComponent("The upload could not be read."));
  }
  const alt = String(form.get("alt") ?? "")
    .trim()
    .slice(0, 200);
  const files = form
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, 20);
  if (!files.length) return back(request, "error=" + encodeURIComponent("Choose at least one image."));
  const db = supabaseAdmin();
  let done = 0;
  const problems: string[] = [];
  for (const file of files) {
    if (file.size > MEDIA_MAX_BYTES) {
      problems.push(`${file.name}: larger than 5 MB`);
      continue;
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    const info = imageInfo(bytes);
    if (!info) {
      problems.push(`${file.name}: not a PNG, JPEG or WebP image`);
      continue;
    }
    const path = `${new Date().getUTCFullYear()}/${randomUUID()}.${info.ext}`;
    const up = await db.storage
      .from("media")
      .upload(path, bytes, { contentType: info.mime, cacheControl: "31536000", upsert: false });
    if (up.error) {
      problems.push(`${file.name}: upload failed`);
      continue;
    }
    const url = db.storage.from("media").getPublicUrl(path).data.publicUrl;
    const name = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[-_]+/g, " ")
      .trim();
    const { error } = await db.from("media").insert({
      path,
      url,
      alt: alt || name.slice(0, 200),
      width: info.width ?? null,
      height: info.height ?? null,
      bytes: file.size,
      mime: info.mime,
      created_by: admin.email,
    });
    if (error) {
      await db.storage.from("media").remove([path]);
      problems.push(`${file.name}: could not be saved`);
      continue;
    }
    done++;
  }
  await audit(admin, "upload", "media", undefined, { count: done });
  const query = [done ? `saved=${done}` : "", problems.length ? `error=${encodeURIComponent(problems.join("; "))}` : ""]
    .filter(Boolean)
    .join("&");
  return back(request, query);
}
