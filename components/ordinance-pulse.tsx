"use client"

import { useState, useEffect } from "react"

/** Subtle "live" badge — ordinance intelligence updated daily */
export function OrdinancePulse() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span
        className="relative flex size-2"
        aria-hidden
      >
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-30" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>
      Ordinance intelligence updated daily
    </span>
  )
}
