import { z } from "zod";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";
import type { Faq, SiteEntry } from "@/lib/chatbot/engine";
import type { OpeningRow } from "@/lib/cms/store";
import type { ToolSpec } from "./llm";
import { searchSite, type AgentState } from "./knowledge";

/**
 * What the assistant can do, as tools the model calls.
 *
 * The visitor's answers are remembered on the conversation the moment they are given
 * (remember_details), so nothing depends on the model keeping them in mind. Saving an enquiry or
 * an application then builds the record from that memory, checks it (email, phone, required
 * answers, the role being open) and, when something is missing, tells the model what to ask.
 * Records are written with the server key; the model never sees a key or the database.
 */

export type ToolContext = {
  conversationId: string | null;
  language: string;
  state: AgentState;
  index: SiteEntry[];
  faqs: Faq[];
  openings: OpeningRow[];
  ipHash: string | null;
  userAgent: string | null;
};

/** What the chat window should show after this turn, besides the text. */
export type UiAction = { type: "cv_upload"; openingTitle?: string } | { type: "saved"; kind: "lead" | "application" };

const fn = (
  name: string,
  description: string,
  properties: Record<string, unknown>,
  required: string[] = [],
): ToolSpec => ({
  type: "function",
  function: { name, description, parameters: { type: "object", properties, required } },
});
const str = (description: string) => ({ type: "string", description });

export const TOOL_SPECS: ToolSpec[] = [
  fn(
    "search_website",
    "Search the In2IT EBS website (services, industries, partners, offices, FAQs). Returns page titles, paths and summaries.",
    {
      query: str("What to look for, in English, e.g. 'SAP S/4HANA migration'"),
    },
    ["query"],
  ),
  fn("list_job_openings", "List the open job roles with their opening_id.", {}),
  fn(
    "get_job_details",
    "Get the job description and requirements for one open role, and mark it as the role they are applying for.",
    {
      opening_id: str("opening_id from list_job_openings or the open roles list"),
    },
    ["opening_id"],
  ),
  fn("request_cv_upload", "Show the visitor a button to upload their CV (PDF or Word, up to 5 MB).", {}),
];

// ------------------------------------------------------------------ reading the remembered answers

/** The remembered answer whose checklist item matches, e.g. pick(profile, /e-?mail/). */
export function pick(profile: Record<string, string>, pattern: RegExp, not?: RegExp): string {
  for (const [k, v] of Object.entries(profile))
    if (pattern.test(k) && !(not && not.test(k)) && v?.trim()) return v.trim();
  return "";
}
const NAME = /\bname\b/i;
const NOT_NAME = /compan|organi[sz]ation|employer|business/i;
const EMAIL = /e-?mail/i;
const PHONE = /phone|mobile|contact number|whatsapp/i;

/** Which checklist items still have no answer. */
export function missing(checklist: string[], profile: Record<string, string>): string[] {
  return checklist.filter((q) => !profile[q]?.trim() && !/optional/i.test(q));
}

const emailOk = (v: string) => z.string().email().safeParse(v).success;
const phoneOk = (v: string) => /^[+()\d\s.-]{6,25}$/.test(v);

/** Runs one tool call. Returns the JSON the model reads, and any UI action for the chat window. */
export async function runTool(
  name: string,
  rawArgs: string,
  ctx: ToolContext,
): Promise<{ result: unknown; action?: UiAction }> {
  let args: Record<string, unknown> = {};
  try {
    args = rawArgs ? (JSON.parse(rawArgs) as Record<string, unknown>) : {};
  } catch {
    return { result: { error: "The tool arguments were not valid JSON." } };
  }
  const st = ctx.state;

  switch (name) {
    case "search_website":
      return { result: searchSite(ctx.index, ctx.faqs, String(args.query ?? "")) };

    case "list_job_openings":
      st.purpose ??= "job";
      return {
        result: ctx.openings.map((o) => ({
          opening_id: o.id,
          title: o.title,
          location: o.location,
          type: o.employment_type,
          department: o.department,
        })),
      };

    case "get_job_details": {
      const o = ctx.openings.find((x) => x.id === args.opening_id);
      if (!o) return { result: { error: "No open role with that opening_id. Call list_job_openings." } };
      st.purpose = "job";
      st.openingId = o.id;
      return {
        result: {
          opening_id: o.id,
          title: o.title,
          location: o.location,
          type: o.employment_type,
          experience: o.experience,
          overview: o.overview.slice(0, 1500),
          description: o.description.slice(0, 4000) || "(no description yet: screen on the skills the title implies)",
          responsibilities: o.responsibilities.slice(0, 3000),
          qualifications: o.requirements.slice(0, 3000),
          key_skills: o.skills.slice(0, 1500),
          page: `/careers/current-openings/${o.id}/`,
        },
      };
    }

    case "request_cv_upload": {
      st.purpose = "job";
      const title = ctx.openings.find((o) => o.id === st.openingId)?.title;
      return {
        result: {
          shown: true,
          note: "An upload button is shown. Wait for the note that the CV arrived, or continue if they cannot upload.",
        },
        action: { type: "cv_upload", openingTitle: title },
      };
    }
  }
  return { result: { error: `Unknown tool ${name}.` } };
}

export type Saved = { ok: true } | { ok: false; missing: string[]; error?: string };

/**
 * Sends the business enquiry to Leads, built from the remembered answers. Called by the server
 * once the required answers are in and the visitor confirmed; calling it again updates the lead.
 */
export async function saveLead(ctx: ToolContext, args: { summary?: string; interest?: string }): Promise<Saved> {
  const st = ctx.state;
  st.profile ??= {};
  const p = st.profile;
  const lead = {
    name: pick(p, NAME, NOT_NAME),
    email: pick(p, EMAIL),
    phone: pick(p, PHONE),
    company: pick(p, /compan|organi[sz]ation|business/i),
    // Their need, or failing that the note-taker's summary of it.
    requirement: pick(p, /need|requirement|help|looking for|service/i) || (st.summary ?? ""),
  };
  const gaps = [
    !lead.name && "their name",
    !emailOk(lead.email) && "a valid email address",
    lead.requirement.length < 3 && "what they need help with",
    lead.phone && !phoneOk(lead.phone) && "a valid phone number (or none)",
  ].filter(Boolean);
  if (gaps.length) return { ok: false, missing: gaps as string[] };
  if (!supabaseConfigured()) return { ok: false, missing: [], error: "unavailable" };
  const summary = String(args.summary ?? "")
    .trim()
    .slice(0, 1500);
  const interest =
    String(args.interest ?? "")
      .trim()
      .slice(0, 160) || lead.requirement.slice(0, 160);
  const row = {
    name: lead.name.slice(0, 120),
    email: lead.email.slice(0, 254),
    phone: lead.phone.slice(0, 40) || null,
    company: lead.company.slice(0, 160) || null,
    interest,
    message: lead.requirement.slice(0, 3000),
    details: p,
    ai_summary: summary || null,
    language: ctx.language,
    source: "chatbot",
    conversation_id: ctx.conversationId,
    ip_hash: ctx.ipHash,
    user_agent: ctx.userAgent,
    updated_at: new Date().toISOString(),
  };
  const db = supabaseAdmin();
  if (st.leadId) {
    const { error } = await db.from("leads").update(row).eq("id", st.leadId);
    if (error) return { ok: false, missing: [], error: error.message };
  } else {
    const { data, error } = await db.from("leads").insert(row).select("id").single();
    if (error || !data) return { ok: false, missing: [], error: error?.message ?? "not saved" };
    st.leadId = data.id as string;
    if (ctx.conversationId)
      await db
        .from("chat_conversations")
        .update({ lead_id: data.id, visitor_name: row.name, visitor_email: row.email })
        .eq("id", ctx.conversationId);
  }
  st.purpose = "sales";
  return { ok: true };
}

/** Files the job application in Applications, built from the remembered answers and screening. */
export async function submitApplication(
  ctx: ToolContext,
  args: { summary?: string; fit_score?: number | null },
): Promise<Saved> {
  const st = ctx.state;
  st.profile ??= {};
  const p = st.profile;
  const o = ctx.openings.find((x) => x.id === st.openingId);
  const c = {
    name: pick(p, NAME, NOT_NAME),
    email: pick(p, EMAIL),
    phone: pick(p, PHONE),
    location: pick(p, /locat|relocat|city/i),
    experience: pick(p, /experience/i),
    role: pick(p, /current (role|position|designation)|current company|employer/i),
    skills: pick(p, /skill/i),
    notice: pick(p, /notice/i),
    currentCtc: pick(p, /current ctc|current salary|current (package|compensation)/i),
    expectedCtc: pick(p, /expected ctc|expected salary|expected (package|compensation)/i),
    linkedin: pick(p, /linkedin/i),
  };
  const gaps = [
    !o && "which open role they are applying for (call get_job_details)",
    !c.name && "their name",
    !emailOk(c.email) && "a valid email address",
    !phoneOk(c.phone) && "a valid phone number",
  ].filter(Boolean);
  if (gaps.length || !o) return { ok: false, missing: gaps as string[] };
  if (!supabaseConfigured()) return { ok: false, missing: [], error: "unavailable" };
  const linkedin = /^https?:\/\/([a-z0-9-]+\.)*linkedin\.com\//i.test(c.linkedin) ? c.linkedin : null;
  const fit = Number(args.fit_score);
  const row = {
    opening_id: o.id,
    role_applied: o.title,
    name: c.name.slice(0, 120),
    email: c.email.slice(0, 254),
    phone: c.phone.slice(0, 40),
    location: c.location.slice(0, 160) || null,
    current_position: c.role.slice(0, 200) || null,
    notice_period: c.notice.slice(0, 60) || null,
    expected_ctc: c.expectedCtc.slice(0, 60) || null,
    linkedin_url: linkedin,
    resume_path: st.cvPath ?? null,
    details: { ...p, screening: st.screening ?? [], ...(st.cvName ? { "CV file": st.cvName } : {}) },
    ai_summary:
      String(args.summary ?? "")
        .trim()
        .slice(0, 1500) || null,
    fit_score: Number.isFinite(fit) ? Math.max(0, Math.min(100, Math.round(fit))) : null,
    language: ctx.language,
    conversation_id: ctx.conversationId,
    consent_at: new Date().toISOString(),
    source: "chatbot",
    updated_at: new Date().toISOString(),
  };
  const db = supabaseAdmin();
  if (st.applicationId) {
    const { error } = await db.from("job_applications").update(row).eq("id", st.applicationId);
    if (error) return { ok: false, missing: [], error: error.message };
  } else {
    const { data, error } = await db.from("job_applications").insert(row).select("id").single();
    if (error || !data) return { ok: false, missing: [], error: error?.message ?? "not saved" };
    st.applicationId = data.id as string;
    if (ctx.conversationId)
      await db
        .from("chat_conversations")
        .update({ application_id: data.id, visitor_name: row.name, visitor_email: row.email })
        .eq("id", ctx.conversationId);
  }
  st.purpose = "job";
  return { ok: true };
}
