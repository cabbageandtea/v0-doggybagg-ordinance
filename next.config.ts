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
  trailingSlash: false,
  // Aggressive: exclude zod from tracer so Vercel uses raw node_modules at runtime (not bundled/mangled)
  outputFileTracingExcludes: {
    "*": ["**/node_modules/zod/**/*"],
  },
  // Alternate path for Workflow API (v5-style); Vercel engine may prefer this over .well-known
  async rewrites() {
    return [
      { source: "/api/workflow/v1/:path*", destination: "/.well-known/workflow/v1/:path*" },
    ]
  },
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
