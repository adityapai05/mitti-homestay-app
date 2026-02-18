import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function HostDashboardRootLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-mitti-beige px-4 sm:px-6 py-2">
      <div className="max-w-6xl mx-auto space-y-4">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-4 w-72" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-56 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
