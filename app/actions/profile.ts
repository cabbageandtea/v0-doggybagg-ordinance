'use server'

import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Ensures the current user has a row in public.profiles.
 * Call after sign-up or after exchangeCodeForSession so profile exists
 * even if the DB trigger on auth.users was not applied or failed (e.g. RLS).
 * Pass supabase client when calling from auth callback so session is available.
 */
export async function ensureUserProfile(
  supabaseInstance?: SupabaseClient
): Promise<{ ok: boolean; error?: string }> {
  const supabase = supabaseInstance ?? (await createClient())
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'Not authenticated' }
  }

  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      email: user.email ?? null,
      full_name: (user.user_metadata?.full_name as string) ?? null,
      subscription_tier: 'free',
      search_credits: 10,
    },
    { onConflict: 'id' }
  )

  if (error) {
    console.error('[profile] ensureUserProfile failed:', error)
    return { ok: false, error: error.message }
  }

  return { ok: true }
}
