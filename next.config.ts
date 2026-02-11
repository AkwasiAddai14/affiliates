import type { NextConfig } from "next";

/**
 * Clerk requires NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY at build time (Next.js inlines NEXT_PUBLIC_*).
 * - Local: set in .env or .env.local
 * - Firebase App Hosting: set in apphosting.yaml via secrets (see apphosting.yaml comments)
 * - Other clouds: ensure the env var is passed to the build step (e.g. Cloud Build substitution)
 */
const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
