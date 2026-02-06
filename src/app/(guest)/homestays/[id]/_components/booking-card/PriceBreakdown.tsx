"use client";

import { differenceInDays } from "date-fns";
import type { HomestayDetailsDTO } from "../../types";

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

  const gstRate = 0.18; // 18% GST
  const platformFeeRate = 0.05; // 5% convenience

  const pricePerNight = Number(homestay.pricing.pricePerNight);
  const stayTotal = nights * pricePerNight;

  const guideFeePerNight =
    homestay.pricing.guideAvailable && homestay.pricing.guideFee
      ? Number(homestay.pricing.guideFee)
      : 0;

  const guideTotal = includeGuide ? nights * guideFeePerNight : 0;
  const total = stayTotal + guideTotal;

  const gstAmount = Math.round(stayTotal * gstRate);
  const platformFeeAmount = Math.round(stayTotal * platformFeeRate);
  const grandTotal = stayTotal + guideTotal + gstAmount + platformFeeAmount;

  return (
    <div className="space-y-2 border-t border-mitti-khaki pt-4 text-sm text-mitti-dark-brown">
      <div className="flex justify-between">
        <span>
          ₹{pricePerNight} × {nights} nights
        </span>
        <span>₹{stayTotal}</span>
      </div>

      {includeGuide && guideFeePerNight > 0 && (
        <div className="flex justify-between">
          <span>Local guide</span>
          <span>₹{guideTotal}</span>
        </div>
      )}

      <div className="flex justify-between">
        <span>GST (18%)</span>
        <span>₹{gstAmount}</span>
      </div>

      <div className="flex justify-between">
        <span>Platform fee (5%)</span>
        <span>₹{platformFeeAmount}</span>
      </div>

      <div className="flex justify-between font-semibold pt-2 border-t border-mitti-khaki pt-4">
        <span>Total</span>
        <span>₹{grandTotal}</span>
      </div>
    </div>
  );
}
