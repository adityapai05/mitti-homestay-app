import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-5 w-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-4">
            <Skeleton className="h-5 w-32" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-4">
            <Skeleton className="h-5 w-32" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>

          <div className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
