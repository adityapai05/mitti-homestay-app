import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

function AdminTableLoading() {
  return (
    <div className="h-full flex flex-col py-8 px-24">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-10 w-36" />
        </div>

        <div className="rounded-lg border border-mitti-khaki overflow-hidden">
          <div className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-mitti-khaki bg-mitti-cream">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-20" />
            ))}
          </div>

          <div className="divide-y divide-mitti-khaki/60">
            {Array.from({ length: 7 }).map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-5 gap-4 px-4 py-4">
                {Array.from({ length: 5 }).map((_, colIndex) => (
                  <Skeleton key={colIndex} className="h-4 w-full" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminTableLoading;
