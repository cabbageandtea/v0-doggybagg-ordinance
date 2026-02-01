"use client"

import { PostHogProvider as PHProvider } from "posthog-js/react"

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (!key) return <>{children}</>

  return (
    <PHProvider
      apiKey={key}
      options={{
        api_host: host,
        person_profiles: "identified_only",
      }}
    >
      {children}
    </PHProvider>
  )
}
