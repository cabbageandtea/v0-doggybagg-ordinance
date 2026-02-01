"use client"

import { useQuery } from "@tanstack/react-query"
import { getSubscriptionTier, TIER_LIMITS, type SubscriptionTier } from "@/app/actions/onboarding"

export const subscriptionTierKeys = {
  all: ["subscriptionTier"] as const,
}

export function useSubscriptionTier() {
  return useQuery({
    queryKey: subscriptionTierKeys.all,
    queryFn: async () => {
      const result = await getSubscriptionTier()
      if (result.error) throw new Error(result.error)
      return result.tier
    },
  })
}

export function getTierLimit(tier: SubscriptionTier): number {
  return TIER_LIMITS[tier] ?? 1
}

export function isPaidTier(tier: SubscriptionTier): boolean {
  return tier === "starter" || tier === "professional" || tier === "enterprise"
}
