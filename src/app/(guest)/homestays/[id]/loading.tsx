import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function Loading() {
  return (
    <div className="space-y-10 pb-20">
      {/* Gallery skeleton */}
      <div className="grid grid-cols-4 gap-2 px-4 sm:px-0">
        <Skeleton className="col-span-4 sm:col-span-2 h-[320px] rounded-2xl" />
        <Skeleton className="hidden sm:block h-[320px] rounded-2xl" />
        <Skeleton className="hidden sm:block h-[320px] rounded-2xl" />
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-12 px-4 sm:px-0">
        {/* Left column */}
        <div className="space-y-10">
          {/* Overview */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Host card */}
          <div className="rounded-2xl border border-mitti-khaki bg-white p-6 space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>

          {/* Location */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-[260px] w-full rounded-2xl" />
          </div>

          {/* Reviews */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </div>

        {/* Right column – booking card */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="rounded-2xl border border-mitti-khaki bg-white p-6 space-y-6">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile booking bar skeleton */}
      <div className="fixed inset-x-0 bottom-0 z-[50] lg:hidden bg-white border-t border-mitti-khaki px-5 py-5">
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}
