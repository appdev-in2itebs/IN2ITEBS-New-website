import { supabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export function GET() {
  return Response.json(
    {
      app: "in2it-ebs-website",
      release: "2026-09-08-phase-2",
      status: "ok",
      siteEnv: process.env.SITE_ENV ?? "unset",
      // An enquiry is delivered when it can be saved to Supabase (Admin → Leads) or sent to the
      // webhook; lib/lead-service.ts accepts it when either is configured. The enquiry form reads this.
      leadDeliveryConfigured:
        supabaseConfigured() || Boolean(process.env.LEAD_WEBHOOK_URL && process.env.LEAD_WEBHOOK_TOKEN),
      leadWebhookConfigured: Boolean(process.env.LEAD_WEBHOOK_URL && process.env.LEAD_WEBHOOK_TOKEN),
      supabaseConfigured: supabaseConfigured(),
      adminSignInConfigured: supabaseConfigured() && Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
