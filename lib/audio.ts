// =============================================================================
// Audio helpers shared by the voice page and the /api/chat flow.
// Extracted into a small pure module so each helper can be unit-tested
// independently (no browser APIs at module load time).
// =============================================================================

/**
 * Convert a Blob into a plain base64 string (without the data-URL prefix).
 * Example: FileReader on "data:audio/webm;base64,AAAA" -> "AAAA".
 *
 * @throws If the blob cannot be read (rejects with the FileReader error).
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // FileReader returns "data:<mime>;base64,<payload>" — keep only payload.
      resolve(((reader.result as string) ?? "").split(",")[1] ?? "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * Strip MediaRecorder MIME parameters from a type string.
 *
 * Chrome reports "audio/webm;codecs=opus", but the Sarvam STT API only accepts
 * the bare MIME type ("audio/webm"). Falls back to "audio/webm" when empty.
 */
export function normalizeMimeType(mimeType: string): string {
  return mimeType.split(";")[0].trim() || "audio/webm";
}

/**
 * Turn a microphone error into a friendly, human-readable message.
 * `NotAllowedError` (denied permission) is the most common case.
 */
export function formatMicError(error: Error): string {
  return error.name === "NotAllowedError"
    ? "Microphone access was denied. Allow the microphone and try again."
    : error.message;
}