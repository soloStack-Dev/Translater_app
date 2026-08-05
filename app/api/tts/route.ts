// POST /api/tts — Type-to-Speak
// Request:  { text: string, language: LanguageCode }
// Flow:     1) The LLM understands the input (any language or romanized mix)
//              and writes a spoken-style reply in the selected language.
//           2) TTS turns that reply into speech.
//           3) Only the audio is returned (voice-only response).
import { NextRequest, NextResponse } from "next/server";
import { generateAuraReply, synthesizeSpeech } from "@/lib/sarvam";
import { isLanguageCode } from "@/lib/languages";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // --- 1. Read the JSON body --------------------------------------------------
  let body: { text?: unknown; language?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // --- 2. Validate the input ---------------------------------------------------
  const { text, language } = body;
  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "Text is required." }, { status: 400 });
  }
  if (typeof language !== "string" || !isLanguageCode(language)) {
    return NextResponse.json(
      { error: "Unsupported language. Choose Hindi, Tamil, Malayalam or Kannada." },
      { status: 400 }
    );
  }

  try {
    // --- 3. Let the LLM answer, then speak that answer --------------------------
    const reply = await generateAuraReply(language, text);
    const audioBase64 = await synthesizeSpeech(language, reply);

    // --- 4. Return voice only ---------------------------------------------------
    return NextResponse.json({ audioBase64 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
