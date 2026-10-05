import { supabaseAdmin, supabaseProjectUrl } from "@/lib/supabase";
import heroImages from "@/content/hero-images.json";

/**
 * The media library: images uploaded in /admin/media to the public "media" bucket, plus helpers the
 * editors use to offer and validate a picture choice (a hero-library key or an uploaded image URL).
 */
export type MediaItem = {
  id: string;
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
  created_at: string;
};

export const MEDIA_MAX_BYTES = 5 * 1024 * 1024;

export function mediaBase() {
  return `${supabaseProjectUrl(process.env.SUPABASE_URL ?? "")}/storage/v1/object/public/media/`;
}

/** True for the URL of a file in this project's media bucket (and nothing else on the internet). */
export function isMediaUrl(value: string) {
  return value.startsWith(mediaBase()) && !value.includes("..");
}

/** A picture choice an editor may save: a hero-library key or an uploaded image. */
export function validPicture(value: string) {
  return value in heroImages || isMediaUrl(value);
}

export async function listMedia(limit = 200): Promise<MediaItem[]> {
  const { data } = await supabaseAdmin()
    .from("media")
    .select("id, url, alt, width, height, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

/** The real image type and size from the file's first bytes; null for anything else (SVG included). */
export function imageInfo(
  b: Uint8Array,
): { ext: "png" | "jpg" | "webp"; mime: string; width?: number; height?: number } | null {
  const u32 = (i: number) => ((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]) >>> 0;
  const u16be = (i: number) => (b[i] << 8) | b[i + 1];
  const u16le = (i: number) => b[i] | (b[i + 1] << 8);
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47)
    return { ext: "png", mime: "image/png", width: u32(16), height: u32(20) };
  if (b[0] === 0xff && b[1] === 0xd8) {
    // Walk the JPEG markers to the frame header (SOF0–SOF15, except DHT/JPG/DAC).
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) return { ext: "jpg", mime: "image/jpeg" };
      const marker = b[i + 1];
      const len = u16be(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
        return { ext: "jpg", mime: "image/jpeg", height: u16be(i + 5), width: u16be(i + 7) };
      i += 2 + len;
    }
    return { ext: "jpg", mime: "image/jpeg" };
  }
  if (
    b[0] === 0x52 &&
    b[1] === 0x49 &&
    b[2] === 0x46 &&
    b[3] === 0x46 &&
    b[8] === 0x57 &&
    b[9] === 0x45 &&
    b[10] === 0x42 &&
    b[11] === 0x50
  ) {
    const chunk = String.fromCharCode(b[12], b[13], b[14], b[15]);
    if (chunk === "VP8 ")
      return { ext: "webp", mime: "image/webp", width: u16le(26) & 0x3fff, height: u16le(28) & 0x3fff };
    if (chunk === "VP8L") {
      const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
      return { ext: "webp", mime: "image/webp", width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (chunk === "VP8X")
      return {
        ext: "webp",
        mime: "image/webp",
        width: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)),
        height: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)),
      };
    return { ext: "webp", mime: "image/webp" };
  }
  return null;
}
