"use client";

import { useMemo, useState } from "react";
import { format, differenceInDays, isBefore } from "date-fns";
import { toast } from "sonner";

import type { HomestayDetailsDTO } from "../../types";

import DateSelector from "./DateSelector";
import GuestSelector from "./GuestSelector";
import PriceBreakdown from "./PriceBreakdown";

import { Button } from "@/components/ui/prebuilt-components/button";
import { useAuthModal } from "@/hooks/useAuthModal";
import { Input } from "@/components/ui/prebuilt-components/input";

interface BookingFormProps {
  homestay: HomestayDetailsDTO;
  dateVariant?: "popover" | "sheet";

  dateRange: { from?: Date; to?: Date };
  setDateRange: (r: { from?: Date; to?: Date }) => void;

  guests: number;
  setGuests: (n: number) => void;

  onAuthRequired?: () => void;
}

const bookingErrorMessages: Record<string, string> = {
  HOMESTAY_NOT_FOUND: "This homestay is no longer available.",
  HOMESTAY_NOT_VERIFIED: "This homestay is not verified yet.",
  CANNOT_BOOK_OWN_HOMESTAY: "You cannot book your own homestay.",
  MAX_GUESTS_EXCEEDED: "The number of guests exceeds the allowed limit.",
  DATES_NOT_AVAILABLE:
    "These dates were just booked. Please choose different dates.",
};

export default function BookingForm({
  homestay,
  dateVariant = "popover",
  dateRange,
  setDateRange,
  guests,
  setGuests,
  onAuthRequired,
}: BookingFormProps) {
  const { openModal } = useAuthModal();
  const [includeGuide, setIncludeGuide] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const nights = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return 0;
    return differenceInDays(dateRange.to, dateRange.from);
  }, [dateRange]);

  const handleReserve = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast.error("Please select check-in and check-out dates.");
      return;
    }

    if (isBefore(dateRange.to, dateRange.from) || nights < 1) {
      toast.error("Minimum stay is 1 night.");
      return;
    }

    if (guests < 1 || guests > homestay.capacity.maxGuests) {
      toast.error(`Maximum ${homestay.capacity.maxGuests} guests allowed.`);
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homestayId: homestay.id,
          checkIn: format(dateRange.from, "yyyy-MM-dd"),
          checkOut: format(dateRange.to, "yyyy-MM-dd"),
          guests,
        }),
      });

      if (res.status === 401) {
        toast.error("Please log in to continue.");

        onAuthRequired?.(); 
        openModal("login");

        return;
      }

      if (!res.ok) {
        const data = await res.json();
        const key =
          typeof data.error === "string" ? data.error : data.error?.message;

        toast.error(
          bookingErrorMessages[key] || "Booking could not be completed.",
        );
        return;
      }

      const data = await res.json();
      toast.success("Booking request sent to host.");
      window.location.href = `/bookings/${data.booking.id}`;
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dates */}
      <DateSelector
        homestayId={homestay.id}
        value={dateRange}
        onChange={setDateRange}
        variant={dateVariant}
      />

      {/* Guests */}
      <GuestSelector
        value={guests}
        maxGuests={homestay.capacity.maxGuests}
        onChange={setGuests}
      />

      {/* Guide option */}
      {homestay.pricing.guideAvailable && (
        <label className="flex items-center gap-3 text-sm text-mitti-dark-brown">
          <Input
            type="checkbox"
            checked={includeGuide}
            onChange={(e) => setIncludeGuide(e.target.checked)}
            className="h-4 w-4 accent-mitti-olive"
          />
          Include local guide ( ₹{homestay.pricing.guideFee}/night)
        </label>
      )}

      {/* Price */}
      <PriceBreakdown
        homestay={homestay}
        dateRange={dateRange}
        includeGuide={includeGuide}
      />

      {/* CTA */}
      <Button
        onClick={handleReserve}
        disabled={submitting || nights < 1}
        className="w-full rounded-xl bg-mitti-brown text-white hover:bg-mitti-brown/90 cursor-pointer"
      >
        {submitting ? "Booking…" : "Reserve"}
      </Button>

      <p className="text-center text-xs text-mitti-dark-brown/60">
        You will not be charged yet
      </p>
    </div>
  );
}
