import type { Settings } from "@/lib/cms/settings";
import { ASSISTANT_LANGUAGES } from "@/lib/cms/settings";
import { complete, streamComplete, type LlmMessage } from "./llm";
import type { Turn } from "./conversation";
import type { AgentState } from "./knowledge";
import { extract } from "./extract";
import { aboutLeadership, addLinks } from "./links";
import { TOOL_SPECS, missing, runTool, saveLead, submitApplication, type ToolContext, type UiAction } from "./tools";

/**
 * One turn of the agentic assistant:
 *  - Notes: the visitor's new message is turned into facts (extract.ts) and remembered.
 *  - Decisions: the server saves the lead or files the application once the required answers are
 *    in and the visitor confirmed, and shows the CV upload when it is time.
 *  - Reply: the chat model answers, streamed word by word to the visitor (onText), using tools to
 *    search the site and read job descriptions.
 *
 * For speed the notes are taken while the reply is being written. Only a turn that answers "shall I
 * send it?" waits for the notes first, so the saving decision and the reply always agree. When the
 * notes show the message was out of scope, or the reply claimed something untrue, the streamed text
 * is replaced (onReplace).
 */
export async function runAgent(input: {
  settings: Settings;
  system: (state: AgentState) => string;
  history: Turn[];
  message: string;
  ctx: ToolContext;
  onText?: (delta: string) => void;
  onReplace?: (text: string) => void;
  channel?: "text" | "voice";
}): Promise<{ text: string; actions: UiAction[]; model: string; tokensIn: number; tokensOut: number }> {
  const a = input.settings.assistant;
  const st = input.ctx.state;
  const actions: UiAction[] = [];
  const t0 = Date.now();

  const lastAssistant = [...input.history].reverse().find((t) => t.role === "assistant")?.content ?? "";
  const checklistWasDone = missing(a.candidateQuestions, st.profile ?? {}).length === 0;
  // A "yes" only counts as consent when the assistant had just asked to send or submit.
  const askedToConfirm = /\b(submit|confirm|correct|send (it|this|your)|shall i|should i|go ahead|proceed)\b/i.test(
    lastAssistant,
  );
  const extraction = extract({
    settings: input.settings,
    state: { ...st },
    openings: input.ctx.openings,
    lastAssistant,
    message: input.message,
    recent: input.history.filter((t) => t.role !== "system").slice(-8),
  });

  /** Applies the notes and takes the saving decisions. Returns true when the turn must be refused outright. */
  const applyNotes = async (): Promise<boolean> => {
    const ex = await extraction;
    if (ex.purpose && !(st.purpose === "job" && ex.purpose === "sales" && st.openingId)) st.purpose = ex.purpose;
    st.offTopic = undefined;
    // Questions about the company's leadership and team are always in scope (lib/assistant/links.ts).
    if (a.guardrailsEnabled && !ex.onTopic && !aboutLeadership(input.message, input.ctx.index)) {
      st.offTopic = ex.offTopicReason || "outside what In2IT EBS helps with";
      st.offTopicCount = (st.offTopicCount ?? 0) + 1;
      console.info(JSON.stringify({ event: "assistant_off_topic", count: st.offTopicCount }));
      return (st.offTopicCount ?? 0) > 5;
    }
    st.profile = { ...(st.profile ?? {}), ...ex.details };
    if (ex.openingId) {
      st.openingId = ex.openingId;
      st.purpose = "job";
    }
    if (ex.screening && st.purpose === "job" && st.openingId && checklistWasDone)
      st.screening = [...(st.screening ?? []).filter((x) => x.question !== ex.screening!.question), ex.screening].slice(
        -12,
      );
    if (ex.declinedCv) st.declinedCv = true;
    if (ex.summary) st.summary = ex.summary;
    if (ex.fitScore !== null) st.fitScore = ex.fitScore;
    const changed = Object.keys(ex.details).length > 0 || Boolean(ex.screening);

    st.note = undefined;
    const confirmed = ex.confirmed && askedToConfirm;
    if (st.purpose === "sales" && (confirmed || (st.leadId && changed))) {
      const first = !st.leadId;
      const saved = await saveLead(input.ctx, { summary: st.summary });
      if (saved.ok && first) actions.push({ type: "saved", kind: "lead" });
      if (!saved.ok && saved.missing.length) st.note = `Not saved yet. Still needed: ${saved.missing.join(", ")}.`;
    }
    // A job application is filed as soon as they say yes to submitting (screening answers and the CV go
    // in when there are any; missing ones never block a candidate who confirmed), then kept up to date.
    if (st.purpose === "job" && ((confirmed && st.openingId) || (st.applicationId && changed))) {
      const saved = await submitApplication(input.ctx, { summary: st.summary, fit_score: st.fitScore ?? null });
      if (saved.ok && !st.applicationIdShown) {
        actions.push({ type: "saved", kind: "application" });
        st.applicationIdShown = true;
      } else if (!saved.ok && saved.missing.length)
        st.note = `Not submitted yet. Still needed: ${saved.missing.join(", ")}.`;
    }
    return false;
  };

  const sequential = askedToConfirm;
  if (sequential && (await applyNotes())) return refused(a.offTopicReply);
  const tNotes = Date.now();

  const messages: LlmMessage[] = [
    { role: "system", content: input.system(st) },
    ...input.history.map(
      (t): LlmMessage =>
        t.role === "system"
          ? { role: "user", content: `[Note from the website, not typed by the visitor] ${t.content}` }
          : { role: t.role, content: t.content },
    ),
    { role: "user", content: input.message },
  ];
  let model = a.model;
  let tokensIn = 0;
  let tokensOut = 0;
  let text = "";
  let streamed = "";
  for (let round = 0; round < 4; round++) {
    let res = await streamComplete(
      {
        model: a.model,
        fallbackModel: a.fallbackModel,
        messages,
        // An out-of-scope turn gets no tools: it can only decline.
        tools: st.offTopic ? undefined : TOOL_SPECS,
        temperature: a.temperature,
        maxTokens: a.thinking ? 2000 : 900,
        thinking: a.thinking,
      },
      (delta) => {
        streamed += delta;
        input.onText?.(delta);
      },
    );
    // An empty answer (a reasoning model that used its whole budget thinking): ask again, plainly.
    if (!res.message.tool_calls?.length && !res.message.content?.trim()) {
      console.warn(JSON.stringify({ event: "assistant_empty_reply", model: res.model, round }));
      res = await complete({
        model: a.fallbackModel || a.model,
        messages,
        tools: TOOL_SPECS,
        temperature: a.temperature,
        maxTokens: 900,
        thinking: false,
      });
      if (res.message.content?.trim() && !res.message.tool_calls?.length) {
        streamed += res.message.content;
        input.onText?.(res.message.content);
      }
    }
    model = res.model;
    tokensIn += res.tokensIn ?? 0;
    tokensOut += res.tokensOut ?? 0;
    const calls = res.message.tool_calls ?? [];
    if (!calls.length) {
      text = streamed.trim();
      break;
    }
    // Words written before a tool call stay; the answer continues after it on a new line.
    if (streamed && !streamed.endsWith("\n")) {
      streamed += "\n\n";
      input.onText?.("\n\n");
    }
    messages.push({ role: "assistant", content: res.message.content ?? null, tool_calls: calls });
    for (const call of calls.slice(0, 4)) {
      const { result, action } = await runTool(call.function.name, call.function.arguments, input.ctx);
      // Which tool ran and whether it worked: no arguments, so no personal data in the logs.
      const failed = typeof result === "object" && result !== null && "error" in result;
      console.info(JSON.stringify({ event: "assistant_tool", tool: call.function.name, ok: !failed }));
      if (action && !actions.some((x) => x.type === action.type)) actions.push(action);
      messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result).slice(0, 8000) });
    }
  }

  // The notes taken while the reply was written.
  if (!sequential && (await applyNotes())) return refused(a.offTopicReply);
  let final = text;
  if (!sequential && st.offTopic) final = await translate(a.offTopicReply, input.ctx.language, a);
  final = await keepHonest(final, input.ctx, actions, st);
  if (!final) final = fallbackText(actions);
  if (final !== text) input.onReplace?.(final);
  // Written answers link the website's own pages (spoken ones are read aloud, so no links).
  if (input.channel !== "voice" && !st.offTopic)
    final = addLinks(final, {
      index: input.ctx.index,
      faqs: input.ctx.faqs,
      question: st.purpose ? undefined : input.message,
    });
  settleCvButton(actions, final, st);
  console.info(
    JSON.stringify({
      event: "assistant_timing",
      notesMs: sequential ? tNotes - t0 : "parallel",
      replyMs: Date.now() - tNotes,
      model,
    }),
  );
  return { text: final, actions, model, tokensIn, tokensOut };

  function refused(reply: string) {
    input.onReplace?.(reply);
    return { text: reply, actions: [], model: "guardrail", tokensIn: 0, tokensOut: 0 };
  }
}

/** The admin's out-of-scope message in the visitor's language (English needs no model call). */
async function translate(message: string, language: string, a: Settings["assistant"]): Promise<string> {
  if (language === "en-IN") return message;
  try {
    const res = await complete({
      model: a.model,
      fallbackModel: a.fallbackModel,
      messages: [
        {
          role: "user",
          content: `Translate into ${ASSISTANT_LANGUAGES[language] ?? language}. Reply with the translation only, keeping "In2IT EBS", SAP and AI as they are:\n\n${message}`,
        },
      ],
      maxTokens: 400,
      temperature: 0,
      timeoutMs: 12_000,
    });
    return res.message.content?.trim() || message;
  } catch {
    return message;
  }
}

/**
 * The reply may only say an application was submitted or an enquiry sent when it really was. When it
 * claims so and nothing is saved yet, the server files it now from the notes; if required answers
 * are missing, the claim is replaced by a request for them. The visitor is never told something false.
 */
async function keepHonest(text: string, ctx: ToolContext, actions: UiAction[], st: AgentState): Promise<string> {
  const claimsApplication =
    /\b(i(['’]ve| have)?|we(['’]ve| have)?|has been|was|is now|successfully)\s+(\w+\s+){0,3}(submitted|forwarded|sent)\b[^.]*\b(application|hr)\b/i.test(
      text,
    ) || /\byour application (has been|was|is) (submitted|sent|forwarded)/i.test(text);
  const claimsLead =
    /\b(i(['’]ve| have)?|we(['’]ve| have)?|has been|was|successfully)\s+(\w+\s+){0,3}(shared|sent|forwarded|passed on|submitted)\b[^.]*\b(details|enquiry|inquiry|requirement|team)\b/i.test(
      text,
    );
  if (claimsApplication && !st.applicationId && st.purpose === "job") {
    const saved = await submitApplication(ctx, { summary: st.summary, fit_score: st.fitScore ?? null });
    if (saved.ok) {
      if (!actions.some((a) => a.type === "saved")) actions.push({ type: "saved", kind: "application" });
      st.applicationIdShown = true;
      return text;
    }
    console.warn(JSON.stringify({ event: "assistant_false_claim", kind: "application" }));
    return saved.missing.length
      ? `Before I can submit your application, I still need ${saved.missing.join(", ")}. Could you share that?`
      : "Sorry, I could not submit your application just now. Please try again in a moment, or email our HR team.";
  }
  if (claimsLead && !st.leadId && st.purpose === "sales") {
    const saved = await saveLead(ctx, { summary: st.summary });
    if (saved.ok) {
      if (!actions.some((a) => a.type === "saved")) actions.push({ type: "saved", kind: "lead" });
      return text;
    }
    console.warn(JSON.stringify({ event: "assistant_false_claim", kind: "lead" }));
    return saved.missing.length
      ? `Before I can send your enquiry to our team, I still need ${saved.missing.join(", ")}. Could you share that?`
      : "Sorry, I could not send your details just now. Please try again in a moment, or email info@in2itebs.com.";
  }
  return text;
}

/**
 * The CV upload button appears only at the CV step of a job application: a candidate who has chosen
 * an open role, has not sent a CV yet, and is being asked right now to upload or attach it (in words
 * or through request_cv_upload). A reply that merely mentions a CV gets no button.
 */
export function settleCvButton(actions: UiAction[], text: string, st: AgentState) {
  const i = actions.findIndex((a) => a.type === "cv_upload");
  const asksNow =
    /\b(upload|attach|share|send|provide|submit)\b[^.?!\n]{0,60}\b(cv|cvs|resume|résumé|curriculum vitae)\b/i.test(
      text,
    ) || /(सीवी|बायोडाटा|रिज़्यूमे|रिज्यूमे)[^।?!\n]{0,40}(अपलोड|भेज|साझा)/.test(text);
  const atCvStep =
    st.purpose === "job" && Boolean(st.openingId) && !st.cvPath && !st.declinedCv && !st.applicationId && !st.offTopic;
  const show = atCvStep && (i >= 0 || asksNow);
  if (show && i < 0) actions.push({ type: "cv_upload" });
  if (!show && i >= 0) actions.splice(i, 1);
}

function fallbackText(actions: UiAction[]) {
  if (actions.some((a) => a.type === "saved" && a.kind === "application"))
    return "Thank you. Your application has been submitted and our HR team will review it.";
  if (actions.some((a) => a.type === "saved"))
    return "Thank you. Your details have reached our team, who will contact you soon.";
  if (actions.some((a) => a.type === "cv_upload")) return "Please upload your CV using the button below.";
  return "Sorry, I could not complete that. Could you rephrase, or email info@in2itebs.com?";
}
