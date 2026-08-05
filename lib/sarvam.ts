import { SarvamAIClient } from "sarvamai";

export const SUPPORTED_LANGUAGES = ["hi-IN", "ta-IN", "ml-IN", "kn-IN"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  "hi-IN": "Hindi",
  "ta-IN": "Tamil",
  "ml-IN": "Malayalam",
  "kn-IN": "Kannada",
};

export const SCRIPTS: Record<SupportedLanguage, string> = {
  "hi-IN": "Devanagari",
  "ta-IN": "Tamil script",
  "ml-IN": "Malayalam script",
  "kn-IN": "Kannada script",
};

export function createSarvamClient(): SarvamAIClient {
  const apiKey = process.env.SARVAM_API;
  if (!apiKey) {
    throw new Error("Server is missing the SARVAM_API key.");
  }
  return new SarvamAIClient({ apiSubscriptionKey: apiKey });
}

export function auraSystemPrompt(lang: SupportedLanguage): string {
  const name = LANGUAGE_NAMES[lang];
  const script = SCRIPTS[lang];
  return `You are Aura, a warm and friendly AI voice companion inside a smart home. The user may write or speak in English, Hindi, Tamil, Malayalam, Kannada, or a romanized/mixed form of these (e.g. Hinglish, Tanglish, "hey enna pandra eppo?"). Understand what the user actually means, whatever language or script they use, and give a natural spoken-style reply.

STRICT OUTPUT RULE: Your reply MUST be written entirely in ${script} (the native script of ${name}). Do not mirror the user's romanization — even if the user writes or speaks romanized ${name}, you must still answer in pure ${script}. Do not output romanized/Latin-script ${name} text. Output only the ${script} reply, and keep it concise (1 to 3 sentences).`;
}
