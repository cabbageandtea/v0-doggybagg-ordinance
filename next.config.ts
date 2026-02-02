import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"
import { withWorkflow } from "workflow/next"

const WORKFLOW_EXTERNALS = [
  "zod",
  "workflow",
  "@workflow/next",
  "@workflow/core",
  "@workflow/world",
  "@workflow/world-vercel",
] as const

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: false },
  images: { unoptimized: true },
  // Aggressive no-bundle: prevent workflow/zod from being minified into invalid t._parse
  serverExternalPackages: [...WORKFLOW_EXTERNALS],
  webpack: (config, { isServer }) => {
    // Disable server minification to avoid Terser/SWC renaming Zod's _parse
    if (isServer && config.optimization) {
      config.optimization = { ...config.optimization, minimize: false }
    }
    return config
  },
}

const configWithWorkflow = withWorkflow(nextConfig)

export default withSentryConfig(configWithWorkflow, {
  org: process.env.SENTRY_ORG ?? "",
  project: process.env.SENTRY_PROJECT ?? "",
  silent: !process.env.CI,
  widenClientFileUpload: true,
})
