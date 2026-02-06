"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronUp } from "lucide-react";

import type { HomestayDetailsDTO } from "../../types";
import BookingForm from "./BookingForm";
import { Button } from "@/components/ui/prebuilt-components/button";
import { differenceInDays } from "date-fns";

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

  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>(initialDateRange ?? {});

  const [guests, setGuests] = useState(initialGuests);

  if (typeof window === "undefined") return null;
  const nights =
    dateRange.from && dateRange.to
      ? differenceInDays(dateRange.to, dateRange.from)
      : 0;

  const pricePerNight = Number(homestay.pricing.pricePerNight);
  const stayCost = nights * pricePerNight;

  // Placeholder until we add fees:
  const taxRate = 0.18; // example GST 18%
  const gst = Math.round(stayCost * taxRate);

  const platformFee = Math.round(stayCost * 0.05); // example 5% convenience fee

  const totalEstimate = stayCost + gst + platformFee;
  return (
    <>
      {/* Bottom booking bar */}
      <div
        role="button"
        aria-label="Open booking sheet"
        onClick={() => setOpen(true)}
        className="
    fixed inset-x-0 bottom-0 z-[60] lg:hidden
    bg-white border-t border-mitti-khaki
    px-5 py-5
    pb-[calc(env(safe-area-inset-bottom)+20px)]
    flex items-center justify-between
    shadow-[0_-8px_24px_rgba(0,0,0,0.12)]
    active:bg-mitti-beige/60
  "
      >
        {/* Price info */}
        <div>
          {nights > 0 ? (
            <>
              <p className="text-base font-semibold text-mitti-dark-brown">
                ₹{totalEstimate.toLocaleString()} total
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

        {/* Right action */}
        <div className="flex items-center gap-3">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            className="rounded-xl bg-mitti-brown text-white hover:bg-mitti-brown/90 px-6 h-11"
          >
            Reserve
          </Button>

          <ChevronUp className="h-5 w-5 text-mitti-dark-brown/60" />
        </div>
      </div>

      {/* Slide-up booking sheet */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              className="
                fixed inset-x-0 bottom-0 z-[70]
                bg-white rounded-t-2xl
                max-h-[92vh] overflow-y-auto
              "
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
            >
              {/* Header */}
              <div className="p-4 border-b border-mitti-khaki flex items-center justify-between">
                <p className="text-base font-semibold text-mitti-dark-brown">
                  Book your stay
                </p>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5 text-mitti-dark-brown" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 pb-[calc(env(safe-area-inset-bottom)+32px)]">
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
