"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { audit, requireAdmin } from "@/lib/admin/session";
import { isUuid } from "@/lib/admin/query";

const faqSchema = z.object({
  question: z.string().trim().min(5).max(300),
  answer: z.string().trim().min(5).max(2000),
  keywords: z.string().trim().max(500).optional().default(""),
  link_url: z
    .string()
    .trim()
    .max(300)
    .optional()
    .default("")
    .refine(
      (v) => !v || v.startsWith("/") || /^https:\/\//.test(v),
      "Links start with / (a page on this site) or https://",
    ),
  link_label: z.string().trim().max(60).optional().default(""),
  category: z.string().trim().min(2).max(60).default("General"),
  sort_order: z.coerce.number().int().min(0).max(10000).default(100),
  active: z.enum(["yes", "no"]).default("yes"),
});

export async function saveFaq(form: FormData) {
  const admin = await requireAdmin("faqs");
  const id = String(form.get("id") ?? "");
  const back = `/admin/faqs/${isUuid(id) ? id : "new"}/`;
  const parsed = faqSchema.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) redirect(`${back}?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  const d = parsed.data;
  const row = {
    question: d.question,
    answer: d.answer,
    keywords: [
      ...new Set(
        d.keywords
          .split(",")
          .map((k) => k.trim().toLowerCase())
          .filter(Boolean),
      ),
    ].slice(0, 30),
    link_url: d.link_url || null,
    link_label: d.link_label || null,
    category: d.category,
    sort_order: d.sort_order,
    active: d.active === "yes",
    updated_at: new Date().toISOString(),
  };
  const db = supabaseAdmin().from("chatbot_faqs");
  const { data, error } = isUuid(id)
    ? await db.update(row).eq("id", id).select("id").single()
    : await db.insert(row).select("id").single();
  if (error || !data) redirect(`${back}?error=${encodeURIComponent("Could not save.")}`);
  await audit(admin, isUuid(id) ? "update" : "create", "faq", data.id, { question: row.question });
  redirect("/admin/faqs/?saved=1");
}

export async function deleteFaq(form: FormData) {
  const admin = await requireAdmin("faqs");
  const id = String(form.get("id") ?? "");
  if (isUuid(id)) {
    await supabaseAdmin().from("chatbot_faqs").delete().eq("id", id);
    await audit(admin, "delete", "faq", id);
  }
  redirect("/admin/faqs/?saved=1");
}
