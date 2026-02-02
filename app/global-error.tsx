'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Global error boundary]', error)
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body className="bg-[#0f0f12] text-white font-sans antialiased min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-xl font-bold mb-2">Application error</h1>
          <p className="text-sm text-white/70 mb-6">
            An uncaught error occurred. Please try again or refresh the page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
            >
              Try again
            </button>
            <a
              href="/"
              className="px-4 py-2 rounded-lg border border-white/20 text-white/90 hover:bg-white/10 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
