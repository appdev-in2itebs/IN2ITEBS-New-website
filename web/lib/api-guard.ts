import { allowedOrigins } from "./lead-service";

/**
 * Shared checks for the public JSON endpoints the chat widget and the apply form call: same-site
 * origin, a body size cap and a per-address rate limit. The limiter lives in Worker memory like the
 * contact form's, so it is a speed bump rather than a hard ceiling (blueprint section 10).
 */
export const json = (status: number, body: object, extra: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extra } });

export function badOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const sameSite = request.headers.get("sec-fetch-site") === "same-origin";
  return Boolean(origin && !sameSite && !allowedOrigins(request).has(origin));
}

export function clientAddress(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ??
    (process.env.TRUST_PROXY_HEADERS === "1" ? request.headers.get("x-forwarded-for")?.split(",")[0].trim() : null) ??
    null
  );
}

const buckets = new Map<string, { start: number; count: number }>();

/** True when `key` has made more than `max` calls in the last `windowMs`. */
export function rateLimited(key: string, max: number, windowMs = 60_000) {
  const now = Date.now();
  if (buckets.size > 5000) for (const [k, v] of buckets) if (now - v.start >= windowMs) buckets.delete(k);
  const bucket = buckets.get(key);
  if (!bucket || now - bucket.start >= windowMs) {
    buckets.set(key, { start: now, count: 1 });
    return false;
  }
  bucket.count++;
  return bucket.count > max;
}

export async function readJson(request: Request, maxBytes: number): Promise<unknown | Response> {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return json(415, { ok: false, error: "Use JSON." });
  const text = await request.text();
  if (text.length > maxBytes) return json(413, { ok: false, error: "Request is too large." });
  try {
    return JSON.parse(text);
  } catch {
    return json(400, { ok: false, error: "Invalid request." });
  }
}
