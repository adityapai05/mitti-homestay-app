"use client";

import HomestayCardSkeleton from "@/components/shared/HomestayCardSkeleton";

export default function ExploreSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <HomestayCardSkeleton key={index} />
      ))}
    </div>
  );
}
