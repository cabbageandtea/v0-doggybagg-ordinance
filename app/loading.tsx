'use client';

import { Skeleton } from "@/components/ui/skeleton"
/**
 * Standardized App Loading Skeleton
 * Resolves the Suspense boundary requirement for 'useSearchParams()'
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header Skeleton */}
      <div className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Skeleton className="h-8 w-[120px]" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-[80px]" />
            <Skeleton className="h-8 w-[80px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </div>
      </div>
      
      {/* Main Content Skeleton */}
      <div className="flex-1 space-y-8 p-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-4 w-[400px]" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
