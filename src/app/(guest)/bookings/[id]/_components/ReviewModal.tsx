"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/prebuilt-components/button";
import { X } from "lucide-react";

interface ReviewModalProps {
  bookingId: string;
  homestayId: string;
  mode: "create" | "edit";
  initialRating?: number;
  initialComment?: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function ReviewModal({
  bookingId,
  homestayId,
  mode,
  initialRating,
  initialComment,
  onSuccess,
  onClose,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const method = mode === "edit" ? "PATCH" : "POST";

  useEffect(() => {
    if (mode === "edit") {
      if (typeof initialRating === "number") {
        setRating(initialRating);
      }
      if (typeof initialComment === "string") {
        setComment(initialComment);
      }
    }
  }, [mode, initialRating, initialComment]);

  async function submitReview() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/reviews/${homestayId}`, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          rating,
          comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const activeRating = hoverRating ?? rating;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close review modal"
        className="absolute right-0 top-0 rounded-md p-5 text-mitti-dark-brown/60 hover:text-mitti-dark-brown transition cursor-pointer"
      >
        <X />
      </button>
      {/* Rating */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-mitti-dark-brown">
          How was your stay?
        </p>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(null)}
              className="cursor-pointer"
              aria-label={`${value} star`}
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-7 w-7 transition-colors ${
                  value <= activeRating
                    ? "fill-mitti-olive"
                    : "fill-mitti-khaki/40"
                }`}
              >
                <path d="M12 2l2.9 6.1L22 9.3l-5 4.9L18.2 22 12 18.7 5.8 22 7 14.2 2 9.3l7.1-1.2L12 2z" />
              </svg>
            </button>
          ))}
        </div>

        <p className="text-xs text-mitti-dark-brown/60">
          {activeRating === 5 && "Exceptional experience"}
          {activeRating === 4 && "Very good stay"}
          {activeRating === 3 && "Decent, could be better"}
          {activeRating === 2 && "Not great"}
          {activeRating === 1 && "Poor experience"}
        </p>
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-mitti-dark-brown">
          Share more details (optional)
        </label>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you like? What could be improved?"
          rows={4}
          className="w-full resize-none rounded-lg border border-mitti-khaki bg-white px-3 py-2 text-sm text-mitti-dark-brown placeholder:text-mitti-dark-brown/40 focus:outline-none focus:ring-2 focus:ring-mitti-olive/40"
        />

        <p className="text-xs text-mitti-dark-brown/50">
          Your review helps future guests and the host.
        </p>
      </div>

      {/* Error */}
      {error && <p className="text-sm text-mitti-error">{error}</p>}

      {/* Submit */}
      <Button
        onClick={submitReview}
        disabled={loading}
        className="w-full rounded-lg bg-mitti-olive px-4 py-3 text-sm font-semibold text-white hover:opacity-90 cursor-pointer"
      >
        {loading ? "Submitting…" : "Submit review"}
      </Button>
    </div>
  );
}
