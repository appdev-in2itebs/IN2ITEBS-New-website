import { supabaseAdmin } from "@/lib/supabase";
import { getAdmin } from "@/lib/admin/session";
import { can, LEAD_STATUSES } from "@/lib/admin/permissions";
import { csvCell, searchTerm } from "@/lib/admin/query";

export const dynamic = "force-dynamic";

/** The leads list as a CSV for Excel, with the same filters as the screen (up to 5,000 rows). */
export async function GET(request: Request) {
  const admin = await getAdmin();
  if (!admin || !can(admin.role, "leads")) return new Response("Not allowed", { status: 403 });
  const url = new URL(request.url);
  const q = searchTerm(url.searchParams.get("q") ?? "");
  const status = url.searchParams.get("status");
  const source = url.searchParams.get("source");
  let query = supabaseAdmin()
    .from("leads")
    .select(
      "created_at, name, email, phone, company, region, interest, offer, message, source, status, assigned_to, notes",
    )
    .order("created_at", { ascending: false })
    .limit(5000);
  if (status && LEAD_STATUSES.includes(status as never)) query = query.eq("status", status);
  if (source && ["website", "chatbot", "voice"].includes(source)) query = query.eq("source", source);
  if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,company.ilike.%${q}%`);
  const { data, error } = await query;
  if (error) return new Response("Could not export", { status: 500 });
  const cols = [
    "created_at",
    "name",
    "email",
    "phone",
    "company",
    "region",
    "interest",
    "offer",
    "message",
    "source",
    "status",
    "assigned_to",
    "notes",
  ] as const;
  const lines = [cols.join(","), ...(data ?? []).map((row) => cols.map((c) => csvCell(row[c])).join(","))];
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="in2it-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
