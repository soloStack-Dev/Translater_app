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

import { POST as chatPost } from "@/app/api/chat/route";
import { NextRequest } from "next/server";
import { generateAuraReply, transcribeAudio } from "@/lib/sarvam";

/** Build a real NextRequest for POST /api/chat (matches the route signature). */
function chatRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/chat", () => {
  it("returns 400 for a malformed JSON body", async () => {
    const res = await chatPost(chatRequest("nope"));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid JSON body." });
  });

  it("returns 400 when audio is missing", async () => {
    const res = await chatPost(chatRequest({ language: "hi-IN" }));
    expect(res.status).toBe(400);
  });

  it("returns 413 when audio exceeds the 20 MB cap", async () => {
    const huge = "a".repeat(20_000_001); // one char over the limit
    const res = await chatPost(
      chatRequest({ audioBase64: huge, language: "hi-IN" })
    );
    expect(res.status).toBe(413);
    // Oversized payloads should not reach transcription.
    expect(transcribeAudio).not.toHaveBeenCalled();
  });

  it("returns 400 for an unsupported language", async () => {
    const res = await chatPost(
      chatRequest({ audioBase64: "QUJD", language: "en-US" })
    );
    expect(res.status).toBe(400);
  });

  it("returns 422 when nothing was transcribed", async () => {
    vi.mocked(transcribeAudio).mockResolvedValue("   ");

    const res = await chatPost(
      chatRequest({ audioBase64: "QUJD", language: "hi-IN" })
    );
    expect(res.status).toBe(422);
    expect(generateAuraReply).not.toHaveBeenCalled();
  });

  it("returns the transcript + reply for a valid recording", async () => {
    const audio = Buffer.from("fake-wav").toString("base64");
    vi.mocked(transcribeAudio).mockResolvedValue("vanakkam");
    vi.mocked(generateAuraReply).mockResolvedValue("வணக்கம்!");

    const res = await chatPost(
      chatRequest({ audioBase64: audio, mimeType: "audio/webm;codecs=opus", language: "ta-IN" })
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      transcript: "vanakkam",
      response: "வணக்கம்!",
    });
    // MIME parameters must be normalized before upload.
    expect(transcribeAudio).toHaveBeenCalledWith(expect.any(Buffer), "audio/webm;codecs=opus");
    expect(generateAuraReply).toHaveBeenCalledWith("ta-IN", "vanakkam");
  });

  it("defaults the MIME type to audio/webm when omitted", async () => {
    vi.mocked(transcribeAudio).mockResolvedValue("hi");
    vi.mocked(generateAuraReply).mockResolvedValue("yo");

    const audio = Buffer.from("wav").toString("base64");
    await chatPost(chatRequest({ audioBase64: audio, language: "kn-IN" }));

    expect(transcribeAudio).toHaveBeenCalledWith(expect.any(Buffer), "audio/webm");
  });

  it("returns 500 with a readable message when transcription fails", async () => {
    vi.mocked(transcribeAudio).mockRejectedValue(new Error("stt broken"));

    const res = await chatPost(
      chatRequest({ audioBase64: "QUJD", language: "ml-IN" })
    );
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "stt broken" });
  });
});