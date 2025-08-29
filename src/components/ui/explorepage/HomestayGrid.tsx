"use client";

import HomestayCard from "@/components/shared/HomestayCard";
import HomestayCardSkeleton from "@/components/shared/HomestayCardSkeleton";
import HomestaysNotFound from "./HomestaysNotFound";

interface Homestay {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  pricePerNight: string | number;
  rating: number;
}

interface HomestaysGridProps {
  homestays: Homestay[];
  loading: boolean;
}

const HomestayGrid = ({ homestays, loading }: HomestaysGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <HomestayCardSkeleton key={idx} size="compact" />
        ))}
      </div>
    );
  }

  if (!homestays || homestays.length === 0) {
    return (
      <HomestaysNotFound />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {homestays.map((home) => (
        <HomestayCard
          key={home.id}
          title={home.name}
          description={home.description}
          imageSrc={home.imageUrl}
          price={Number(home.pricePerNight)}
          rating={home.rating}
          size="compact"
          className="w-full max-w-[280px] mx-auto"
        />
      ))}
    </div>
  );
};

export default HomestayGrid;