import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase access. `SUPABASE_SECRET_KEY` bypasses row-level security, so it must never
 * reach the browser: nothing here is prefixed `NEXT_PUBLIC_`, and this module is imported only from
 * route handlers and server components. The publishable key is the one a browser may ever see.
 *
 * The client is created lazily. The site has to keep serving if Supabase is not configured yet —
 * during Phase 1 it is provisioned but unused — so callers check `supabaseConfigured()` first
 * rather than letting a missing variable throw at module load and take every route down with it.
 */
export function supabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);
}

/**
 * The project URL supabase-js wants is the bare origin (`https://<ref>.supabase.co`); it appends
 * `/rest/v1` itself. The dashboard's Data API page shows the REST endpoint with that suffix, and
 * that is what tends to get pasted into a secret — so the suffix and any trailing slash are dropped
 * here rather than producing `/rest/v1/rest/v1/...` requests that fail with a 404.
 */
export function supabaseProjectUrl(raw: string) {
  return raw
    .trim()
    .replace(/\/rest\/v1\/?$/, "")
    .replace(/\/+$/, "");
}

let cached: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase is not configured: set SUPABASE_URL and SUPABASE_SECRET_KEY.");
  cached = createClient(supabaseProjectUrl(url), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
