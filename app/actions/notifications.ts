'use server'

import { createClient } from '@/lib/supabase/server'
import { sendComplianceViolationEmail } from '@/lib/emails'

/**
 * Send compliance violation notification email.
 * Respects user notification preferences (profiles.email_notifications).
 * Call when a new compliance violation is detected for a user's property.
 */
export async function sendEmailNotification(
  userId: string,
  opts: { propertyAddress: string; violationType?: string }
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('email, email_notifications')
    .eq('id', userId)
    .single()

  if (!profile?.email) return { ok: false, error: 'No email for user' }
  if (profile.email_notifications === false) return { ok: true } // opted out, no error

  return sendComplianceViolationEmail(profile.email, opts)
}
