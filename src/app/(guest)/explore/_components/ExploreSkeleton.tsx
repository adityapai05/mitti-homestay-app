"use client";

import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function ExploreSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-md"
        >
          {/* Image skeleton */}
          <div className="relative aspect-[4/3] w-full">
            <Skeleton className="absolute inset-0" />
          </div>

          {/* Meta skeleton */}
          <div className="flex items-center justify-between px-4 py-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-14" />
            </div>

            <Skeleton className="h-4 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}
