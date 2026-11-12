import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Keeps the admin's Supabase session fresh: on every /admin request the access token is checked and,
 * when it has expired, renewed with the refresh token and written back to the cookies. Public pages
 * never run this (see `matcher`), so they stay static.
 */
/**
 * Apex to www, in code.
 *
 * www.in2itebs.com is canonical. The apex should 301 to it at the edge, which is a DNS and
 * hosting change — but an edge rule that nobody has applied yet is the same as no rule, and until
 * it is applied the two hostnames are indexed as separate sites. This is the belt to that
 * braces: if the edge already redirects, this never runs; if it does not, the site still only
 * serves one hostname.
 *
 * 308 rather than 301 so the method and body survive, which matters for the enquiry POST.
 */
function apexToWww(request: NextRequest): NextResponse | null {
  if (process.env.SITE_ENV !== "production") return null;
  const host = request.headers.get("host")?.toLowerCase().split(":")[0];
  if (host !== "in2itebs.com") return null;
  const url = request.nextUrl.clone();
  url.host = "www.in2itebs.com";
  url.protocol = "https:";
  url.port = "";
  return NextResponse.redirect(url, 308);
}

export async function middleware(request: NextRequest) {
  const canonical = apexToWww(request);
  if (canonical) return canonical;

  let response = NextResponse.next({ request });
  // Only /admin needs a session refresh; everything else is public and stays static.
  if (!request.nextUrl.pathname.startsWith("/admin")) return response;

  const url = process.env.SUPABASE_URL?.trim()
    .replace(/\/rest\/v1\/?$/, "")
    .replace(/\/+$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response;
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
      },
    },
  });
  await supabase.auth.getUser();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

/**
 * The Supabase session refresh only needs /admin, but the apex redirect above has to see every
 * request, so the matcher covers the whole site and skips static assets. `middleware()` returns
 * early for anything that is not /admin, so public pages stay static.
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|woff2?)$).*)"],
};
