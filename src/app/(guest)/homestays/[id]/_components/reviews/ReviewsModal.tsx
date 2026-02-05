"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ChevronLeft, ChevronRight } from "lucide-react";

import ReviewCard from "./ReviewCard";
import ReviewCardSkeleton from "./ReviewCardSkeleton";

import type { ReviewsResponseDTO, ReviewDTO } from "../../types";

import { Button } from "@/components/ui/prebuilt-components/button";
import { Input } from "@/components/ui/prebuilt-components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/prebuilt-components/select";

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  homestayId: string;
  initialStats: ReviewsResponseDTO["stats"];
}

const PAGE_SIZE = 6;

export default function ReviewsModal({
  isOpen,
  onClose,
  homestayId,
  initialStats,
}: ReviewsModalProps) {
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [rating, setRating] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    setPage(1);
    setQuery("");
    setRating("all");
    setSortBy("newest");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
          sortBy,
          rating,
          search: query,
        });

        const res = await fetch(
          `/api/reviews/${homestayId}?${params.toString()}`,
        );

        const json: ReviewsResponseDTO = await res.json();

        setReviews(json.reviews);
        setTotalPages(json.pagination.totalPages);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [isOpen, page, query, rating, sortBy, homestayId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 80, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 80, scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full md:max-w-4xl bg-mitti-beige shadow-xl rounded-t-2xl md:rounded-2xl max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-mitti-khaki">
              <div>
                <h3 className="text-lg font-semibold text-mitti-dark-brown">
                  Guest experiences
                </h3>
                <p className="text-xs text-mitti-dark-brown/70">
                  {initialStats.totalReviews} verified stays
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="cursor-pointer hover:bg-mitti-khaki/40"
              >
                <X className="h-4 w-4 text-mitti-dark-brown" />
              </Button>
            </div>

            <div className="px-6 py-4 border-b border-mitti-khaki space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-mitti-dark-brown/60" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search guest reviews"
                  className="pl-9 bg-white text-mitti-dark-brown"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px] cursor-pointer bg-white font-medium">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="text-mitti-dark-brown font-medium">
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="highest">Highest rated</SelectItem>
                    <SelectItem value="lowest">Lowest rated</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={rating} onValueChange={setRating}>
                  <SelectTrigger className="w-[140px] cursor-pointer bg-white font-medium">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent className="text-mitti-dark-brown font-medium">
                    <SelectItem value="all">All ratings</SelectItem>
                    {[5, 4, 3, 2, 1].map((r) => (
                      <SelectItem key={r} value={String(r)}>
                        {r} stars
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {loading && (
                <>
                  {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <ReviewCardSkeleton key={i} />
                  ))}
                </>
              )}

              {!loading && reviews.length === 0 && (
                <div className="py-16 text-center text-sm text-mitti-dark-brown/70">
                  No reviews match your filters
                </div>
              )}

              <AnimatePresence mode="popLayout">
                {!loading &&
                  reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <ReviewCard review={review} />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-mitti-khaki">
                <Button
                  variant="ghost"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <span className="text-xs text-mitti-dark-brown/70">
                  Page {page} of {totalPages}
                </span>

                <Button
                  variant="ghost"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="cursor-pointer"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
