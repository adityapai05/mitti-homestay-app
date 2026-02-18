import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

const HomestayCardSkeleton = () => {
  return (
    <div className="group block w-full overflow-hidden bg-white rounded-2xl sm:rounded-3xl shadow-md sm:max-w-sm">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute top-4 left-4 flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <Skeleton className="h-6 w-2/3" />
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>

        <Skeleton className="h-5 w-12" />
      </div>
    </div>
  );
};

export default HomestayCardSkeleton;
