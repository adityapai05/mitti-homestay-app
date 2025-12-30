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
} from "@/components/ui/prebuilt-components/alert-dialog";
import { Button } from "@/components/ui/prebuilt-components/button";
import { loadRazorpay } from "@/lib/razorpay/loadRazorpay";
import ReviewModal from "./ReviewModal";

/* ---------- Razorpay types ---------- */

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

interface BookingActionZoneProps {
  bookingId: string;
  status: BookingStatus;
  bookingStatus: BookingStatusFlags;
  homestayOwner: HomestayOwner;
  homestayId: string;
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
  homestayId,
  review,
}: BookingActionZoneProps) {
  const ui = BOOKING_UI_MAP[status];
  const [openReview, setOpenReview] = useState(false);

  if (status === "COMPLETED" && review) {
    return null;
  }

  return (
    <section className="rounded-xl border border-mitti-khaki bg-mitti-cream p-5 space-y-4 shadow-sm">
      <h2 className="text-base font-semibold text-mitti-dark-brown">
        Next steps
      </h2>

      {status === "PENDING_HOST_APPROVAL" && (
        <p className="text-sm text-mitti-dark-brown/70">
          The host will review your booking request. You will be notified once
          the host approves or rejects the request.
        </p>
      )}

      {ui.showPayment && (
        <div className="space-y-3">
          <Button
            onClick={async () => {
              const loaded = await loadRazorpay();
              if (!loaded) {
                alert("Failed to load Razorpay");
                return;
              }

              const res = await fetch("/api/payments/razorpay/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId }),
              });

              const data = await res.json();
              if (!res.ok) {
                alert(data.error || "Payment initiation failed");
                return;
              }

              const rzp = new window.Razorpay({
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: data.amount,
                currency: data.currency,
                name: "MITTI",
                description: "Homestay booking payment",
                order_id: data.orderId,
                handler: async (response) => {
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
            className="w-full bg-mitti-brown text-white cursor-pointer hover:bg-mitti-brown/80"
          >
            Complete payment
          </Button>
        </div>
      )}

      {ui.showCheckInInfo && (
        <div className="space-y-2 text-sm text-mitti-dark-brown/80">
          <p>
            <span className="font-medium text-mitti-dark-brown">
              Host contact:
            </span>{" "}
            {homestayOwner.name}
            {homestayOwner.phone ? ` • ${homestayOwner.phone}` : ""}
            {homestayOwner.email ? ` • ${homestayOwner.email}` : ""}
          </p>
        </div>
      )}

      {ui.showReview && !review && (
        <AlertDialog open={openReview} onOpenChange={setOpenReview}>
          <AlertDialogTrigger asChild>
            <Button className="w-full rounded-lg bg-mitti-olive px-4 py-3 text-sm font-semibold text-white hover:opacity-90 cursor-pointer">
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
              homestayId={homestayId}
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

      {ui.showCancel && bookingStatus.canCancel && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full rounded-lg bg-mitti-khaki px-4 py-2 text-sm font-medium text-mitti-dark-brown hover:bg-mitti-khaki/70 cursor-pointer border-mitti-dark-brown">
              Cancel booking
            </Button>
          </AlertDialogTrigger>
        </AlertDialog>
      )}
    </section>
  );
}
