"use client"

import { ErrorBoundary } from "react-error-boundary"
import { AlertTriangle } from "lucide-react"

function SectionFallback() {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
      <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-destructive" />
      <p className="text-sm text-muted-foreground">This section couldn&apos;t load. Refresh the page to try again.</p>
    </div>
  )
}

export function SectionErrorBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  return (
    <ErrorBoundary fallbackRender={() => (fallback ?? <SectionFallback />)}>
      {children}
    </ErrorBoundary>
  )
}
