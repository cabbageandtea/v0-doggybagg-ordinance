import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  // Bypass auth for cron endpoints: secured by CRON_SECRET in route handler
  if (request.nextUrl.pathname.startsWith('/api/cron/')) {
    return NextResponse.next()
  }
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico, images
     * - sitemap.xml, robots.txt (SEO – bypass proxy to avoid "Couldn't fetch" in GSC)
     * - api/cron (Vercel Cron – secured by CRON_SECRET in route handlers)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|api/cron|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
