import type { NextConfig } from "next";

// Static export served by a Cloudflare Worker (see wrangler.jsonc and worker/index.ts).
// Security and cache headers live in public/_headers.
const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
  agentRules: false,
  images: { unoptimized: true },
};

export default nextConfig;
