import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function HostAnalyticsLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-mitti-beige px-4 sm:px-6 py-2">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-2 mb-4">
          <Skeleton className="h-9 w-44" />
          <Skeleton className="h-4 w-72" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-mitti-khaki bg-white p-4 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-28" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
