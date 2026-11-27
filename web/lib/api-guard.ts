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

/**
 * Has anybody noticed we cannot see the visitor's address? Logged once per process.
 *
 * ── WHY THIS WARNING EXISTS ──────────────────────────────────────────────────────────────────
 * `clientAddress` returns null unless Cloudflare set `cf-connecting-ip` or the operator set
 * TRUST_PROXY_HEADERS=1. Null is the safe default: trusting `x-forwarded-for` with no trusted
 * ingress in front lets anybody spoof an address and defeat the limit entirely.
 *
 * But null is not harmless, and it fails in a direction nobody expects. Every caller keys its
 * bucket as `` `apply:${hashIp(ip) ?? "anon"}` `` — so with no address, **every visitor on the
 * internet shares the single bucket "anon"**. The limit stops being five attempts per visitor and
 * becomes five attempts per minute across the whole site.
 *
 * Measured on 19 November 2026 against a production build, seven requests from seven different
 * `x-forwarded-for` addresses:
 *
 *   TRUST_PROXY_HEADERS unset — the SIXTH VISITOR is refused with 429, having made one request.
 *   TRUST_PROXY_HEADERS=1     — all seven pass; one address making seven attempts is refused on
 *                               its own sixth. Which is the intended behaviour.
 *
 * That matters now because the deployment target is Azure behind a reverse proxy rather than
 * Cloudflare, so `cf-connecting-ip` will never arrive and the variable is the only way the app
 * can see a visitor. A misconfiguration that quietly turns a per-visitor limit into a site-wide
 * one, on the careers application form, is the kind of thing that is noticed as "the site is
 * broken" weeks later. So it says so.
 */
let warnedAboutProxyHeaders = false;

export function clientAddress(request: Request) {
  const cloudflare = request.headers.get("cf-connecting-ip");
  if (cloudflare) return cloudflare;
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0].trim();
  if (process.env.TRUST_PROXY_HEADERS === "1") return forwarded ?? null;
  if (forwarded && !warnedAboutProxyHeaders) {
    warnedAboutProxyHeaders = true;
    console.warn(
      "api-guard: requests carry x-forwarded-for but TRUST_PROXY_HEADERS is not 1, so no visitor " +
        "address is resolved and every visitor shares one rate-limit bucket. Set TRUST_PROXY_HEADERS=1 " +
        "if a trusted proxy sits in front of this app and overwrites the header.",
    );
  }
  return null;
}

/** True when the app can see a visitor's address, so per-visitor limits actually apply. */
export function clientAddressResolvable(request?: Request) {
  if (process.env.TRUST_PROXY_HEADERS === "1") return true;
  return Boolean(request?.headers.get("cf-connecting-ip"));
}

/**
 * ── READ THIS BEFORE TRUSTING THE LIMIT BELOW ────────────────────────────────────────────────
 * These buckets live in module scope, which on Cloudflare Workers means **per isolate, not per
 * site**. Cloudflare runs many isolates per location and recycles them freely, so traffic spread
 * across them gets roughly `max × (live isolates)` through before anything trips, and a burst
 * landing on a cold isolate starts from zero. Locally, and on a single Node process, it behaves
 * exactly as it reads — which is what makes it convincing and wrong.
 *
 * It is kept because it is not load-bearing. What actually protects the public endpoints is the
 * 16 KB body cap in `readJson` and the origin check above, both of which hold per request in
 * every isolate. This limiter stops an accidental retry loop and a lazy script, and that is the
 * whole of what it is claimed to do.
 *
 * **Do not cite it as rate limiting in a security questionnaire or a tender response.** Making
 * that claim true means moving the state somewhere shared — a Durable Object keyed on the
 * client, or KV with a short TTL. Until that exists, this comment is the honest version of the
 * control, which is the standard the rest of this codebase holds its claims to.
 */
const buckets = new Map<string, { start: number; count: number }>();

/** True when `key` has exceeded `max` calls in `windowMs` — per isolate, not per site. See above. */
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
