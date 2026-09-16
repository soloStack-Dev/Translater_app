// POST /api/tts — Type-to-Speak
// -----------------------------------------------------------------------------
// Request:  { text: string, language: LanguageCode }
// Flow:     1. The LLM understands the input (any language or romanized mix)
//              and writes a spoken-style reply in the selected language.
//           2. TTS turns that reply into speech.
//           3. Only the audio is returned (voice-only response).
// -----------------------------------------------------------------------------
import { NextRequest, NextResponse } from "next/server";

import { generateAuraReply, synthesizeSpeech } from "@/lib/sarvam";
import { isLanguageCode } from "@/lib/languages";
import { jsonError, readJsonBody } from "@/lib/http";

// This route runs locally on Node (the Sarvam SDK is not edge-compatible).
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // 1. Parse + validate the request ----------------------------------------
  const body = await readJsonBody(request);
  if (!body) {
    return jsonError("Invalid JSON body.", 400);
  }

  const { text, language } = body;

  // Text must be a non-empty string.
  if (typeof text !== "string" || !text.trim()) {
    return jsonError("Text is required.", 400);
  }

  // Language must be one of the four supported codes.
  if (typeof language !== "string" || !isLanguageCode(language)) {
    return jsonError(
      "Unsupported language. Choose Hindi, Tamil, Malayalam or Kannada.",
      400
    );
  }

  try {
    // 2. Let the LLM answer, then speak that answer -------------------------
    const reply = await generateAuraReply(language, text);
    const audioBase64 = await synthesizeSpeech(language, reply);

    // 3. Return voice only (the written reply is never exposed to the client).
    return NextResponse.json({ audioBase64 });
  } catch (error) {
    // 4. Surface a readable message without leaking internals.
    const message = error instanceof Error ? error.message : "Unexpected error";
    return jsonError(message, 500);
  }
}