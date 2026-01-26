import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

const HomestayCardSkeleton = () => {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-md">
      {/* Image */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />

      {/* Meta */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>

        <Skeleton className="h-4 w-10" />
      </div>
    </div>
  );
};

export default HomestayCardSkeleton;
