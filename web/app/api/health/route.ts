import { supabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export function GET() {
  return Response.json(
    {
      app: "in2it-ebs-website",
      release: "2026-09-08-phase-2",
      status: "ok",
      siteEnv: process.env.SITE_ENV ?? "unset",
      leadDeliveryConfigured: Boolean(process.env.LEAD_WEBHOOK_URL && process.env.LEAD_WEBHOOK_TOKEN),
      supabaseConfigured: supabaseConfigured(),
      adminSignInConfigured: supabaseConfigured() && Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
