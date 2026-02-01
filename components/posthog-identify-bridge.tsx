"use client"

import { useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { identifyUser } from "@/lib/analytics"

/**
 * Identifies the current user with PostHog when authenticated.
 * Mount once in root layout to bridge anonymous → known data across all pages.
 * Safe for unauthenticated users (no-op when no session).
 */
export function PostHogIdentifyBridge() {
  const identified = useRef<string | null>(null)

  useEffect(() => {
    const run = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.id && identified.current !== user.id) {
        identified.current = user.id
        identifyUser(user.id)
      }
    }
    void run()
  }, [])

  return null
}
