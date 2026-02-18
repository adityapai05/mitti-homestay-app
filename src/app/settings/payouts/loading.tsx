import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function SettingsPayoutsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />

      <div className="rounded-xl border border-mitti-khaki bg-white p-6 space-y-4">
        <Skeleton className="h-5 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>

      <div className="rounded-xl border border-mitti-khaki bg-white p-6 space-y-4">
        <Skeleton className="h-5 w-56" />
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        ))}
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>

      <div className="rounded-xl border border-mitti-khaki bg-white p-6 space-y-4">
        <Skeleton className="h-5 w-44" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-10 w-44 rounded-lg" />
      </div>

      <Skeleton className="h-4 w-96" />
    </div>
  );
}
