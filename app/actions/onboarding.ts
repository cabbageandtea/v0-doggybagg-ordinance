'use server'

import { createClient } from '@/lib/supabase/server'

export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise'

export interface UserOnboardingProgress {
  has_completed_tour: boolean
  has_added_property: boolean
  has_verified_phone: boolean
  has_viewed_risk_score: boolean
  has_generated_health_check: boolean
}

/** Property limits by tier (from lib/products) */
export const TIER_LIMITS: Record<SubscriptionTier, number> = {
  free: 1,
  starter: 5,
  professional: 10,
  enterprise: 999999,
}

/**
 * Fetch the current user's subscription_tier from profiles.
 * Used by dashboard to show tier-aware UI (hide upgrade prompts, show limits).
 */
export async function getSubscriptionTier(): Promise<{
  tier: SubscriptionTier
  error: string | null
}> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { tier: 'free', error: 'Not authenticated' }

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .maybeSingle()

    const tier = (profile?.subscription_tier as SubscriptionTier) || 'free'
    return { tier, error: null }
  } catch (err) {
    console.error('[onboarding] getSubscriptionTier failed:', err)
    return { tier: 'free', error: 'Failed to load tier' }
  }
}

export type OnboardingMilestone =
  | 'has_completed_tour'
  | 'has_added_property'
  | 'has_verified_phone'
  | 'has_viewed_risk_score'
  | 'has_generated_health_check'

/**
 * Fetch the current user's onboarding progress from user_onboarding table.
 * Used by dashboard layout and UI to highlight next CTA.
 */
export async function getUserOnboardingProgress(): Promise<{
  progress: UserOnboardingProgress | null
  error: string | null
}> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { progress: null, error: 'Not authenticated' }

    const { data, error } = await supabase
      .from('user_onboarding')
      .select('has_completed_tour, has_added_property, has_verified_phone, has_viewed_risk_score, has_generated_health_check')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('[onboarding] Error fetching progress:', error)
      return { progress: null, error: error.message }
    }

    const defaults: UserOnboardingProgress = {
      has_completed_tour: false,
      has_added_property: false,
      has_verified_phone: false,
      has_viewed_risk_score: false,
      has_generated_health_check: false,
    }

    return {
      progress: data
        ? {
            has_completed_tour: data.has_completed_tour ?? false,
            has_added_property: data.has_added_property ?? false,
            has_verified_phone: data.has_verified_phone ?? false,
            has_viewed_risk_score: data.has_viewed_risk_score ?? false,
            has_generated_health_check: data.has_generated_health_check ?? false,
          }
        : defaults,
      error: null,
    }
  } catch (err) {
    console.error('[onboarding] Unexpected error:', err)
    return { progress: null, error: 'Failed to load onboarding progress' }
  }
}

/**
 * Ensure user_onboarding row exists and optionally update a milestone.
 */
export async function ensureOnboardingRow(
  propertiesCount: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const { data: existing } = await supabase
      .from('user_onboarding')
      .select('id, has_added_property')
      .eq('user_id', user.id)
      .maybeSingle()

    const updates: Record<string, unknown> = {}
    if (propertiesCount > 0 && !existing?.has_added_property) {
      updates.has_added_property = true
      updates.first_property_added_at = new Date().toISOString()
    }

    if (existing) {
      if (Object.keys(updates).length > 0) {
        await supabase
          .from('user_onboarding')
          .update(updates)
          .eq('user_id', user.id)
      }
    } else {
      await supabase.from('user_onboarding').insert({
        user_id: user.id,
        ...updates,
      })
    }
    return { success: true }
  } catch (err) {
    console.error('[onboarding] ensureOnboardingRow failed:', err)
    return { success: false, error: 'Failed to update onboarding' }
  }
}

/**
 * Update a specific onboarding milestone.
 */
export async function updateOnboardingMilestone(
  milestone: OnboardingMilestone
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const updates: Record<string, unknown> = { [milestone]: true }
    if (milestone === 'has_completed_tour') {
      updates.tour_completed_at = new Date().toISOString()
    } else if (milestone === 'has_verified_phone') {
      updates.phone_verified_at = new Date().toISOString()
    } else if (milestone === 'has_viewed_risk_score') {
      updates.risk_score_viewed_at = new Date().toISOString()
    } else if (milestone === 'has_generated_health_check') {
      updates.health_check_generated_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('user_onboarding')
      .upsert(
        {
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

    if (error) {
      console.error('[onboarding] updateOnboardingMilestone failed:', error)
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (err) {
    console.error('[onboarding] updateOnboardingMilestone failed:', err)
    return { success: false, error: 'Failed to update milestone' }
  }
}
