"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageCircle } from "lucide-react";

import ReviewsModal from "@/app/(guest)/homestays/[id]/_components/reviews/ReviewsModal";

type Review = {
  id: string;
  comment: string | null;
  user: {
    name: string;
    image: string | null;
  };
};

interface Props {
  reviews: Review[];
  hostId: string;
}

export default function ReviewsPreview({ reviews, hostId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-mitti-khaki pt-8 space-y-6 max-w-full">
      <h2 className="text-xl font-semibold text-mitti-dark-brown flex items-center gap-2">
        <MessageCircle size={18} />
        What guests say
      </h2>

      <div className="space-y-4">
        {reviews.slice(0, 2).map((review) => (
          <div key={review.id} className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 rounded-full overflow-hidden bg-mitti-beige">
                {review.user.image && (
                  <Image
                    src={review.user.image}
                    alt={review.user.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <span className="text-sm font-medium text-mitti-dark-brown">
                {review.user.name}
              </span>
            </div>

            <p className="text-sm text-mitti-dark-brown/80">{review.comment}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => setOpen(true)}
        className="text-sm text-mitti-olive hover:underline"
      >
        Read all guest stories
      </button>

      <ReviewsModal
        isOpen={open}
        onClose={() => setOpen(false)}
        entityType="host"
        entityId={hostId}
        initialTotalReviews={reviews.length}
      />
    </div>
  );
}
