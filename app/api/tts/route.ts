import { NextRequest, NextResponse } from "next/server";
import { SarvamAIClient } from "sarvamai";

export const runtime = "nodejs";

const SUPPORTED_LANGUAGES = ["hi-IN", "ta-IN", "ml-IN", "kn-IN"] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const SPEAKER = "ritu";

export async function POST(request: NextRequest) {
  let body: { text?: unknown; language?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { text, language } = body;

  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "Text is required." }, { status: 400 });
  }

  if (
    typeof language !== "string" ||
    !(SUPPORTED_LANGUAGES as readonly string[]).includes(language)
  ) {
    return NextResponse.json(
      { error: "Unsupported language. Choose Hindi, Tamil, Malayalam or Kannada." },
      { status: 400 }
    );
  }

  const apiKey = process.env.SARVAM_API;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing the SARVAM_API key." },
      { status: 500 }
    );
  }

  try {
    const client = new SarvamAIClient({ apiSubscriptionKey: apiKey });
    const lang = language as SupportedLanguage;

    const translation = await client.text.translate({
      input: text,
      source_language_code: "en-IN",
      target_language_code: lang,
    });

    const spokenText = translation.translated_text ?? text;

    const tts = await client.textToSpeech.convert({
      text: spokenText,
      language_code: lang,
      speaker: SPEAKER,
      model: "bulbul:v3",
      pace: 1,
      speech_sample_rate: 24000,
      output_audio_codec: "mp3",
    });

    const audio = tts.audios?.[0];
    if (!audio) {
      return NextResponse.json(
        { error: "No audio was generated." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      audioBase64: audio,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
