import React from "react";
import { Skeleton } from "../prebuilt-components/skeleton";

const ReviewsSectionSkeleton = () => {
  return (
    <section className="py-10 px-6 bg-mitti-cream shadow-sm rounded-lg">
      <div className="max-w-7xl mx-auto">
        <Skeleton className="h-8 w-48 mb-6 bg-mitti-khaki/20" />
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="flex gap-4 border-b border-mitti-beige pb-4"
            >
              <Skeleton className="w-12 h-12 rounded-full bg-mitti-khaki/20" />
              <div className="flex-1">
                <Skeleton className="h-6 w-32 mb-2 bg-mitti-khaki/20" />
                <Skeleton className="h-4 w-64 mb-1 bg-mitti-khaki/20" />
                <Skeleton className="h-4 w-48 bg-mitti-khaki/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSectionSkeleton;
