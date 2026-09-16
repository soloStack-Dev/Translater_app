// POST /api/chat — Speak-to-Reply
// -----------------------------------------------------------------------------
// Request:  { audioBase64: string, mimeType?: string, language: LanguageCode }
// Flow:     1. Speech-to-text transcribes the recorded audio.
//           2. The LLM understands the transcript (any language / romanized)
//              and replies in the selected language's native script.
//           3. Returns { transcript, response } so the page can show both.
// -----------------------------------------------------------------------------
import { NextRequest, NextResponse } from "next/server";

import { generateAuraReply, transcribeAudio } from "@/lib/sarvam";
import { isLanguageCode } from "@/lib/languages";
import { jsonError, readJsonBody } from "@/lib/http";

// This route runs locally on Node (the Sarvam SDK is not edge-compatible).
export const runtime = "nodejs";

// Reject huge payloads before they reach the transcription API.
const MAX_AUDIO_BYTES = 20_000_000; // 20 MB of base64 text
const DEFAULT_MIME_TYPE = "audio/webm";

export async function POST(request: NextRequest) {
  // 1. Parse + validate the request ----------------------------------------
  const body = await readJsonBody(request);
  if (!body) {
    return jsonError("Invalid JSON body.", 400);
  }

  const { audioBase64, mimeType, language } = body;

  // Audio must be a non-empty base64 string.
  if (typeof audioBase64 !== "string" || !audioBase64) {
    return jsonError("Audio is required.", 400);
  }

  // Enforce a size cap so a single request cannot blow up memory.
  if (audioBase64.length > MAX_AUDIO_BYTES) {
    return jsonError("Audio file is too large.", 413);
  }

  // Language must be one of the four supported codes.
  if (typeof language !== "string" || !isLanguageCode(language)) {
    return jsonError(
      "Unsupported language. Choose Hindi, Tamil, Malayalam or Kannada.",
      400
    );
  }

  try {
    // 2. Decode + transcribe the recording (default MIME type when absent) ---
    const audio = Buffer.from(audioBase64, "base64");
    const transcript = await transcribeAudio(
      audio,
      typeof mimeType === "string" ? mimeType : DEFAULT_MIME_TYPE
    );

    // 3. Nothing heard → ask the user to try again ---------------------------
    // (A mocked/STT response of only whitespace counts as "nothing".)
    const trimmedTranscript = transcript.trim();
    if (!trimmedTranscript) {
      return jsonError("I couldn't hear anything. Please try speaking again.", 422);
    }

    // 4. LLM answers in the selected language ----------------------------------
    const response = await generateAuraReply(language, trimmedTranscript);

    // 5. Return the transcript + reply as UTF-8 JSON ---------------------------
    return NextResponse.json({ transcript, response });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return jsonError(message, 500);
  }
}