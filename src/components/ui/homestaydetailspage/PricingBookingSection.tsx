"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { format, differenceInDays, isBefore } from "date-fns";
import { toast } from "sonner";

import { Homestay } from "@/types";
import DateRangePicker from "@/components/ui/prebuilt-components/date-range-picker";
import { Button } from "@/components/ui/prebuilt-components/button";

interface Props {
  homestay: Homestay;
}

const bookingErrorMessages: Record<string, string> = {
  HOMESTAY_NOT_FOUND: "This homestay no longer exists or is unavailable.",

  HOMESTAY_NOT_VERIFIED:
    "This homestay is not verified yet. Please try again later.",

  CANNOT_BOOK_OWN_HOMESTAY:
    "You cannot book your own homestay. Switch to a guest account to continue.",

  MAX_GUESTS_EXCEEDED:
    "The number of guests exceeds the maximum allowed for this homestay.",

  DATES_NOT_AVAILABLE:
    "These dates have just been booked by someone else. Please select different dates.",
};

const PricingBookingSection = ({ homestay }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCheckIn = searchParams.get("checkIn");
  const initialCheckOut = searchParams.get("checkOut");
  const initialGuests = Number(searchParams.get("guests")) || 1;

  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({
    from: initialCheckIn ? new Date(initialCheckIn) : undefined,
    to: initialCheckOut ? new Date(initialCheckOut) : undefined,
  });

  const [guests, setGuests] = useState(
    Math.min(Math.max(initialGuests, 1), homestay.maxGuests)
  );

  const [includeGuide, setIncludeGuide] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const nights = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return 0;
    return differenceInDays(dateRange.to, dateRange.from);
  }, [dateRange]);

  const basePrice = Number(homestay.pricePerNight);
  const guideFee = homestay.guideAvailable ? Number(homestay.guideFee || 0) : 0;

  const stayTotal = nights * basePrice;
  const guideTotal = includeGuide ? nights * guideFee : 0;
  const totalPrice = stayTotal + guideTotal;

  const handleBooking = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast.error("Please select both check-in and check-out dates.");
      return;
    }

    if (isBefore(dateRange.to, dateRange.from) || nights < 1) {
      toast.error("Minimum stay is 1 night.");
      return;
    }

    if (guests < 1 || guests > homestay.maxGuests) {
      toast.error(`Maximum ${homestay.maxGuests} guests allowed.`);
      return;
    }

    setSubmitting(true);

    try {
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
        toast.error("Please log in to continue with your booking.");
        router.push("/login");
        return;
      }

      if (res.status === 400 || res.status === 403 || res.status === 409) {
        const data = await res.json();

        const backendError =
          typeof data.error === "string" ? data.error : data.error?.message;

        const friendlyMessage =
          bookingErrorMessages[backendError] ||
          "This booking could not be completed. Please review your details and try again.";

        toast.error(friendlyMessage);
        return;
      }

      if (!res.ok) {
        throw new Error("Booking failed");
      }

      const data = await res.json();

      toast.success("Booking confirmed. Your stay is reserved.");
      router.push(`/bookings/${data.booking.id}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="rounded-2xl border border-mitti-khaki bg-mitti-cream p-6 shadow-sm space-y-6">
        {/* Price header */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-mitti-dark-brown">
            ₹{basePrice}
          </span>
          <span className="text-sm text-mitti-dark-brown/70">per night</span>
        </div>

        {/* Dates */}
        <div>
          <label className="text-sm font-medium text-mitti-dark-brown">
            Dates
          </label>
          <DateRangePicker
            className="mt-2 cursor-pointer"
            bookedDates={[]}
            initialRange={dateRange}
            onChange={(range) =>
              setDateRange({ from: range?.from, to: range?.to })
            }
          />
        </div>

        {/* Guests */}
        <div>
          <label className="text-sm font-medium text-mitti-dark-brown">
            Guests
          </label>

          <div className="mt-2 flex items-center gap-2 border border-mitti-khaki rounded-lg px-3 py-2">
            <Users size={18} />

            <input
              type="number"
              min={1}
              max={homestay.maxGuests}
              value={guests}
              onChange={(e) => {
                const value = Number(e.target.value) || 1;

                if (value > homestay.maxGuests) {
                  toast.error(
                    `This homestay allows a maximum of ${
                      homestay.maxGuests
                    } guest${homestay.maxGuests > 1 ? "s" : ""}.`
                  );
                  setGuests(homestay.maxGuests);
                  return;
                }

                if (value < 1) {
                  setGuests(1);
                  return;
                }

                setGuests(value);
              }}
              className="w-full bg-transparent outline-none"
            />
          </div>

          <p className="mt-1 text-xs text-mitti-dark-brown/60">
            Maximum {homestay.maxGuests} guest
            {homestay.maxGuests > 1 ? "s" : ""}
          </p>
        </div>

        {/* Guide */}
        {homestay.guideAvailable && (
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={includeGuide}
              onChange={(e) => setIncludeGuide(e.target.checked)}
              className="h-4 w-4 accent-mitti-olive"
            />
            <span className="text-sm text-mitti-dark-brown">
              Include local guide (₹{guideFee}/night)
            </span>
          </div>
        )}

        {/* Price breakdown */}
        {nights > 0 && (
          <div className="space-y-2 border-t border-mitti-khaki pt-4 text-sm">
            <div className="flex justify-between">
              <span>
                ₹{basePrice} × {nights} nights
              </span>
              <span>₹{stayTotal}</span>
            </div>

            {includeGuide && (
              <div className="flex justify-between">
                <span>Guide fee</span>
                <span>₹{guideTotal}</span>
              </div>
            )}

            <div className="flex justify-between font-semibold pt-2">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
        )}

        {/* CTA */}
        <Button
          onClick={handleBooking}
          disabled={submitting || nights < 1}
          className="w-full rounded-xl bg-mitti-brown text-white hover:bg-mitti-brown/90 cursor-pointer"
        >
          {submitting ? "Booking…" : "Reserve"}
        </Button>
      </div>
    </aside>
  );
};

export default PricingBookingSection;
