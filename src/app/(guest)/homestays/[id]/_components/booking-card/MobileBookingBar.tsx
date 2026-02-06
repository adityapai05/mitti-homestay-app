"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronUp } from "lucide-react";
import { differenceInDays } from "date-fns";

import type { HomestayDetailsDTO } from "../../types";
import BookingForm from "./BookingForm";
import { Button } from "@/components/ui/prebuilt-components/button";
import { calculateBookingPrice } from "@/lib/pricing/calculateBookingPrice";

interface MobileBookingBarProps {
  homestay: HomestayDetailsDTO;
  initialDateRange?: { from?: Date; to?: Date };
  initialGuests?: number;
}

export default function MobileBookingBar({
  homestay,
  initialDateRange,
  initialGuests = 1,
}: MobileBookingBarProps) {
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState(initialDateRange ?? {});
  const [guests, setGuests] = useState(initialGuests);

  if (typeof window === "undefined") return null;

  const nights =
    dateRange.from && dateRange.to
      ? differenceInDays(dateRange.to, dateRange.from)
      : 0;

  const estimate =
    nights > 0
      ? calculateBookingPrice({
          pricePerNight: Number(homestay.pricing.pricePerNight),
          nights,
          guests,
          includeGuide: false,
          guideFeePerNight: homestay.pricing.guideFee
            ? Number(homestay.pricing.guideFee)
            : 0,
        })
      : null;

  return (
    <>
      {/* Bottom bar */}
      <div
        role="button"
        onClick={() => setOpen(true)}
        className="
          fixed inset-x-0 bottom-0 z-[60] lg:hidden
          bg-white border-t border-mitti-khaki
          px-5 py-5
          pb-[calc(env(safe-area-inset-bottom)+20px)]
          flex items-center justify-between
          shadow-[0_-8px_24px_rgba(0,0,0,0.12)]
        "
      >
        <div>
          {estimate ? (
            <>
              <p className="text-base font-semibold text-mitti-dark-brown">
                ₹{estimate.breakdown.total.toLocaleString()} total
              </p>
              <p className="text-xs text-mitti-dark-brown/60">
                {nights} nights — {guests} guest{guests > 1 ? "s" : ""}
              </p>
            </>
          ) : (
            <>
              <p className="text-base font-semibold text-mitti-dark-brown">
                ₹{homestay.pricing.pricePerNight} / night
              </p>
              <p className="text-xs text-mitti-dark-brown/60">
                Taxes not included
              </p>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            className="rounded-xl bg-mitti-brown text-white px-6 h-11"
          >
            Reserve
          </Button>
          <ChevronUp className="h-5 w-5 text-mitti-dark-brown/60" />
        </div>
      </div>

      {/* Sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/40"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-2xl max-h-[92vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
            >
              <div className="p-4 border-b border-mitti-khaki flex justify-between">
                <p className="font-semibold">Book your stay</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6">
                <BookingForm
                  homestay={homestay}
                  dateVariant="sheet"
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  guests={guests}
                  setGuests={setGuests}
                  onAuthRequired={() => setOpen(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
