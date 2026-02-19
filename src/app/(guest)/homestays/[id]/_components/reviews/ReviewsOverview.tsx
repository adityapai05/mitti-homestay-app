"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ReviewsSummary from "./ReviewsSummary";
import ReviewsAIGist from "./ReviewsAIGist";
import ReviewsBreakdown from "./ReviewsBreakdown";
import ReviewCard from "./ReviewCard";
import ReviewsModal from "./ReviewsModal";
import ReviewCardSkeleton from "./ReviewCardSkeleton";

import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";
import { Button } from "@/components/ui/prebuilt-components/button";

import type { HomestayDetailsDTO, ReviewsResponseDTO } from "../../types";

const MIN_REVIEWS_FOR_AI = 3;

interface ReviewsOverviewProps {
  homestay: HomestayDetailsDTO;
}

type ReviewsAiResponse = {
  summary: string | null;
  positives: string[] | null;
  negatives: string[] | null;
};

export default function ReviewsOverview({ homestay }: ReviewsOverviewProps) {
  const [data, setData] = useState<ReviewsResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiPositives, setAiPositives] = useState<string[] | null>(null);
  const [aiNegatives, setAiNegatives] = useState<string[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/reviews/${homestay.id}?page=1&limit=6`);
        const json: ReviewsResponseDTO = await res.json();
        setData(json);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [homestay.id]);

  useEffect(() => {
    if (!data) return;
    if (data.reviews.length < MIN_REVIEWS_FOR_AI) return;

    const fetchAiSummary = async () => {
      try {
        setAiLoading(true);

        const res = await fetch("/api/ai/reviews-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            homestayId: homestay.id,
            reviews: data.reviews
              .map((r) => r.comment)
              .filter((c): c is string => Boolean(c)),
          }),
        });

        const json = (await res.json()) as Partial<ReviewsAiResponse>;
        setAiSummary(typeof json.summary === "string" ? json.summary : null);
        setAiPositives(Array.isArray(json.positives) ? json.positives : null);
        setAiNegatives(Array.isArray(json.negatives) ? json.negatives : null);
      } catch {
        setAiSummary(null);
        setAiPositives(null);
        setAiNegatives(null);
      } finally {
        setAiLoading(false);
      }
    };

    fetchAiSummary();
  }, [data, homestay.id]);

  if (!data && !loading) {
    return null;
  }

  if (data && data.stats.totalReviews === 0) {
    return (
      <section className="max-w-4xl px-4 pt-10">
        <div className="rounded-2xl border border-mitti-khaki bg-mitti-beige p-6 text-sm text-mitti-dark-brown/70">
          No guest reviews yet. Be the first to share your experience.
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-4xl px-4 pt-10 space-y-6 border-t border-mitti-dark-brown/20">
      <h2 className="text-2xl font-semibold text-mitti-dark-brown">
        What our guests experienced
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="rounded-2xl border border-mitti-khaki bg-white p-6">
            <div className="flex items-center gap-6">
              <Skeleton className="h-10 w-16" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
          </div>
        ) : (
          <ReviewsSummary stats={data!.stats} />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={
              aiLoading ? "ai-loading" : aiSummary ? "ai-summary" : "ai-empty"
            }
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ReviewsAIGist
              loading={aiLoading}
              summary={aiSummary}
              positives={aiPositives}
              negatives={aiNegatives}
              reviewCount={data?.stats.totalReviews ?? 0}
              minRequired={MIN_REVIEWS_FOR_AI}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-mitti-khaki bg-white p-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-full" />
          ))}
        </div>
      ) : (
        <ReviewsBreakdown stats={data!.stats} />
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <>
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
            </>
          ) : (
            data!.reviews
              .slice(0, 2)
              .map((review) => <ReviewCard key={review.id} review={review} />)
          )}
        </div>

        {!loading && data!.stats.totalReviews > 2 && (
          <Button
            variant="link"
            onClick={() => setOpenModal(true)}
            className="px-0 text-mitti-olive cursor-pointer"
          >
            Read all {data!.stats.totalReviews} guest stories
          </Button>
        )}
      </div>

      {!loading && (
        <ReviewsModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          entityType="homestay"
          entityId={homestay.id}
          initialTotalReviews={data!.stats.totalReviews}
        />
      )}
    </section>
  );
}
