import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function Loading() {
  return (
    <section className="space-y-12">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <Skeleton className="h-28 w-28 rounded-full" />
        <div className="space-y-3 flex-1 w-full">
          <div className="flex items-start justify-between gap-4">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-28 rounded-full" />
          </div>
        </div>
      </div>

      <div className="space-y-3 max-w-3xl">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-7 w-40" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-7 w-20 rounded-full" />
          ))}
        </div>
      </div>

      <div className="border-t border-mitti-khaki pt-8 space-y-4">
        <Skeleton className="h-7 w-44" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-mitti-khaki bg-mitti-beige p-4 space-y-2"
            >
              <Skeleton className="h-4 w-4 mx-auto" />
              <Skeleton className="h-6 w-10 mx-auto" />
              <Skeleton className="h-3 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-mitti-khaki pt-8 space-y-6">
        <Skeleton className="h-7 w-40" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
