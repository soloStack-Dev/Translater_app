// =============================================================================
// Sarvam AI — SERVER-ONLY helpers.
// Thin wrappers around the Sarvam SDK so the API routes stay short and readable:
//
//   generateAuraReply()   LLM understands the user (any language / romanized)
//                         and replies in the selected language, native script.
//   transcribeAudio()     Speech-to-text on a decoded audio buffer.
//   synthesizeSpeech()    Text-to-speech → base64 mp3.
//
// IMPORTANT: imports "sarvamai" → never import from a client component
// (kept out of the client bundle via serverExternalPackages in next.config.ts).
// =============================================================================
import { SarvamAIClient } from "sarvamai";
import { LANGUAGES, type LanguageCode } from "./languages";

// Fast lookup map: language code → its metadata (name, script).
const LANGUAGE_META = Object.fromEntries(
  LANGUAGES.map((lang) => [lang.code, lang])
) as Record<LanguageCode, (typeof LANGUAGES)[number]>;

// -----------------------------------------------------------------------------
// Build the API client from the environment key (never hardcode the key).
// -----------------------------------------------------------------------------
function createSarvamClient(): SarvamAIClient {
  const apiKey = process.env.SARVAM_API;
  if (!apiKey) {
    throw new Error("Server is missing the SARVAM_API key.");
  }
  return new SarvamAIClient({ apiSubscriptionKey: apiKey });
}

// -----------------------------------------------------------------------------
// System prompt: tells the LLM who it is and to ALWAYS answer in the selected
// language's native script — even when the user writes romanized text
// (e.g. "hey enna pandra eppo?"). Without this rule the model mirrors the
// user's romanization, which makes the TTS voice mispronounce.
// -----------------------------------------------------------------------------
function auraSystemPrompt(language: LanguageCode): string {
  const { name, script } = LANGUAGE_META[language];
  return `You are Aura, a warm and friendly AI voice companion inside a smart home. The user may write or speak in English, Hindi, Tamil, Malayalam, Kannada, or a romanized/mixed form of these (e.g. Hinglish, Tanglish, "hey enna pandra eppo?"). Understand what the user actually means, whatever language or script they use, and give a natural spoken-style reply.

STRICT OUTPUT RULE: Your reply MUST be written entirely in ${script} (the native script of ${name}). Do not mirror the user's romanization — even if the user writes or speaks romanized ${name}, you must still answer in pure ${script}. Do not output romanized/Latin-script ${name} text. Output only the ${script} reply, and keep it concise (1 to 3 sentences).`;
}

// -----------------------------------------------------------------------------
// LLM reply: turn the user's words into Aura's answer in the selected language.
// -----------------------------------------------------------------------------
export async function generateAuraReply(
  language: LanguageCode,
  userInput: string
): Promise<string> {
  const client = createSarvamClient();
  const chat = await client.chat.completions({
    model: "sarvam-105b",
    temperature: 0.4,
    reasoning_effort: "low", // this model reasons a lot; "low" keeps replies fast
    messages: [
      { role: "system", content: auraSystemPrompt(language) },
      { role: "user", content: userInput },
    ],
  });

  const reply = (chat.choices?.[0]?.message?.content ?? "").trim();
  if (!reply) {
    throw new Error("The model produced an empty reply. Please try again.");
  }
  return reply;
}

// -----------------------------------------------------------------------------
// Speech-to-text: transcribe a decoded audio buffer (base64 → Buffer).
// Returns the transcript, or an empty string when nothing was heard.
// -----------------------------------------------------------------------------
// STT only accepts bare MIME types (no ";codecs=…" parameters) — Chrome's
// MediaRecorder reports "audio/webm;codecs=opus", so normalize here too,
// regardless of what the client sent.
function normalizeMimeType(mimeType: string): string {
  return mimeType.split(";")[0].trim() || "audio/webm";
}

export async function transcribeAudio(
  audio: Buffer,
  mimeType: string
): Promise<string> {
  const client = createSarvamClient();
  const stt = await client.speechToText.transcribe({
    file: {
      data: audio,
      contentType: normalizeMimeType(mimeType),
      filename: "input.webm",
    },
  });
  return (stt.transcript ?? "").trim();
}

// -----------------------------------------------------------------------------
// Text-to-speech: speak text in the given language → base64 mp3.
// -----------------------------------------------------------------------------
export async function synthesizeSpeech(
  language: LanguageCode,
  text: string
): Promise<string> {
  const client = createSarvamClient();
  const tts = await client.textToSpeech.convert({
    text,
    language_code: language,
    speaker: "ritu",
    model: "bulbul:v3",
    pace: 1,
    speech_sample_rate: 24000,
    output_audio_codec: "mp3",
  });

  const audio = tts.audios?.[0];
  if (!audio) {
    throw new Error("No audio was generated.");
  }
  return audio;
}
