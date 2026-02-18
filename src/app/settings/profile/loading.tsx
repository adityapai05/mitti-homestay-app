import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function SettingsProfileLoading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-48" />

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-start">
        <div className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-3">
          <Skeleton className="h-28 w-28 rounded-full mx-auto" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-mitti-khaki bg-white p-6 space-y-4">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-11 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
          </div>

          <div className="rounded-xl border border-mitti-khaki bg-white p-6 space-y-4">
            <Skeleton className="h-5 w-36" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-mitti-khaki bg-white p-6 space-y-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
