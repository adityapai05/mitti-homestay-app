import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function StayCardSkeleton() {
  return (
    <div className="rounded-xl border border-mitti-khaki bg-white p-4">
      <div className="flex gap-4">
        <Skeleton className="h-24 w-28 rounded-lg shrink-0" />

        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>

        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  );
}
