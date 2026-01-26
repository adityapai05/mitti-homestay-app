"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Users, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { format, differenceInDays, isBefore } from "date-fns";
import { toast } from "sonner";

import { Homestay } from "@/types";
import DateRangePicker from "@/components/ui/prebuilt-components/date-range-picker";
import { Button } from "@/components/ui/prebuilt-components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/prebuilt-components/collapsible";
import { useAuthModal } from "@/hooks/useAuthModal";

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

const cancellationPolicySummary: Record<string, string> = {
  FLEXIBLE: "Free cancellation up to 7 days before check-in",
  MODERATE:
    "Free cancellation up to 14 days before check-in, 50% refund up to 7 days",
  STRICT: "50% refund only if cancelled at least 30 days before check-in",
};

const cancellationPolicyDescription: Record<string, string> = {
  FLEXIBLE:
    "Guests will receive a full refund if they cancel at least 7 days before check-in. Cancellations made closer to check-in are non-refundable.",
  MODERATE:
    "Guests will receive a full refund if they cancel at least 14 days before check-in. If cancelled between 7 and 14 days before check-in, a 50% refund is issued. No refund is provided for cancellations within 7 days.",
  STRICT:
    "Guests will receive a 50% refund only if they cancel at least 30 days before check-in. Cancellations made after that period are non-refundable.",
};

const PricingBookingSection = ({ homestay }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openModal } = useAuthModal();

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

  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [guests, setGuests] = useState(
    Math.min(Math.max(initialGuests, 1), homestay.maxGuests)
  );
  const [submitting, setSubmitting] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [includeGuide, setIncludeGuide] = useState(false);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const res = await fetch(`/api/homestays/${homestay.id}/booked-dates`);
        if (!res.ok) return;
        const data: { dates: string[] } = await res.json();
        setBookedDates(data.dates.map((d) => new Date(d)));
      } catch {}
    };

    fetchBookedDates();
  }, [homestay.id]);

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
        toast.error("Please log in to continue.");
        openModal("login");
        return;
      }

      if (res.status === 400 || res.status === 403 || res.status === 409) {
        const data = await res.json();
        const key =
          typeof data.error === "string" ? data.error : data.error?.message;
        toast.error(
          bookingErrorMessages[key] ||
            "Booking could not be completed. Please try again."
        );
        return;
      }

      if (!res.ok) throw new Error();

      const data = await res.json();
      toast.success("Booking confirmed.");
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
        {/* Price */}
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
            className="mt-2"
            bookedDates={bookedDates}
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
              onChange={(e) => setGuests(Number(e.target.value) || 1)}
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

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

        {/* Cancellation policy */}
        <Collapsible open={policyOpen} onOpenChange={setPolicyOpen}>
          <div className="border-t border-mitti-khaki pt-4">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between text-left">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-mitti-olive" />
                  <div>
                    <p className="text-sm font-medium text-mitti-dark-brown">
                      Cancellation policy
                    </p>
                    <p className="text-xs text-mitti-dark-brown/70">
                      {cancellationPolicySummary[homestay.cancellationPolicy]}
                    </p>
                  </div>
                </div>
                {policyOpen ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-3 text-sm text-mitti-dark-brown/80 leading-relaxed">
              {cancellationPolicyDescription[homestay.cancellationPolicy]}
            </CollapsibleContent>
          </div>
        </Collapsible>

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
          className="w-full rounded-xl bg-mitti-brown text-white hover:bg-mitti-brown/90"
        >
          {submitting ? "Booking…" : "Reserve"}
        </Button>
      </div>
    </aside>
  );
};

export default PricingBookingSection;
