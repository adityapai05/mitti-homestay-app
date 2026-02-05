import { Star } from "lucide-react";
import type { ReviewsStatsDTO } from "../../types";

interface ReviewsSummaryProps {
  stats: ReviewsStatsDTO;
}

export default function ReviewsSummary({ stats }: ReviewsSummaryProps) {
  return (
    <div className="rounded-2xl border border-mitti-khaki bg-white p-6 flex items-center gap-6">
      <div className="text-4xl font-semibold text-mitti-dark-brown">
        {stats.averageRating.toFixed(1)}
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-mitti-olive text-mitti-olive" />
          <span className="text-sm text-mitti-dark-brown">
            {stats.totalReviews} verified stays
          </span>
        </div>

        <p className="text-xs text-mitti-dark-brown/70">
          Ratings from guests who completed verified bookings on MITTI
        </p>
      </div>
    </div>
  );
}
