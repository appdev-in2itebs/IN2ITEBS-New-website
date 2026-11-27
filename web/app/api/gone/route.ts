export const dynamic = "force-dynamic";
const body = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Page removed · In2IT EBS</title></head><body style="font-family:system-ui;margin:3rem auto;max-width:36rem;padding:0 1rem"><h1>This page has been removed</h1><p>It never held In2IT EBS content. See <a href="/services/">what we do</a> or <a href="/contact/">contact us</a>.</p></body></html>`;
export function GET() {
  return new Response(body, {
    status: 410,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=86400" },
  });
}
