/**
 * Analytics helpers for conversion tracking.
 * PostHog: Set NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST (optional) to enable.
 * Call trackAddProperty from components that have access to PostHog (inside PostHogProvider).
 */

import posthog from "posthog-js"

export function trackAddProperty(props?: { source?: "dialog" | "upload"; count?: number }) {
  try {
    if (posthog && typeof posthog.capture === "function") {
      posthog.capture("add_property", props)
    }
  } catch {
    // No-op if PostHog not initialized
  }
}

/** Track when user scrolls to #neighborhood-watch (has_viewed_risk_score milestone) */
export function trackViewedRiskScore() {
  try {
    if (posthog && typeof posthog.capture === "function") {
      posthog.capture("has_viewed_risk_score")
    }
  } catch {
    // No-op if PostHog not initialized
  }
}
