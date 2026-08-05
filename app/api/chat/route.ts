import { NextRequest, NextResponse } from "next/server";
import { SarvamAIClient } from "sarvamai";

export const runtime = "nodejs";

const SUPPORTED_LANGUAGES = ["hi-IN", "ta-IN", "ml-IN", "kn-IN"] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  "hi-IN": "Hindi",
  "ta-IN": "Tamil",
  "ml-IN": "Malayalam",
  "kn-IN": "Kannada",
};

export async function POST(request: NextRequest) {
  let body: { audioBase64?: unknown; mimeType?: unknown; language?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { audioBase64, mimeType, language } = body;

  if (typeof audioBase64 !== "string" || !audioBase64) {
    return NextResponse.json(
      { error: "Audio is required." },
      { status: 400 }
    );
  }

  if (audioBase64.length > 20_000_000) {
    return NextResponse.json(
      { error: "Audio file is too large." },
      { status: 413 }
    );
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

    const audio = Buffer.from(audioBase64, "base64");

    const stt = await client.speechToText.transcribe({
      file: {
        data: audio,
        contentType:
          typeof mimeType === "string" && mimeType ? mimeType : "audio/webm",
        filename: "input.webm",
      },
    });

    const transcript = (stt.transcript ?? "").trim();
    if (!transcript) {
      return NextResponse.json(
        { error: "I couldn't hear anything. Please try speaking again." },
        { status: 422 }
      );
    }

    const langName = LANGUAGE_NAMES[lang];

    const chat = await client.chat.completions({
      model: "sarvam-105b",
      temperature: 0.4,
      reasoning_effort: "low",
      messages: [
        {
          role: "system",
          content: `You are Aura, a warm and friendly AI voice companion inside a smart home. Reply helpfully and naturally to whatever the user says. Always respond in ${langName}, written in the native ${langName} script (Hindi → Devanagari, Tamil → Tamil script, Malayalam → Malayalam script, Kannada → Kannada script). Never write the ${langName} text in Latin/roman script. Keep the answer concise, between one and three sentences.`,
        },
        { role: "user", content: transcript },
      ],
    });

    const response = (chat.choices?.[0]?.message?.content ?? "").trim();

    return NextResponse.json({ transcript, response });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
