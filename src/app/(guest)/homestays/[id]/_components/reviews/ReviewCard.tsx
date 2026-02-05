import { Star } from "lucide-react";
import type { ReviewDTO } from "../../types";

interface ReviewCardProps {
  review: ReviewDTO;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="rounded-xl border border-mitti-khaki bg-white p-4 space-y-3 transition hover:shadow-sm">
      <div className="flex items-center justify-between">
        <p className="font-medium text-mitti-dark-brown">{review.user.name}</p>

        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < review.rating
                  ? "fill-mitti-olive text-mitti-olive"
                  : "text-mitti-dark-brown/20"
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-sm text-mitti-dark-brown/80 leading-relaxed line-clamp-4">
        {review.comment ?? "Guest did not leave a written review."}
      </p>

      <p className="text-xs text-mitti-dark-brown/60">
        Stayed in{" "}
        {new Date(review.booking.checkIn).toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </p>
    </div>
  );
}
