import { NextRequest, NextResponse } from "next/server";
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  auraSystemPrompt,
  createSarvamClient,
} from "@/lib/sarvam";

export const runtime = "nodejs";

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

  try {
    const client = createSarvamClient();
    const lang = language as SupportedLanguage;

    const chat = await client.chat.completions({
      model: "sarvam-105b",
      temperature: 0.4,
      reasoning_effort: "low",
      messages: [
        { role: "system", content: auraSystemPrompt(lang) },
        { role: "user", content: text },
      ],
    });

    const reply = (chat.choices?.[0]?.message?.content ?? "").trim();
    if (!reply) {
      return NextResponse.json(
        { error: "The model produced an empty reply. Please try again." },
        { status: 502 }
      );
    }

    const tts = await client.textToSpeech.convert({
      text: reply,
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
