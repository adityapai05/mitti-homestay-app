"use client";

import { useEffect, useState } from "react";
import { motion, cubicBezier } from "framer-motion";
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

const EASE_OUT = cubicBezier(0.16, 1, 0.3, 1);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const SKELETON_COUNT = 6;

const RecommendedSection = () => {
  const [homestays, setHomestays] = useState<RecommendedHomestay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommended() {
      try {
        const res = await fetch("/api/homestays?sort=rating-desc&page=1", {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed");

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
      } catch (err) {
        console.error("[RecommendedSection]", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommended();
  }, []);

  return (
    <section className="bg-mitti-beige px-6 sm:py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-10"
        >
          <p className="text-sm uppercase tracking-widest text-mitti-brown mb-4">
            Handpicked
          </p>

          <h2 className="text-3xl sm:text-6xl font-semibold text-mitti-dark-brown mb-2 sm:mb-4">
            Recommended by MITTI
          </h2>

          <p className="text-mitti-dark-brown/80 sm:text-lg max-w-2xl mx-auto">
            Stays chosen for warmth, authenticity, and the stories
            <br />
            that linger long after the journey ends.
          </p>
        </motion.div>

        {/* Mobile scroll */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="flex gap-8 overflow-x-auto pb-6 -mx-6 px-6 lg:hidden no-scrollbar snap-x snap-mandatory"
        >
          {loading &&
            Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="min-w-[280px] sm:min-w-[320px] flex-shrink-0 snap-start"
              >
                <HomestayCardSkeleton />
              </motion.div>
            ))}

          {!loading &&
            homestays.map((stay) => (
              <motion.div
                key={stay.id}
                variants={fadeUp}
                className="min-w-[280px] sm:min-w-[320px] flex-shrink-0 snap-start"
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
              </motion.div>
            ))}
        </motion.div>

        {/* Desktop grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="hidden lg:grid grid-cols-3 gap-8"
        >
          {loading &&
            Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <motion.div key={index} variants={fadeUp}>
                <HomestayCardSkeleton />
              </motion.div>
            ))}

          {!loading &&
            homestays.map((stay) => (
              <motion.div key={stay.id} variants={fadeUp}>
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
              </motion.div>
            ))}
        </motion.div>

        {/* Empty state */}
        {!loading && homestays.length === 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center py-24"
          >
            <p className="text-lg text-mitti-dark-brown mb-2">
              No recommended stays yet
            </p>
            <p className="text-mitti-dark-brown/70 max-w-md mx-auto">
              We are carefully curating homestays. Check back soon for authentic
              rural experiences.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default RecommendedSection;
