"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/prebuilt-components/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/prebuilt-components/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/prebuilt-components/pagination";
import { cn } from "@/lib/utils";
import ReviewsSectionSkeleton from "./ReviewsSectionSkeleton";
import ReviewsNotFound from "./ReviewsNotFound";

interface Review {
  id: string;
  user: { id: string; name: string; image: string | null };
  rating: number;
  comment?: string;
  createdAt: string;
  booking: {
    id: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  };
}

interface ReviewsResponse {
  reviews: Review[];
  homestay: { id: string; name: string };
  stats: {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { rating: number; count: number }[];
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}

interface ReviewsSectionProps {
  homestayId: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ homestayId }) => {
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest"
  >("newest");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
          const response = await axios.get(`/api/reviews/${homestayId}`, {
            params: {
              page: currentPage,
              limit,
              sortBy,
              rating: ratingFilter !== "all" ? ratingFilter : undefined,
            },
          });
          setData(response.data);
      } catch (error) {
        console.error("[GET reviews/[homestayId]]", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [homestayId, currentPage, sortBy, ratingFilter]);

  if (loading) {
    return <ReviewsSectionSkeleton />;
  }

  if (!data || data.reviews.length === 0) {
    return (
      <ReviewsNotFound homestay={data?.homestay.name || "this homestay"} />
    );
  }

  return (
    <section className="py-10 px-6 bg-mitti-cream shadow-sm rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-mitti-dark-brown">
            Reviews ({data.stats.totalReviews})
          </h2>
          <div className="flex items-center gap-4">
            <Select
              value={sortBy}
              onValueChange={(
                value: "newest" | "oldest" | "highest" | "lowest"
              ) => setSortBy(value)}
            >
              <SelectTrigger className="w-40 border-mitti-khaki text-mitti-dark-brown">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Rated</SelectItem>
                <SelectItem value="lowest">Lowest Rated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-40 border-mitti-khaki text-mitti-dark-brown">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <SelectItem key={rating} value={rating.toString()}>
                    {rating} Star{rating > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Rating Summary */}
        <div className="mb-8 p-4 bg-mitti-khaki/10 rounded-lg">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-2xl font-semibold text-mitti-dark-brown">
                {data.stats.averageRating.toFixed(1)} ★
              </span>
              <span className="text-mitti-dark-brown/80 text-base ml-2">
                ({data.stats.totalReviews} reviews)
              </span>
            </div>
            <div className="flex-1 grid grid-cols-5 gap-2">
              {data.stats.ratingDistribution.map((item) => (
                <div key={item.rating} className="flex items-center gap-1">
                  <span className="text-sm text-mitti-dark-brown">
                    {item.rating}★
                  </span>
                  <div className="flex-1 h-2 bg-mitti-beige rounded">
                    <div
                      className="h-full bg-mitti-olive rounded"
                      style={{
                        width: `${
                          (item.count / data.stats.totalReviews) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-mitti-muted">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Reviews List */}
        <div className="space-y-6">
          {data.reviews.map((review) => (
            <div
              key={review.id}
              className="flex gap-4 border-b border-mitti-beige pb-4"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={review.user.image || "/default-avatar.png"}
                  alt={`Avatar of ${review.user.name}`}
                  className="rounded-full object-cover"
                />
                <AvatarFallback className="bg-mitti-khaki/20 text-mitti-dark-brown">
                  {review.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-mitti-dark-brown font-medium">
                    {review.user.name}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={cn(
                          "transition-colors",
                          i < review.rating
                            ? "text-mitti-brown fill-mitti-brown"
                            : "text-mitti-muted hover:text-mitti-brown/50"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-mitti-dark-brown text-base">
                  {review.comment || "No comment provided."}
                </p>
                <p className="text-sm text-mitti-muted">
                  Stayed {new Date(review.booking.checkIn).toLocaleDateString()}{" "}
                  - {new Date(review.booking.checkOut).toLocaleDateString()} •{" "}
                  {review.booking.guests} guest
                  {review.booking.guests > 1 ? "s" : ""}
                </p>
                <p className="text-sm text-mitti-muted">
                  Posted {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        {data.pagination.totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className={cn(
                    "border-mitti-khaki text-mitti-dark-brown hover:bg-mitti-khaki/20",
                    !data.pagination.hasPrevPage &&
                      "opacity-50 pointer-events-none"
                  )}
                  aria-label="Previous page"
                />
              </PaginationItem>
              {[...Array(data.pagination.totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={data.pagination.currentPage === i + 1}
                    className={cn(
                      "border-mitti-khaki text-mitti-dark-brown",
                      data.pagination.currentPage === i + 1
                        ? "bg-mitti-olive text-mitti-cream"
                        : "hover:bg-mitti-khaki/20"
                    )}
                    aria-label={`Go to page ${i + 1}`}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className={cn(
                    "border-mitti-khaki text-mitti-dark-brown hover:bg-mitti-khaki/20",
                    !data.pagination.hasNextPage &&
                      "opacity-50 pointer-events-none"
                  )}
                  aria-label="Next page"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
    </section>
  );
};

export default ReviewsSection;
