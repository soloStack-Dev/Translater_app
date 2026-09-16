import { afterEach, describe, expect, it, vi } from "vitest";

import {
  blobToBase64,
  formatMicError,
  normalizeMimeType,
} from "@/lib/audio";

describe("normalizeMimeType", () => {
  it("keeps a bare MIME type untouched", () => {
    expect(normalizeMimeType("audio/webm")).toBe("audio/webm");
    expect(normalizeMimeType("audio/mp4")).toBe("audio/mp4");
  });

  it("strips codec parameters (Chrome's MediaRecorder format)", () => {
    // Sarvam's STT rejects "audio/webm;codecs=opus".
    expect(normalizeMimeType("audio/webm;codecs=opus")).toBe("audio/webm");
    expect(normalizeMimeType("audio/mp4;codecs=mp4a.40.2")).toBe("audio/mp4");
  });

  it("falls back to audio/webm for an empty / whitespace type", () => {
    expect(normalizeMimeType("")).toBe("audio/webm");
    expect(normalizeMimeType("   ")).toBe("audio/webm");
  });
});

describe("formatMicError", () => {
  it("explains permission denial in plain words", () => {
    const err = new Error("Permission denied");
    err.name = "NotAllowedError";
    expect(formatMicError(err)).toContain("Microphone access was denied");
  });

  it("passes through any other error message", () => {
    expect(formatMicError(new Error("boom"))).toBe("boom");
  });
});

describe("blobToBase64", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("encodes a blob without the data-URL prefix", async () => {
    const blob = new Blob([new Uint8Array([1, 2, 3])], {
      type: "audio/webm",
    });
    const base64 = await blobToBase64(blob);
    // Blob of [1,2,3] -> "AQID" in base64 (data-URL prefix stripped).
    expect(base64).toBe("AQID");
  });

  it("rejects when the FileReader errors", async () => {
    const blob = new Blob(["x"]);
    // Force FileReader.readAsDataURL to error by stubbing it.
    vi.spyOn(FileReader.prototype, "readAsDataURL").mockImplementation(
      function (this: FileReader) {
        setTimeout(() => {
      // Node's global ProgressEvent isn't DOM-generic; cast to the DOM shape.
      const ev = new ProgressEvent("error") as unknown as ProgressEvent<FileReader>;
      this.onerror?.(ev);
    }, 0);
      }
    );
    await expect(blobToBase64(blob)).rejects.toThrow("read failed");
  });
});