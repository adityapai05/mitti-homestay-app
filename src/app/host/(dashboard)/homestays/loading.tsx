import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function HostHomestaysLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-mitti-beige px-4 sm:px-6 py-2">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-11 w-44 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white border border-mitti-khaki rounded-2xl overflow-hidden">
              <Skeleton className="h-44 w-full rounded-none" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
