"use client";

import { useState } from "react";
import type { HomestayDetailsDTO } from "../../types";
import BookingForm from "./BookingForm";

interface DesktopBookingCardProps {
  homestay: HomestayDetailsDTO;
  initialDateRange?: { from?: Date; to?: Date };
  initialGuests?: number;
}

export default function DesktopBookingCard({
  homestay,
  initialDateRange,
  initialGuests = 1,
}: DesktopBookingCardProps) {
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>(initialDateRange ?? {});

  const [guests, setGuests] = useState(initialGuests);

  return (
    <div className="rounded-2xl border border-mitti-khaki bg-white shadow-sm">
      <div className="p-6 space-y-6">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-mitti-dark-brown">
            ₹{homestay.pricing.pricePerNight}
          </span>
          <span className="text-sm text-mitti-dark-brown/70">per night</span>
        </div>

        <BookingForm
          homestay={homestay}
          dateVariant="popover"
          dateRange={dateRange}
          setDateRange={setDateRange}
          guests={guests}
          setGuests={setGuests}
        />
      </div>
    </div>
  );
}
