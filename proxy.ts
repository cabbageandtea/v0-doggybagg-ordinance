import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  // Strict early return: do not execute any logic for workflow API (defense in depth)
  if (
    request.nextUrl.pathname.startsWith('/.well-known/workflow') ||
    request.nextUrl.pathname.startsWith('/api/workflow')
  ) {
    // Debug: log x-vercel-* headers when DEBUG_WORKFLOW_HEADERS=1 (helps diagnose auth/parsing)
    if (process.env.DEBUG_WORKFLOW_HEADERS === "1") {
      const vercelHeaders: Record<string, string> = {}
      request.headers.forEach((v, k) => {
        if (k.toLowerCase().startsWith("x-vercel")) vercelHeaders[k] = v
      })
      console.warn("[workflow] workflow request headers:", JSON.stringify(vercelHeaders))
    }
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
     * - .well-known/workflow, /api/workflow (Workflow DevKit API – must bypass proxy to avoid "Failed to parse server response")
     */
    '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|\\.well-known|api/workflow|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
