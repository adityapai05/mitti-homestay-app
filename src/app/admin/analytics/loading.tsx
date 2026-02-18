import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function AdminAnalyticsLoading() {
  return (
    <div className="h-full flex flex-col py-8 px-24">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-4"
          >
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        ))}

        <div className="lg:col-span-2 mb-10 rounded-xl border border-mitti-khaki bg-white p-5 space-y-4">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-72 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
