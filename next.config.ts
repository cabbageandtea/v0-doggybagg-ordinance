import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"
import { withWorkflow } from "workflow/next"

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: false },
  images: { unoptimized: true },
  // Prevent bundling workflow/zod so Turbopack/Webpack don't minify into invalid t._parse
  serverExternalPackages: ["zod", "workflow", "@workflow/next", "@workflow/core", "@workflow/world", "@workflow/world-vercel"],
  // Reinforce Webpack usage (Turbopack has known Zod minification issues)
  webpack: (config) => config,
}

const configWithWorkflow = withWorkflow(nextConfig)

export default withSentryConfig(configWithWorkflow, {
  org: process.env.SENTRY_ORG ?? "",
  project: process.env.SENTRY_PROJECT ?? "",
  silent: !process.env.CI,
  widenClientFileUpload: true,
})
