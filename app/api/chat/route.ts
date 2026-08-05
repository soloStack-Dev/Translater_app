import { NextRequest, NextResponse } from "next/server";
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  auraSystemPrompt,
  createSarvamClient,
} from "@/lib/sarvam";

export const runtime = "nodejs";

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

  try {
    const client = createSarvamClient();
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

    const chat = await client.chat.completions({
      model: "sarvam-105b",
      temperature: 0.4,
      reasoning_effort: "low",
      messages: [
        { role: "system", content: auraSystemPrompt(lang) },
        { role: "user", content: transcript },
      ],
    });

    const response = (chat.choices?.[0]?.message?.content ?? "").trim();
    if (!response) {
      return NextResponse.json(
        { error: "The model produced an empty reply. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ transcript, response });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
