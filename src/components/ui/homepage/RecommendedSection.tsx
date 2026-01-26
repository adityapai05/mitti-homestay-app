"use client";

import { useEffect, useState } from "react";
import HomestayCard from "@/components/shared/HomestayCard";
import HomestayCardSkeleton from "@/components/shared/HomestayCardSkeleton";

type RecommendedHomestay = {
  id: string;
  name: string;
  description: string | null;
  pricePerNight: number;
  rating: number;
  images: string[];
};

type RecommendedHomestayApi = {
  id: string;
  name: string;
  description: string | null;
  pricePerNight: string;
  rating: number;
  imageUrl: string[];
};

const SKELETON_COUNT = 6;

const RecommendedSection = () => {
  const [homestays, setHomestays] = useState<RecommendedHomestay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchRecommended() {
      try {
        const res = await fetch("/api/homestays?sort=rating-desc&page=1", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch homestays");
        }

        const data = await res.json();

        const normalized: RecommendedHomestay[] = (
          data.homestays as RecommendedHomestayApi[]
        )
          .slice(0, 6)
          .map((stay) => ({
            id: stay.id,
            name: stay.name,
            description: stay.description,
            pricePerNight: Number(stay.pricePerNight),
            rating: stay.rating,
            images: stay.imageUrl,
          }));

        setHomestays(normalized);
      } catch (error) {
        console.error("[RecommendedSection]", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommended();
  }, []);

  return (
    <section className="bg-mitti-beige pt-12 px-4 text-center">
      <h2 className="text-3xl sm:text-6xl font-bold text-mitti-dark-brown mb-2">
        Handpicked Stays By MITTI
      </h2>

      <p className="text-md sm:text-xl text-mitti-dark-brown mb-8">
        Our most loved rural stays chosen for their stories, their soul, and the
        smiles that greet you.
      </p>

      {/* Mobile */}
      <div className="flex sm:hidden overflow-x-auto gap-4 no-scrollbar -mx-4 px-8">
        {loading
          ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <div key={index} className="min-w-[260px] max-w-xs flex-shrink-0">
                <HomestayCardSkeleton />
              </div>
            ))
          : homestays.map((stay) => (
              <div
                key={stay.id}
                className="min-w-[260px] max-w-xs flex-shrink-0"
              >
                <HomestayCard
                  id={stay.id}
                  title={stay.name}
                  description={stay.description || ""}
                  price={stay.pricePerNight}
                  rating={stay.rating}
                  imageSrc={
                    stay.images.length ? stay.images : ["/mitti-logo.png"]
                  }
                />
              </div>
            ))}
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex sm:flex-wrap sm:justify-center sm:gap-6">
        {loading
          ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <HomestayCardSkeleton key={index} />
            ))
          : homestays.map((stay) => (
              <HomestayCard
                key={stay.id}
                id={stay.id}
                title={stay.name}
                description={stay.description || ""}
                price={stay.pricePerNight}
                rating={stay.rating}
                imageSrc={
                  stay.images.length ? stay.images : ["/mitti-logo.png"]
                }
              />
            ))}
      </div>

      {!loading && homestays.length === 0 && (
        <p className="text-mitti-dark-brown mt-6">
          No recommended stays available right now
        </p>
      )}
    </section>
  );
};

export default RecommendedSection;
