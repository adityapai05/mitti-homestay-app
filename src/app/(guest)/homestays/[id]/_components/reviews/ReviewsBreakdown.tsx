import { Star } from "lucide-react";

interface RatingBucket {
  rating: number;
  count: number;
}

interface ReviewsBreakdownProps {
  stats: {
    totalReviews: number;
    ratingDistribution: RatingBucket[];
  };
}

export default function ReviewsBreakdown({ stats }: ReviewsBreakdownProps) {
  const distributionMap = new Map<number, number>();

  for (const item of stats.ratingDistribution) {
    distributionMap.set(item.rating, item.count);
  }

  const rows = [5, 4, 3, 2, 1].map((rating) => {
    const count = distributionMap.get(rating) ?? 0;
    const percentage =
      stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

    return { rating, count, percentage };
  });

  return (
    <div className="rounded-2xl border border-mitti-khaki bg-white p-6 space-y-4">
      <h3 className="text-sm font-medium text-mitti-dark-brown">
        Rating breakdown
      </h3>

      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.rating} className="flex items-center gap-3">
            {/* Stars */}
            <div className="flex items-center gap-1 w-16">
              <span className="text-sm text-mitti-dark-brown">
                {row.rating}
              </span>
              <Star className="h-4 w-4 fill-mitti-olive text-mitti-olive" />
            </div>

            {/* Bar */}
            <div className="relative flex-1 h-2 rounded-full bg-mitti-khaki/40 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-mitti-olive"
                style={{ width: `${row.percentage}%` }}
              />
            </div>

            {/* Count */}
            <div className="w-10 text-right text-xs text-mitti-dark-brown/70">
              {row.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
