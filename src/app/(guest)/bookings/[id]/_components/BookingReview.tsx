"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/prebuilt-components/alert-dialog";
import { useState } from "react";
import ReviewModal from "./ReviewModal";

interface BookingReviewProps {
  review: {
    rating: number;
    comment: string | null;
    createdAt: Date;
  };
  bookingId: string;
  homestayId: string;
}

export default function BookingReview({
  review,
  bookingId,
  homestayId,
}: BookingReviewProps) {
  const [openEdit, setOpenEdit] = useState(false);
  console.log(review);
  return (
    <section className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-mitti-dark-brown">
          Your review
        </h3>

        <button
          onClick={() => setOpenEdit(true)}
          className="text-sm text-mitti-olive hover:underline cursor-pointer"
        >
          Edit
        </button>
      </div>

      <div className="text-mitti-olive text-lg">
        {"★".repeat(review.rating)}
        {"☆".repeat(5 - review.rating)}
      </div>

      {review.comment && (
        <p className="text-sm text-mitti-dark-brown/80">“{review.comment}”</p>
      )}

      <p className="text-xs text-mitti-dark-brown/50">
        Reviewed on {new Date(review.createdAt).toLocaleDateString()}
      </p>

      <AlertDialog open={openEdit} onOpenChange={setOpenEdit}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit your review</AlertDialogTitle>
            <AlertDialogDescription>
              You can update your rating or comment.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <ReviewModal
            bookingId={bookingId}
            homestayId={homestayId}
            mode="edit"
            initialRating={review.rating}
            initialComment={review.comment ?? ""}
            onSuccess={() => window.location.reload()}
            onClose={() => setOpenEdit(false)}
          />
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
