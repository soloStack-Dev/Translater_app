import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the SDK BEFORE importing the module under test so the real network
// client is never loaded. We provide a fresh class instance per test below.
vi.mock("sarvamai", () => ({
  SarvamAIClient: vi.fn(),
}));

import { SarvamAIClient } from "sarvamai";

import {
  generateAuraReply,
  synthesizeSpeech,
  transcribeAudio,
} from "@/lib/sarvam";

// Composable fake for the Sarvam client methods used by our helpers.
const clientMocks = {
  completions: vi.fn(),
  transcribe: vi.fn(),
  convert: vi.fn(),
};

let currentClient: Record<string, unknown>;

beforeEach(() => {
  // Each call to createSarvamClient() returns a fresh object wired to
  // `clientMocks`, so assertions can target the exact call the helper made.
  currentClient = {
    chat: { completions: clientMocks.completions },
    speechToText: { transcribe: clientMocks.transcribe },
    textToSpeech: { convert: clientMocks.convert },
  };
  // Regular function (NOT an arrow): `new SarvamAIClient(...)` requires a
  // constructable value, and an arrow function throws "is not a constructor".
  // Returning the object from the constructor makes `new` resolve to it.
  vi.mocked(SarvamAIClient).mockImplementation(function () {
    return currentClient as never;
  });

  // The API key is required by createSarvamClient.
  process.env.SARVAM_API = "test-key";
});

afterEach(() => {
  vi.clearAllMocks();
  delete process.env.SARVAM_API;
});

describe("generateAuraReply", () => {
  it("calls the chat API with the native-script system prompt", async () => {
    clientMocks.completions.mockResolvedValue({
      choices: [{ message: { content: "नमस्ते, कैसे हो?" } }],
    });

    const reply = await generateAuraReply("hi-IN", "hello there");

    expect(reply).toBe("नमस्ते, कैसे हो?");
    // System prompt must force Hindi's native script (Devanagari).
    const messages = clientMocks.completions.mock.calls[0][0].messages;
    expect(messages[0].role).toBe("system");
    expect(messages[0].content).toContain("Devanagari");
    expect(messages[1]).toEqual({ role: "user", content: "hello there" });
  });

  it("throws a readable error when the model returns no content", async () => {
    clientMocks.completions.mockResolvedValue({
      choices: [{ message: { content: "" } }],
    });

    await expect(generateAuraReply("ta-IN", "vanakkam")).rejects.toThrow(
      "empty reply"
    );
  });

  it("throws when the SARVAM_API key is missing", async () => {
    delete process.env.SARVAM_API;
    await expect(generateAuraReply("hi-IN", "x")).rejects.toThrow(
      "SARVAM_API"
    );
  });
});

describe("transcribeAudio", () => {
  it("uploads the buffer with a normalized MIME type and returns the transcript", async () => {
    clientMocks.transcribe.mockResolvedValue({ transcript: "vanakkam" });

    const audio = Buffer.from("wav-data");
    const transcript = await transcribeAudio(audio, "audio/webm;codecs=opus");

    expect(transcript).toBe("vanakkam");
    // The codec parameter must be stripped before upload.
    const file = clientMocks.transcribe.mock.calls[0][0].file;
    expect(file.contentType).toBe("audio/webm");
    expect(file.data).toBe(audio);
    expect(file.filename).toBe("input.webm");
  });

  it("trims whitespace from the returned transcript", async () => {
    clientMocks.transcribe.mockResolvedValue({ transcript: "  ok  " });
    expect(await transcribeAudio(Buffer.from("x"), "audio/webm")).toBe("ok");
  });
});

describe("synthesizeSpeech", () => {
  it("converts text to speech and returns the base64 audio", async () => {
    clientMocks.convert.mockResolvedValue({ audios: ["QUJD"] });

    const audio = await synthesizeSpeech("kn-IN", "ನಮಸ್ಕಾರ");

    expect(audio).toBe("QUJD");
    expect(clientMocks.convert.mock.calls[0][0]).toMatchObject({
      language_code: "kn-IN",
      speaker: "ritu",
      model: "bulbul:v3",
      output_audio_codec: "mp3",
    });
  });

  it("throws when the API returns no audio", async () => {
    clientMocks.convert.mockResolvedValue({ audios: [] });
    await expect(synthesizeSpeech("hi-IN", "x")).rejects.toThrow("No audio");
  });
});