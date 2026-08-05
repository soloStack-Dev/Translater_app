// POST /api/chat — Speak-to-Reply
// Request:  { audioBase64: string, mimeType?: string, language: LanguageCode }
// Flow:     1) Speech-to-text transcribes the recorded audio.
//           2) The LLM understands the transcript (any language / romanized)
//              and replies in the selected language (native script).
//           3) Returns { transcript, response } so the page can show both.
import { NextRequest, NextResponse } from "next/server";
import { generateAuraReply, transcribeAudio } from "@/lib/sarvam";
import { isLanguageCode } from "@/lib/languages";

export const runtime = "nodejs";

// Reject huge payloads before they reach the transcription API.
const MAX_AUDIO_BYTES = 20_000_000;

export async function POST(request: NextRequest) {
  // --- 1. Read the JSON body --------------------------------------------------
  let body: { audioBase64?: unknown; mimeType?: unknown; language?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // --- 2. Validate the input ----------------------------------------------------
  const { audioBase64, mimeType, language } = body;
  if (typeof audioBase64 !== "string" || !audioBase64) {
    return NextResponse.json({ error: "Audio is required." }, { status: 400 });
  }
  if (audioBase64.length > MAX_AUDIO_BYTES) {
    return NextResponse.json({ error: "Audio file is too large." }, { status: 413 });
  }
  if (typeof language !== "string" || !isLanguageCode(language)) {
    return NextResponse.json(
      { error: "Unsupported language. Choose Hindi, Tamil, Malayalam or Kannada." },
      { status: 400 }
    );
  }

  try {
    // --- 3. Decode + transcribe the recording ------------------------------------
    const audio = Buffer.from(audioBase64, "base64");
    const transcript = await transcribeAudio(
      audio,
      typeof mimeType === "string" ? mimeType : "audio/webm"
    );

    // --- 4. Nothing heard? Ask the user to try again ------------------------------
    if (!transcript) {
      return NextResponse.json(
        { error: "I couldn't hear anything. Please try speaking again." },
        { status: 422 }
      );
    }

    // --- 5. LLM answers in the selected language -----------------------------------
    const response = await generateAuraReply(language, transcript);

    // --- 6. Return the transcript + reply -------------------------------------------
    return NextResponse.json({ transcript, response });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
