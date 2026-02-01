"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { getUserOnboardingProgress, type UserOnboardingProgress } from "@/app/actions/onboarding"

interface OnboardingContextValue {
  progress: UserOnboardingProgress | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  /** Primary CTA to highlight: the next incomplete milestone */
  primaryCta: "add_property" | "verify_phone" | "view_risk" | "generate_health_check" | null
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider")
  return ctx
}

function getPrimaryCta(progress: UserOnboardingProgress | null): OnboardingContextValue["primaryCta"] {
  if (!progress) return "add_property"
  if (!progress.has_added_property) return "add_property"
  if (!progress.has_verified_phone) return "verify_phone"
  if (!progress.has_viewed_risk_score) return "view_risk"
  if (!progress.has_generated_health_check) return "generate_health_check"
  return null
}

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserOnboardingProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const result = await getUserOnboardingProgress()
    if (result.error) setError(result.error)
    else setProgress(result.progress)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  const primaryCta = getPrimaryCta(progress)

  const value: OnboardingContextValue = {
    progress,
    isLoading,
    error,
    refetch,
    primaryCta,
  }

  return (
    <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
  )
}
