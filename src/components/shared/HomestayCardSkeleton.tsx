"use client";

import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";
import clsx from "clsx";

interface HomestayCardSkeletonProps {
  size?: "default" | "compact";
}

const HomestayCardSkeleton = ({ size = "default" }: HomestayCardSkeletonProps) => {
  const sizeClasses = {
    default: {
      container: "w-full sm:max-w-xs",
      image: "h-40 sm:h-48 md:h-56",
      padding: "p-4"
    },
    compact: {
      container: "w-full max-w-[280px] mx-auto",
      image: "h-32 sm:h-40",
      padding: "p-3"
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={clsx(
      "flex flex-col justify-between h-full rounded-xl overflow-hidden bg-white shadow-md animate-pulse",
      currentSize.container
    )}>
      {/* Image skeleton */}
      <div className={clsx("relative w-full", currentSize.image)}>
        <Skeleton className="h-full w-full rounded-t-xl" />
      </div>

      {/* Content skeleton */}
      <div className={clsx("flex flex-col flex-1 gap-2", currentSize.padding)}>
        <Skeleton className="h-5 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
        <div className="flex items-center justify-between mt-auto">
          <Skeleton className="h-4 w-1/3 rounded" />
          <Skeleton className="h-4 w-1/4 rounded" />
        </div>
        <Skeleton className={clsx("w-full rounded-lg mt-2", size === "compact" ? "h-7" : "h-8")} />
      </div>
    </div>
  );
};

export default HomestayCardSkeleton;