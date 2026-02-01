import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ensureUserProfile } from '@/app/actions/profile'
import { sendWelcomeEmail } from '@/lib/emails'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin

  if (!code) {
    return NextResponse.redirect(new URL('/', baseUrl))
  }

  const supabase = await createClient()
  const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession failed:', error.message)
    const signInUrl = new URL('/auth/sign-in', baseUrl)
    signInUrl.searchParams.set('error', 'auth_callback_failed')
    return NextResponse.redirect(signInUrl)
  }

  if (session?.user) {
    await ensureUserProfile(supabase)
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('welcome_email_sent_at')
        .eq('id', session.user.id)
        .single()
      if (profile?.welcome_email_sent_at == null && session.user.email) {
        const { ok } = await sendWelcomeEmail(session.user.email, session.user.user_metadata?.full_name as string | undefined)
        if (ok) {
          await supabase.from('profiles').update({ welcome_email_sent_at: new Date().toISOString() }).eq('id', session.user.id)
        }
      }
    } catch {
      // welcome_email_sent_at column may not exist until 011_notification_preferences.sql is run
    }
  }

  const redirectPath = requestUrl.searchParams.get("redirect")
  const safeRedirect =
    redirectPath &&
    redirectPath.startsWith("/") &&
    !redirectPath.includes("//")
      ? redirectPath
      : "/dashboard"

  return NextResponse.redirect(new URL(safeRedirect, baseUrl))
}
