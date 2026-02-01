import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

/** CSP directives for strict policy. Nonce injected per-request for inline scripts (gtag, Meta Pixel). */
function getCspHeader(nonce: string): string {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'nonce-" + nonce + "' https://www.googletagmanager.com https://connect.facebook.net https://us-assets.i.posthog.com https://*.posthog.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://*.google.com https://*.facebook.net https://*.facebook.com https://us.i.posthog.com https://*.posthog.com https://vitals.vercel-insights.com https://*.supabase.co",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
  ]
  return directives.join("; ")
}

export async function updateSession(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64")
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-nonce", nonce)

  let response = NextResponse.next({
    request: { headers: requestHeaders },
  })
  response.headers.set("Content-Security-Policy", getCspHeader(nonce))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          response = NextResponse.next({
            request: { headers: requestHeaders },
          })
          response.headers.set("Content-Security-Policy", getCspHeader(nonce))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isProtected =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/upload') ||
    pathname.startsWith('/checkout')

  if (isProtected && !user) {
    const signInUrl = new URL('/auth/sign-in', request.url)
    signInUrl.searchParams.set('redirect', pathname)
    const redirectResponse = NextResponse.redirect(signInUrl)
    redirectResponse.headers.set("Content-Security-Policy", getCspHeader(nonce))
    return redirectResponse
  }

  return response
}
