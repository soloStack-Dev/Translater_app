import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Sarvam AI SDK reads the API key from the environment, so it must
  // never be bundled for the browser; this keeps it server-only.
  serverExternalPackages: ["sarvamai"],

  // Remove the information-disclosing "X-Powered-By: Next.js" header.
  poweredByHeader: false,

  // Basic security headers (CSP is intentionally not set here — the voice
  // page streams inline base64 audio, which requires careful handling).
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(self), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;