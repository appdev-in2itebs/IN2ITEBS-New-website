"use server";

import { redirect } from "next/navigation";
import { audit, requireAdmin } from "@/lib/admin/session";
import { saveSetting } from "@/lib/cms/store";
import { ASSISTANT_LANGUAGES, assistantSchema } from "@/lib/cms/settings";
import { complete, llmConfigured } from "@/lib/assistant/llm";

const lines = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

/** Saves the assistant's settings; the chat uses them from the next message on. */
export async function saveAssistant(form: FormData) {
  const admin = await requireAdmin("assistant");
  const s = (name: string) => String(form.get(name) ?? "").trim();
  const parsed = assistantSchema.safeParse({
    aiEnabled: form.get("aiEnabled") === "on",
    provider: "nvidia",
    model: s("model"),
    fallbackModel: s("fallbackModel"),
    temperature: Number(s("temperature") || 0.3),
    thinking: form.get("thinking") === "on",
    persona: s("persona"),
    leadQuestions: lines(form.get("leadQuestions")),
    candidateQuestions: lines(form.get("candidateQuestions")),
    screeningQuestions: Number(s("screeningQuestions") || 3),
    guardrailsEnabled: form.get("guardrailsEnabled") === "on",
    allowedTopics: lines(form.get("allowedTopics")),
    blockedTopics: lines(form.get("blockedTopics")),
    offTopicReply: s("offTopicReply"),
    languages: form
      .getAll("languages")
      .map(String)
      .filter((c) => c in ASSISTANT_LANGUAGES),
    voiceInput: form.get("voiceInput") === "on",
    voiceOutput: form.get("voiceOutput") === "on",
    voiceMode: form.get("voiceMode") === "on",
    bargeIn: form.get("bargeIn") === "on",
    bargeInSensitivity: ["low", "high"].includes(s("bargeInSensitivity")) ? s("bargeInSensitivity") : "medium",
    autoLanguage: form.get("autoLanguage") === "on",
    nativeTranslation: form.get("nativeTranslation") === "on",
    micRange: ["close", "far"].includes(s("micRange")) ? s("micRange") : "normal",
    voiceProvider: s("voiceProvider") === "browser" ? "browser" : "sarvam",
    voiceName: s("voiceName") || "priya",
    sttModel: s("sttModel") || "saaras:v3",
    voicePace: Number(s("voicePace") || 1),
    endOfSpeechMs: Math.round(Number(s("endOfSpeech") || 1.8) * 1000),
  });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    redirect(`/admin/assistant/?error=${encodeURIComponent(`${issue.path.join(".")}: ${issue.message}`)}`);
  }
  if (!parsed.data.languages.length) parsed.data.languages = ["en-IN"];
  try {
    await saveSetting("assistant", parsed.data, admin.email);
  } catch {
    redirect(`/admin/assistant/?error=${encodeURIComponent("Could not save. Please try again.")}`);
  }
  await audit(admin, "update", "setting", "assistant");
  redirect("/admin/assistant/?saved=1");
}

/** Sends one short message to the chosen model, to check that the key and the model work. */
export async function testAssistant(form: FormData) {
  await requireAdmin("assistant");
  const model = String(form.get("model") ?? "").trim();
  if (!llmConfigured())
    redirect(`/admin/assistant/?test=${encodeURIComponent("No NVIDIA_API_KEY is set on the server.")}`);
  const started = Date.now();
  let message: string;
  try {
    const res = await complete({
      model,
      messages: [{ role: "user", content: "Reply with exactly: Connection works." }],
      maxTokens: 20,
      temperature: 0,
      timeoutMs: 20_000,
    });
    message = `✓ ${res.model} answered in ${((Date.now() - started) / 1000).toFixed(1)} s: "${(res.message.content ?? "").slice(0, 60)}"`;
  } catch (e) {
    message = `✗ ${model} did not answer (${e instanceof Error ? e.message : "error"}). Check the model name, or try the fallback model.`;
  }
  redirect(`/admin/assistant/?test=${encodeURIComponent(message)}`);
}
