import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function AdminOverviewLoading() {
  return (
    <div className="h-full flex flex-col py-8 px-24">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-10 w-52" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-mitti-khaki bg-mitti-cream p-6 flex flex-col justify-between"
          >
            <div className="flex items-start gap-4">
              <Skeleton className="h-7 w-7" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-52" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            <Skeleton className="h-4 w-56 mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
