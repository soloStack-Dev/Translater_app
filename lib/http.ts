import { NextResponse } from "next/server";

/**
 * Small helpers shared by the API routes so validation error handling reads
 * the same everywhere (~DRY) and each route stays short.
 */

/** Shorthand for a JSON error response: `{ error: message }` + status code. */
export function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Safely read and parse a JSON request body.
 *
 * @returns the parsed body, or `null` when the body is not valid JSON.
 */
export async function readJsonBody(
  request: Request
): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    // `json()` can resolve to any JSON value; only objects are valid here.
    return body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}