"use client";

import { useState } from "react";
import { BOOKING_UI_MAP } from "../_lib/bookingUiMap";
import type { BookingStatus, BookingStatusFlags, HomestayOwner } from "./types";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/prebuilt-components/alert-dialog";
import { Button } from "@/components/ui/prebuilt-components/button";
import { loadRazorpay } from "@/lib/razorpay/loadRazorpay";
import ReviewModal from "./ReviewModal";
import { toast } from "sonner";

/* ---------- Razorpay global typing ---------- */

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => Promise<void>;
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

/* ---------- props ---------- */

type RefundStatus = "NOT_APPLICABLE" | "PENDING" | "PROCESSED" | "FAILED";

interface BookingActionZoneProps {
  bookingId: string;
  status: BookingStatus;
  bookingStatus: BookingStatusFlags;
  homestayOwner: HomestayOwner;
  homestayId: string;

  refundAmount: number | null;
  refundStatus: RefundStatus;

  review: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
  } | null;
}

export default function BookingActionZone({
  bookingId,
  status,
  bookingStatus,
  homestayOwner,
  refundAmount,
  refundStatus,
  review,
}: BookingActionZoneProps) {
  const ui = BOOKING_UI_MAP[status];

  const [openReview, setOpenReview] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  async function handleCancel() {
    try {
      setCancelling(true);

      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
      });

      const data: {
        success: boolean;
        refundAmount?: number;
        error?: string;
      } = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Cancellation failed");
      }

      toast.success("Booking cancelled successfully");
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <section className="rounded-xl border border-mitti-khaki bg-mitti-cream p-5 space-y-5 shadow-sm">
      <h2 className="text-base font-semibold text-mitti-dark-brown">
        Next steps
      </h2>

      {/* ---------------- PENDING ---------------- */}
      {status === "PENDING_HOST_APPROVAL" && (
        <p className="text-sm text-mitti-dark-brown/70">
          The host is reviewing your booking request. You’ll be notified once
          they approve or reject it.
        </p>
      )}

      {/* ---------------- PAYMENT ---------------- */}
      {ui.showPayment && (
        <Button
          onClick={async () => {
            const loaded = await loadRazorpay();
            if (!loaded) {
              toast.error("Failed to load payment gateway");
              return;
            }

            const res = await fetch("/api/payments/razorpay/order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ bookingId }),
            });

            const data = await res.json();
            if (!res.ok) {
              toast.error(data.error || "Payment initiation failed");
              return;
            }

            const rzp = new window.Razorpay({
              key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
              amount: data.amount,
              currency: data.currency,
              name: "MITTI",
              description: "Homestay booking payment",
              order_id: data.orderId,
              handler: async (response: RazorpayResponse) => {
                await fetch("/api/payments/razorpay/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    bookingId,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                });

                window.location.href = `/bookings/${bookingId}`;
              },
              theme: { color: "#8B4513" },
            });

            rzp.open();
          }}
          className="w-full bg-mitti-brown text-white hover:bg-mitti-brown/80 cursor-pointer"
        >
          Complete payment
        </Button>
      )}

      {/* ---------------- CONFIRMED ---------------- */}
      {status === "CONFIRMED" && (
        <div className="space-y-3 text-sm text-mitti-dark-brown/80">
          <p className="font-medium text-mitti-dark-brown">
            You’re all set for your stay.
          </p>

          <p>
            Save the host’s contact details and reach out before check-in if you
            need directions or arrival instructions.
          </p>

          <div className="rounded-lg bg-white p-3 border border-mitti-khaki">
            <p className="text-sm font-medium text-mitti-dark-brown">
              Host contact
            </p>
            <p className="mt-1 text-sm">
              {homestayOwner.name}
              {homestayOwner.phone ? ` • ${homestayOwner.phone}` : ""}
              {homestayOwner.email ? ` • ${homestayOwner.email}` : ""}
            </p>
          </div>

          <p className="text-xs text-mitti-dark-brown/60">
            Cancellation is available until the policy deadline. Refunds depend
            on how close you are to check-in.
          </p>
        </div>
      )}

      {/* ---------------- CANCELLED ---------------- */}
      {(status === "CANCELLED_BY_GUEST" || status === "CANCELLED_BY_HOST") && (
        <div className="space-y-3 text-sm text-mitti-dark-brown/80">
          <p className="font-medium text-mitti-dark-brown">
            This booking has been cancelled
          </p>

          {refundStatus === "NOT_APPLICABLE" && (
            <p>No refund is applicable for this booking.</p>
          )}

          {refundStatus === "PENDING" && (
            <p>Refund of ₹{refundAmount ?? 0} is pending processing.</p>
          )}

          {refundStatus === "PROCESSED" && (
            <p>
              ₹{refundAmount ?? 0} has been refunded to your original payment
              method.
            </p>
          )}

          {refundStatus === "FAILED" && (
            <p>
              Refund processing failed. Our team will retry or contact you if
              needed.
            </p>
          )}
        </div>
      )}

      {/* ---------------- REVIEW ---------------- */}
      {ui.showReview && !review && (
        <AlertDialog open={openReview} onOpenChange={setOpenReview}>
          <AlertDialogTrigger asChild>
            <Button className="w-full bg-mitti-olive hover:bg-mitti-olive/90 text-white cursor-pointer">
              Write a review
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Rate your stay</AlertDialogTitle>
              <AlertDialogDescription>
                Your feedback helps future guests and the host.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <ReviewModal
              bookingId={bookingId}
              homestayId={homestayOwner.id}
              mode="create"
              onSuccess={() => {
                setOpenReview(false);
                window.location.reload();
              }}
              onClose={() => setOpenReview(false)}
            />
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* ---------------- CANCEL ACTION ---------------- */}
      {ui.showCancel && bookingStatus.canCancel && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full bg-mitti-error text-mitti-beige hover:bg-mitti-error/90 cursor-pointer">
              Cancel booking
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel booking?</AlertDialogTitle>
              <AlertDialogDescription>
                Your refund will be calculated based on the cancellation policy
                of this homestay.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Keep booking
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancel}
                disabled={cancelling}
                className="bg-mitti-error hover:bg-mitti-error/80 text-white cursor-pointer"
              >
                {cancelling ? "Cancelling..." : "Confirm cancellation"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </section>
  );
}
