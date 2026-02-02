import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"
import { withWorkflow } from "workflow/next"

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: false },
  images: { unoptimized: true },
}

const configWithWorkflow = withWorkflow(nextConfig)

export default withSentryConfig(configWithWorkflow, {
  org: process.env.SENTRY_ORG ?? "",
  project: process.env.SENTRY_PROJECT ?? "",
  silent: !process.env.CI,
  widenClientFileUpload: true,
})
