/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from "vitest";

// Mock the Sarvam layer so route tests never hit the network.
vi.mock("@/lib/sarvam", () => ({
  generateAuraReply: vi.fn(),
  synthesizeSpeech: vi.fn(),
  transcribeAudio: vi.fn(),
}));

import { POST as ttsPost } from "@/app/api/tts/route";
import { NextRequest } from "next/server";
import { generateAuraReply, synthesizeSpeech } from "@/lib/sarvam";

/** Build a real NextRequest for POST /api/tts (matches the route signature). */
function ttsRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/tts", () => {
  it("returns 400 for a malformed JSON body", async () => {
    const res = await ttsPost(ttsRequest("not-json"));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid JSON body." });
  });

  it("returns 400 when text is missing", async () => {
    const res = await ttsPost(ttsRequest({ language: "hi-IN" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for an unsupported language", async () => {
    const res = await ttsPost(ttsRequest({ text: "hello", language: "xx-XX" }));
    expect(res.status).toBe(400);
  });

  it("returns the base64 audio for a valid request (voice-only)", async () => {
    vi.mocked(generateAuraReply).mockResolvedValue("हैलो");
    vi.mocked(synthesizeSpeech).mockResolvedValue("QUJD");

    const res = await ttsPost(
      ttsRequest({ text: "hello", language: "hi-IN" })
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    // Only audio is returned — the LLM text must never leak to the client.
    expect(data).toEqual({ audioBase64: "QUJD" });
    expect(generateAuraReply).toHaveBeenCalledWith("hi-IN", "hello");
    expect(synthesizeSpeech).toHaveBeenCalledWith("hi-IN", "हैलो");
  });

  it("returns 500 with a readable message when the LLM fails", async () => {
    vi.mocked(generateAuraReply).mockRejectedValue(new Error("model down"));

    const res = await ttsPost(ttsRequest({ text: "hi", language: "ta-IN" }));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "model down" });
  });

  it("does not call the SDK when validation fails", async () => {
    await ttsPost(ttsRequest({ text: "   ", language: "hi-IN" }));
    expect(generateAuraReply).not.toHaveBeenCalled();
    expect(synthesizeSpeech).not.toHaveBeenCalled();
  });
});