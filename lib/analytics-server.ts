/**
 * Server-side analytics (PostHog Node SDK).
 * Use for webhook handlers, API routes, server actions—never in client components.
 */

import { PostHog } from "posthog-node"

let client: PostHog | null = null

function getClient(): PostHog | null {
  if (client) return client
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return null
  client = new PostHog(key, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
  })
  return client
}

/** Server-side: capture checkout_completed with user ID for reliable attribution */
export function captureCheckoutCompletedServer(
  distinctId: string,
  props?: { productId?: string }
) {
  try {
    const c = getClient()
    if (c) {
      c.capture({
        distinctId,
        event: "checkout_completed",
        properties: props,
      })
    }
  } catch {
    // No-op
  }
}
