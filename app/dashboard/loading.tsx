'use client';

import { Skeleton } from "@/components/ui/skeleton"
/**
 * Standardized Dashboard Loading Skeleton
 * Resolves the Suspense boundary requirement for 'useSearchParams()'
 */
export default function Loading() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-8 w-[150px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="col-span-4 h-[400px] w-full" />
        <Skeleton className="col-span-3 h-[400px] w-full" />
      </div>
    </div>
  )
}
