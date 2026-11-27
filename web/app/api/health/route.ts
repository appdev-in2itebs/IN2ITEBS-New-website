import { supabaseConfigured } from "@/lib/supabase";
import { clientAddressResolvable } from "@/lib/api-guard";
import { INDEXING_ENABLED } from "@/lib/utils";

export const dynamic = "force-dynamic";
export function GET(request: Request) {
  return Response.json(
    {
      app: "in2it-ebs-website",
      release: "2026-09-08-phase-2",
      status: "ok",
      siteEnv: process.env.SITE_ENV ?? "unset",
      // False means no visitor address is resolved, so every per-address rate limit collapses
      // into one bucket shared by the whole internet. Behind a reverse proxy — which Azure is —
      // this must be true. See lib/api-guard.ts.
      perVisitorLimitsActive: clientAddressResolvable(request),
      indexingEnabled: INDEXING_ENABLED,
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
