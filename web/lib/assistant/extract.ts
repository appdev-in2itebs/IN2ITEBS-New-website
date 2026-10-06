import type { Settings } from "@/lib/cms/settings";
import type { OpeningRow } from "@/lib/cms/store";
import { complete } from "./llm";
import type { AgentState } from "./knowledge";

/**
 * The assistant's note-taker. Before each reply, one small model call reads the assistant's last
 * question and the visitor's new message and returns, as JSON, the facts they just gave: checklist
 * answers, the role they want, a screening answer, whether they confirmed. The server merges it
 * into the conversation's memory and decides on its own when to save a lead or file an
 * application, so saving never depends on the chat model choosing to call a tool.
 */

export type Extraction = {
  purpose: "sales" | "job" | null;
  details: Record<string, string>;
  openingId: string | null;
  screening: { question: string; answer: string } | null;
  confirmed: boolean;
  declinedCv: boolean;
  summary: string;
  fitScore: number | null;
  /** False when the message is outside what the assistant may help with (the guardrails). */
  onTopic: boolean;
  offTopicReason: string;
};

const EMPTY: Extraction = {
  purpose: null,
  details: {},
  openingId: null,
  screening: null,
  confirmed: false,
  declinedCv: false,
  summary: "",
  fitScore: null,
  onTopic: true,
  offTopicReason: "",
};

export async function extract(input: {
  settings: Settings;
  state: AgentState;
  openings: OpeningRow[];
  lastAssistant: string;
  message: string;
  /** The last few messages, so facts the visitor volunteered earlier are not missed. */
  recent?: { role: string; content: string }[];
}): Promise<Extraction> {
  const { settings, state, openings } = input;
  const a = settings.assistant;
  const role = openings.find((o) => o.id === state.openingId);
  // Screening starts only once the candidate checklist is complete; before that there is none.
  const screeningPhase =
    state.purpose === "job" && !!role && a.candidateQuestions.every((q) => (state.profile ?? {})[q]?.trim());
  const prompt = `You take notes for a company's website chat. Read the assistant's last message and the visitor's reply, and return ONLY a JSON object, no other text:
{
  "purpose": "sales" if the visitor wants a service, quote, demo or call; "job" if they want a job; null if not clear yet,
  "details": { "<checklist item>": "<the visitor's answer>" } for every checklist item the visitor has answered anywhere in the conversation (including things they said before being asked, such as their need in their first message) that is missing from the notes or has changed. Exact checklist wording as keys, answers in English, keep numbers and units,
  "opening_id": the opening_id of the role they choose, or null,
  "screening": ${screeningPhase ? `{ "question": "<the assistant's screening question>", "answer": "<their answer>" } if the assistant's last message asked a job-skills question and the visitor answered it, else null` : "null (always null at this stage)"},
  "confirmed": true only if the visitor clearly agrees to send, save or submit their details (e.g. "yes", "correct", "go ahead", "submit it"),
  "declined_cv": true if they say they cannot or will not upload a CV,
  "summary": two lines, in English, summarising only what the visitor actually said (the notes and the conversation); never add anything they did not say,
  "fit_score": ${role ? "0-100, how well the candidate's experience fits the role's requirements" : "null"},
  "on_topic": ${a.guardrailsEnabled ? `false only if the visitor's reply asks for something outside the allowed topics or inside the blocked topics below (an answer to the assistant's own question, a greeting or thanks is always on topic; a company that wants In2IT EBS to build or run something for it is on topic; a question about In2IT EBS's own leadership or team, such as who the MD, COO or CRO is or a leader's background, is on topic; questions about its clients, testimonials (what clients say), case studies or past projects are on topic; only asking for someone's private details such as a personal phone number, home address, family or salary is off topic)` : "true"},
  "off_topic_reason": "a few words on why, when on_topic is false"
}

${a.guardrailsEnabled ? `Allowed topics: ${a.allowedTopics.join(" | ")}\nBlocked topics: ${a.blockedTopics.join(" | ")}\n` : ""}Business enquiry checklist: ${a.leadQuestions.join(" | ")}
Job candidate checklist: ${a.candidateQuestions.join(" | ")}
Open roles: ${openings.map((o) => `${o.id} = ${o.title}`).join("; ") || "none"}
${role ? `Role applied for: ${role.title}${role.experience ? ` (${role.experience})` : ""}. Requirements: ${[role.requirements, role.skills && `Key skills: ${role.skills}`, role.responsibilities].filter(Boolean).join(" | ").slice(0, 1500) || role.description.slice(0, 800) || "(not written)"}` : ""}
Notes so far: ${JSON.stringify(state.profile ?? {})}${state.screening?.length ? `\nScreening so far: ${JSON.stringify(state.screening)}` : ""}

${input.recent?.length ? `Recent conversation:\n${input.recent.map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content.slice(0, 600)}`).join("\n")}\n` : ""}
Assistant's last message: """${input.lastAssistant.slice(0, 1500)}"""
Visitor's reply: """${input.message.slice(0, 2000)}"""`;

  try {
    const res = await complete({
      model: a.model,
      fallbackModel: a.fallbackModel,
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      maxTokens: 700,
      thinking: false,
      timeoutMs: 15_000,
    });
    return parse(res.message.content ?? "", openings);
  } catch {
    return EMPTY;
  }
}

/** Reads the model's JSON defensively: anything malformed is dropped, never trusted. */
export function parse(text: string, openings: { id: string }[]): Extraction {
  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(json) as Record<string, unknown>;
  } catch {
    return EMPTY;
  }
  const s = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const details: Record<string, string> = {};
  if (raw.details && typeof raw.details === "object")
    for (const [k, v] of Object.entries(raw.details as Record<string, unknown>).slice(0, 30)) {
      const value = typeof v === "number" ? String(v) : s(v, 1500);
      if (k.trim() && value && !/^(null|n\/a|unknown|none given)$/i.test(value)) details[k.trim().slice(0, 80)] = value;
    }
  const sc = raw.screening as Record<string, unknown> | null;
  const screening =
    sc && typeof sc === "object" && s(sc.question, 400) && s(sc.answer, 2000)
      ? { question: s(sc.question, 400), answer: s(sc.answer, 2000) }
      : null;
  const opening = s(raw.opening_id, 40);
  const fit = Number(raw.fit_score);
  return {
    purpose: raw.purpose === "sales" || raw.purpose === "job" ? raw.purpose : null,
    details,
    openingId: openings.some((o) => o.id === opening) ? opening : null,
    screening,
    confirmed: raw.confirmed === true,
    declinedCv: raw.declined_cv === true,
    summary: s(raw.summary, 1500),
    fitScore: Number.isFinite(fit) && raw.fit_score !== null ? Math.max(0, Math.min(100, Math.round(fit))) : null,
    // Only an explicit false blocks a message: a missing or malformed answer lets it through.
    onTopic: raw.on_topic !== false,
    offTopicReason: s(raw.off_topic_reason, 200),
  };
}
