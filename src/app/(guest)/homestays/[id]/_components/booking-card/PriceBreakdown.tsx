"use client";

import { differenceInDays } from "date-fns";
import type { HomestayDetailsDTO } from "../../types";
import { calculateBookingPrice } from "@/lib/pricing/calculateBookingPrice";

interface PriceBreakdownProps {
  homestay: HomestayDetailsDTO;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  includeGuide?: boolean;
}

export default function PriceBreakdown({
  homestay,
  dateRange,
  includeGuide = false,
}: PriceBreakdownProps) {
  if (!dateRange?.from || !dateRange?.to) return null;

  const nights = differenceInDays(dateRange.to, dateRange.from);
  if (nights < 1) return null;

  const price = calculateBookingPrice({
    pricePerNight: Number(homestay.pricing.pricePerNight),
    nights,
    guests: 1,
    includeGuide,
    guideFeePerNight: homestay.pricing.guideFee
      ? Number(homestay.pricing.guideFee)
      : 0,
  });

  const { breakdown } = price;

  return (
    <div className="space-y-2 border-t border-mitti-khaki pt-4 text-sm text-mitti-dark-brown">
      <div className="flex justify-between">
        <span>
          ₹{homestay.pricing.pricePerNight} × {breakdown.nights} nights
        </span>
        <span>₹{breakdown.stayBase}</span>
      </div>

      {includeGuide && breakdown.guideFee > 0 && (
        <div className="flex justify-between">
          <span>Local guide</span>
          <span>₹{breakdown.guideFee}</span>
        </div>
      )}

      <div className="flex justify-between">
        <span>Platform fee</span>
        <span>₹{breakdown.platformFee}</span>
      </div>

      <div className="flex justify-between">
        <span>GST</span>
        <span>₹{breakdown.gst}</span>
      </div>

      <div className="flex justify-between font-semibold border-t border-mitti-khaki pt-4">
        <span>Total</span>
        <span>₹{breakdown.total}</span>
      </div>
    </div>
  );
}
