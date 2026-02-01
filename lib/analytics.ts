/**
 * Analytics helpers for conversion tracking.
 * PostHog: Set NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST (optional) to enable.
 * Call trackAddProperty from components that have access to PostHog (inside PostHogProvider).
 * Use identifyUser(userId) when user context is available to bridge anonymous → known data.
 */

import posthog from "posthog-js"

/** Identify user by Supabase UUID; call when user context is available (auth, dashboard) */
export function identifyUser(userId: string) {
  try {
    if (posthog && typeof posthog.identify === "function") {
      posthog.identify(userId)
    }
  } catch {
    // No-op if PostHog not initialized
  }
}

function captureWithIdentify(event: string, props?: Record<string, unknown>, userId?: string) {
  try {
    if (!posthog || typeof posthog.capture !== "function") return
    if (userId) identifyUser(userId)
    posthog.capture(event, props)
  } catch {
    // No-op
  }
}

export function trackAddProperty(props?: { source?: "dialog" | "upload"; count?: number }, userId?: string) {
  captureWithIdentify("add_property", props as Record<string, unknown>, userId)
}

/** Track when user scrolls to #neighborhood-watch (has_viewed_risk_score milestone) */
export function trackViewedRiskScore(userId?: string) {
  captureWithIdentify("has_viewed_risk_score", undefined, userId)
}

/** Aha! moment events – wire in respective components; pass userId when available */
export function trackSignedUp(userId?: string) {
  captureWithIdentify("signed_up", undefined, userId)
}

export function trackSignedIn(userId?: string) {
  captureWithIdentify("signed_in", undefined, userId)
}

export function trackCheckoutStarted(props?: { productId: string }, userId?: string) {
  captureWithIdentify("checkout_started", props as Record<string, unknown>, userId)
}

/** Prefer server-side capture in webhook; client fallback only if needed */
export function trackCheckoutCompleted(props?: { productId: string }, userId?: string) {
  captureWithIdentify("checkout_completed", props as Record<string, unknown>, userId)
}

export function trackOnboardingTourCompleted(userId?: string) {
  captureWithIdentify("onboarding_tour_completed", undefined, userId)
}

export function trackHealthCheckGenerated(userId?: string) {
  captureWithIdentify("health_check_generated", undefined, userId)
}

export function trackPhoneVerified(userId?: string) {
  captureWithIdentify("phone_verified", undefined, userId)
}

export function trackFeedbackClicked(props?: { source: string }, userId?: string) {
  captureWithIdentify("feedback_clicked", props as Record<string, unknown>, userId)
}

/** Cookie consent given – fired when user accepts cookie banner */
export function trackConsentGiven() {
  captureWithIdentify("consent_given", undefined, undefined)
}
