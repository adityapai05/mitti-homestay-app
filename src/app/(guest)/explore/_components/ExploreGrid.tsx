"use client";

import { useSearchParams } from "next/navigation";
import { useExploreData } from "@/hooks/useExploreData";
import HomestayCard from "@/components/shared/HomestayCard";
import ExploreEmptyState from "./ExploreEmptyState";
import ExploreSkeleton from "./ExploreSkeleton";

export default function ExploreGrid() {
  const { homestays, loading, error } = useExploreData();
  const searchParams = useSearchParams();

  if (loading) return <ExploreSkeleton />;

  if (error) {
    return (
      <div className="text-center py-20 text-mitti-dark-brown">
        Something went wrong while loading homestays.
      </div>
    );
  }

  if (homestays.length === 0) {
    return <ExploreEmptyState />;
  }

  const queryString = searchParams.toString();

  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {homestays.map((home) => (
        <HomestayCard
          key={home.id}
          id={home.id}
          title={home.name}
          description={home.description}
          imageSrc={home.imageUrl}
          price={Number(home.pricePerNight)}
          rating={home.rating}
          href={`/homestays/${home.id}${queryString ? `?${queryString}` : ""}`}
        />
      ))}
    </div>
  );
}
