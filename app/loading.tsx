"use client"

import { Skeleton } from "@/components/ui/skeleton"

/**
 * Branded loading skeleton for perceived performance.
 * Uses liquid-glass styling and Ordinance.ai / DoggyBagg visual identity.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header Skeleton */}
      <div className="liquid-glass border-b border-border/50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-5 w-[140px]" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <Skeleton className="mx-auto h-4 w-48 rounded-full" />
          <Skeleton className="mx-auto h-12 w-full max-w-2xl" />
          <Skeleton className="mx-auto h-6 w-3/4" />
          <div className="flex justify-center gap-4 pt-4">
            <Skeleton className="h-12 w-48 rounded-xl" />
            <Skeleton className="h-12 w-40 rounded-xl" />
          </div>
          <div className="grid grid-cols-3 gap-4 pt-12">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="liquid-glass h-24 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="container mx-auto px-4 pb-16">
        <div className="mb-8 space-y-2 text-center">
          <Skeleton className="mx-auto h-8 w-64" />
          <Skeleton className="mx-auto h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:auto-rows-[180px]">
          {[...Array(8)].map((_, i) => (
            <Skeleton
              key={i}
              className="liquid-glass h-full min-h-[160px] rounded-2xl"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
