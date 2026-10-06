import Link from "next/link";
import { requireAdmin } from "@/lib/admin/session";
import { getSettings } from "@/lib/cms/store";
import { ASSISTANT_LANGUAGES } from "@/lib/cms/settings";
import { llmConfigured } from "@/lib/assistant/llm";
import {
  SARVAM_LANGUAGES,
  SARVAM_STT_MODELS,
  SARVAM_VOICES,
  SARVAM_FEMALE_VOICES,
  VOICE_PROVIDERS,
} from "@/lib/voice/providers";
import { sarvamConfigured } from "@/lib/voice/sarvam";
import { VoicePreview } from "@/components/admin/voice-preview";
import { Card, Field, Notice, PageTitle, input, primaryBtn, secondaryBtn } from "@/components/admin/ui";
import { saveAssistant, testAssistant } from "./actions";

export const metadata = { title: "AI assistant" };

/** Models on NVIDIA's API that answer quickly, follow instructions and handle Indian languages. */
const MODELS = [
  ["nvidia/nemotron-3-super-120b-a12b", "Nemotron 3 Super 120B (recommended)"],
  ["openai/gpt-oss-20b", "GPT-OSS 20B (fast, good fallback)"],
  ["nvidia/nemotron-3-ultra-550b-a55b", "Nemotron 3 Ultra 550B (largest, slower)"],
  ["nvidia/llama-3.1-nemotron-ultra-253b-v1", "Llama 3.1 Nemotron Ultra 253B"],
  ["google/gemma-4-31b-it", "Gemma 4 31B"],
  ["mistralai/mistral-large-2-instruct", "Mistral Large 2"],
];

/** The AI assistant's settings: model, persona, what it asks clients and candidates, languages, voice. */
export default async function AssistantPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string; test?: string }>;
}) {
  await requireAdmin("assistant");
  const sp = await searchParams;
  const { assistant: a } = await getSettings();
  const keyOk = llmConfigured();
  const sarvamOk = sarvamConfigured();

  return (
    <>
      <PageTitle
        title="AI assistant"
        intro="The chat on every page of the website. It answers from your services, FAQs and job openings, takes client enquiries into Leads and job applications (with CV) into Applications. Changes apply from the next message."
        actions={
          <Link href="/" target="_blank" className={secondaryBtn}>
            Try it on the website
          </Link>
        }
      />
      {sp.saved ? <Notice tone="ok">Saved. The assistant uses these settings from the next message.</Notice> : null}
      {sp.error ? <Notice tone="warn">{sp.error}</Notice> : null}
      {sp.test ? <Notice tone={sp.test.startsWith("✓") ? "ok" : "warn"}>{sp.test}</Notice> : null}
      {!keyOk ? (
        <Notice tone="warn">
          No AI key is set on the server (NVIDIA_API_KEY), so the chat answers from the Chatbot FAQs only. Add the key
          as the NVIDIA_API_KEY GitHub secret and deploy; see the setup guide.
        </Notice>
      ) : null}

      <form action={saveAssistant} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold">Behaviour</h2>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" name="aiEnabled" defaultChecked={a.aiEnabled} className="h-4 w-4" />
              Answer with the AI model (off: answers come from the Chatbot FAQs only)
            </label>
            <Field
              label="Persona and instructions"
              hint="Who the assistant is and how it speaks. Your company facts, services, FAQs and openings are added automatically."
            >
              <textarea name="persona" rows={6} maxLength={4000} defaultValue={a.persona} className={input} />
            </Field>
            <Field
              label="Questions for clients (business enquiries)"
              hint="One per line, asked one at a time. Add (optional) to make one skippable. Name, email and the need are always required."
            >
              <textarea
                name="leadQuestions"
                rows={8}
                defaultValue={a.leadQuestions.join("\n")}
                className={`${input} font-mono text-xs`}
              />
            </Field>
            <Field label="Questions for job candidates" hint="One per line. Name, email and phone are always required.">
              <textarea
                name="candidateQuestions"
                rows={8}
                defaultValue={a.candidateQuestions.join("\n")}
                className={`${input} font-mono text-xs`}
              />
            </Field>
            <Field
              label="Screening questions from the job description"
              hint="How many questions the assistant asks about the role's requirements before filing the application. Write the description and requirements in Job openings."
            >
              <input
                type="number"
                name="screeningQuestions"
                min={0}
                max={8}
                defaultValue={a.screeningQuestions}
                className={`${input} max-w-24`}
              />
            </Field>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-semibold">Guardrails</h2>
            <p className="text-sm text-foreground-muted">
              What the assistant may and may not talk about, in chat and in voice. Every message is checked before the
              assistant replies; anything out of scope gets the polite answer below, in the visitor&apos;s language, and
              nothing is saved from it.
            </p>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                name="guardrailsEnabled"
                defaultChecked={a.guardrailsEnabled}
                className="h-4 w-4"
              />
              Answer only about In2IT EBS (recommended)
            </label>
            <Field label="Allowed topics" hint="One per line.">
              <textarea
                name="allowedTopics"
                rows={6}
                defaultValue={a.allowedTopics.join("\n")}
                className={`${input} font-mono text-xs`}
              />
            </Field>
            <Field
              label="Never help with"
              hint="One per line. The assistant declines these however they are worded, including requests to ignore its rules."
            >
              <textarea
                name="blockedTopics"
                rows={8}
                defaultValue={a.blockedTopics.join("\n")}
                className={`${input} font-mono text-xs`}
              />
            </Field>
            <Field
              label="Reply to an out-of-scope question"
              hint="Translated automatically into the visitor's language."
            >
              <textarea
                name="offTopicReply"
                rows={3}
                maxLength={600}
                defaultValue={a.offTopicReply}
                className={input}
              />
            </Field>
          </Card>

          <Card className="space-y-3">
            <h2 className="text-lg font-semibold">Languages</h2>
            <p className="text-sm text-foreground-muted">
              Visitors choose one in the chat. The assistant replies in it, and voice listens and speaks in it.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {Object.entries(ASSISTANT_LANGUAGES).map(([code, label]) => (
                <label key={code} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="languages"
                    value={code}
                    defaultChecked={a.languages.includes(code)}
                    className="h-4 w-4"
                  />
                  {label}
                </label>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold">AI model</h2>
            <p className="text-sm">
              Provider: <strong>NVIDIA</strong> ·{" "}
              {keyOk ? (
                <span className="font-semibold text-action">key configured</span>
              ) : (
                <span className="font-semibold">no key</span>
              )}
            </p>
            <Field label="Model" hint="Any chat model on build.nvidia.com that supports tools.">
              <input name="model" list="models" defaultValue={a.model} className={input} required />
            </Field>
            <Field label="Fallback model" hint="Used when the main model is busy or fails.">
              <input name="fallbackModel" list="models" defaultValue={a.fallbackModel} className={input} />
            </Field>
            <datalist id="models">
              {MODELS.map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </datalist>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" name="thinking" defaultChecked={a.thinking} className="mt-0.5 h-4 w-4" />
              <span>
                Think before answering
                <span className="block text-xs text-foreground-muted">Deeper answers, but several seconds slower.</span>
              </span>
            </label>
            <Field label="Creativity (0 to 1)" hint="Lower is more factual and consistent. 0.3 is a good default.">
              <input
                type="number"
                name="temperature"
                min={0}
                max={1}
                step={0.1}
                defaultValue={a.temperature}
                className={`${input} max-w-24`}
              />
            </Field>
            <button type="submit" formAction={testAssistant} formNoValidate className={secondaryBtn}>
              Test connection
            </button>
          </Card>

          <Card className="space-y-3">
            <h2 className="text-lg font-semibold">Voice</h2>
            <Field
              label="Voice provider"
              hint={`Sarvam covers ${Object.keys(SARVAM_LANGUAGES).length} languages (English and Indian languages); other languages use the browser voice. More providers can be added later.`}
            >
              <select name="voiceProvider" defaultValue={a.voiceProvider} className={input}>
                {Object.entries(VOICE_PROVIDERS).map(([id, p]) => (
                  <option key={id} value={id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </Field>
            <p className="text-xs">
              Sarvam key:{" "}
              {sarvamOk ? (
                <span className="font-semibold text-action">configured</span>
              ) : (
                <span className="font-semibold">not set (SARVAM_API_KEY), so the browser voice is used</span>
              )}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Voice (Sarvam)" hint="Used everywhere: the chat's Listen button and voice conversation">
                <select name="voiceName" defaultValue={a.voiceName} className={input}>
                  {/* One voice for the whole site: the chat's Listen button and voice conversation. */}
                  <optgroup label="Female voices">
                    {SARVAM_FEMALE_VOICES.map((v) => (
                      <option key={v} value={v}>
                        {v[0].toUpperCase() + v.slice(1)} (female)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Male voices">
                    {SARVAM_VOICES.filter((v) => !SARVAM_FEMALE_VOICES.includes(v)).map((v) => (
                      <option key={v} value={v}>
                        {v[0].toUpperCase() + v.slice(1)} (male)
                      </option>
                    ))}
                  </optgroup>
                </select>
              </Field>
              <Field label="Speed" hint="0.8 slower · 1 normal · 1.3 faster">
                <input
                  type="number"
                  name="voicePace"
                  min={0.8}
                  max={1.3}
                  step={0.05}
                  defaultValue={a.voicePace}
                  className={input}
                />
              </Field>
            </div>
            <Field
              label="Pause before the assistant replies (seconds)"
              hint="How long a visitor may stop talking before their turn ends. Raise it if people get cut off mid-sentence; lower it for quicker replies. 1.5 is a good default; short answers such as yes or a name end sooner."
            >
              <input
                type="number"
                name="endOfSpeech"
                min={1}
                max={4}
                step={0.1}
                defaultValue={a.endOfSpeechMs / 1000}
                className={`${input} max-w-28`}
              />
            </Field>
            <Field label="Speech recognition model (Sarvam)">
              <select name="sttModel" defaultValue={a.sttModel} className={input}>
                {SARVAM_STT_MODELS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                    {m === "saarika:v2.5" ? " (recommended)" : m === "saarika:flash" ? " (fastest)" : ""}
                  </option>
                ))}
              </select>
            </Field>
            {sarvamOk ? <VoicePreview /> : null}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="voiceMode" defaultChecked={a.voiceMode} className="h-4 w-4" />
              Voice conversation button: talk back and forth hands-free, like a phone call
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="voiceInput" defaultChecked={a.voiceInput} className="h-4 w-4" />
              Microphone: visitors can speak instead of typing
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="voiceOutput" defaultChecked={a.voiceOutput} className="h-4 w-4" />
              Speaker: replies can be read aloud
            </label>
            <p className="text-xs text-foreground-muted">
              The microphone stops by itself when the visitor stops talking. Replies are spoken sentence by sentence, so
              the first words play almost at once.
            </p>
          </Card>

          <div className="sticky bottom-4">
            <button type="submit" className={`${primaryBtn} w-full`}>
              Save settings
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
