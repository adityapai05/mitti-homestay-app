import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

export default function ReviewCardSkeleton() {
  return (
    <div className="rounded-xl border border-mitti-khaki bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      <Skeleton className="h-3 w-32" />
    </div>
  );
}
