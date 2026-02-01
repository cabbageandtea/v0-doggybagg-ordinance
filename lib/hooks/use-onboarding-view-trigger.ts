"use client"

import { useEffect, useRef } from "react"
import { updateOnboardingMilestone } from "@/app/actions/onboarding"

/**
 * Zero-effort onboarding trigger: fires has_viewed_risk_score when the user
 * scrolls to the target section. No click required—viewing is the trigger.
 *
 * SSR-safe: All DOM access is inside useEffect (client-only). Observer
 * disconnects immediately after first successful fire to preserve performance.
 */
export function useOnboardingViewTrigger(
  elementId: string = "neighborhood-watch",
  onFired?: () => void
) {
  const hasFired = useRef(false)
  const onFiredRef = useRef(onFired)
  onFiredRef.current = onFired

  useEffect(() => {
    if (typeof document === "undefined") return
    if (hasFired.current) return

    const el = document.getElementById(elementId)
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!entry?.isIntersecting || hasFired.current) return
        if (entry.intersectionRatio < 0.2) return

        hasFired.current = true
        observer.disconnect()
        void updateOnboardingMilestone("has_viewed_risk_score").then(() => {
          onFiredRef.current?.()
        })
      },
      { threshold: 0.2, rootMargin: "0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [elementId])
}
