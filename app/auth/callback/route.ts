import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ensureUserProfile } from '@/app/actions/profile'

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

  // Use the same supabase instance (with session) so ensureUserProfile sees the user
  if (session?.user) {
    await ensureUserProfile(supabase)
  }

  return NextResponse.redirect(new URL('/dashboard', baseUrl))
}
