"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Users, ChevronUp, ChevronDown } from "lucide-react";
import { Homestay } from "@/types";
import DateRangePicker from "@/components/ui/prebuilt-components/date-range-picker";
import { Button } from "@/components/ui/prebuilt-components/button";
import { format, isValid, isBefore, startOfDay, differenceInDays } from "date-fns";
import {toast} from "sonner";

interface PricingBookingSectionProps {
  homestay: Homestay;
}

const PricingBookingSection: React.FC<PricingBookingSectionProps> = ({
  homestay,
}) => {
  const searchParams = useSearchParams();

  // Initialize from search parameters
  const initialCheckIn = searchParams.get("checkIn") || "";
  const initialCheckOut = searchParams.get("checkOut") || "";
  const initialGuests = Number(searchParams.get("guests")) || 1;

  // Validate dates
  const isValidDate = (date: string) => {
    const parsed = new Date(date);
    return isValid(parsed) && !isBefore(parsed, startOfDay(new Date()));
  };

  const validatedCheckIn = initialCheckIn && isValidDate(initialCheckIn) ? initialCheckIn : "";
  const validatedCheckOut =
    initialCheckOut &&
    isValidDate(initialCheckOut) &&
    validatedCheckIn &&
    isBefore(new Date(validatedCheckIn), new Date(initialCheckOut))
      ? initialCheckOut
      : "";

  // Validate guests
  const validatedGuests =
    Number.isInteger(initialGuests) &&
    initialGuests > 0 &&
    initialGuests <= homestay.maxGuests
      ? initialGuests
      : 1;

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: validatedCheckIn ? new Date(validatedCheckIn) : undefined,
    to: validatedCheckOut ? new Date(validatedCheckOut) : undefined,
  });
  const [guests, setGuests] = useState(validatedGuests);
  const [includeGuide, setIncludeGuide] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        // TODO: Replace with real API endpoint to fetch booked dates
        const response = await fetch(`/api/homestays/${homestay.id}/booked-dates`);
        const data = await response.json();
        setBookedDates(data.bookedDates || []);
      } catch (error) {
        console.error("Error fetching booked dates:", error);
        toast.error("Failed to load booked dates. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookedDates();
  }, [homestay.id]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const basePrice = parseFloat(homestay.pricePerNight);
  const guideFee = homestay.guideFee ? parseFloat(homestay.guideFee) : 0;
  const nights = dateRange.from && dateRange.to ? differenceInDays(dateRange.to, dateRange.from) : 0;
  const totalPrice = nights > 0 ? (basePrice + (includeGuide ? guideFee : 0)) * nights : 0;

  const handleBooking = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast.error("Please select both check-in and check-out dates.");
      return;
    }
    if (isBefore(dateRange.to, dateRange.from)) {
      toast.error("Check-out date must be after check-in date.");
      return;
    }
    if (guests < 1 || guests > homestay.maxGuests) {
      toast.error(`Please select between 1 and ${homestay.maxGuests} guests.`);
      return;
    }

    setBookingLoading(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homestayId: homestay.id,
          checkIn: format(dateRange.from, "yyyy-MM-dd"),
          checkOut: format(dateRange.to, "yyyy-MM-dd"),
          guests,
          includeGuide,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      toast.success("Booking Successful");
      // Optionally redirect or reset form
      setDateRange({ from: undefined, to: undefined });
      setGuests(1);
      setIncludeGuide(false);
    } catch {
      toast.error("An error occurred while booking. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <aside
      className={`
        lg:sticky lg:top-24 sm:p-6 p-4 bg-mitti-cream rounded-lg shadow-lg border border-mitti-khaki/20
        sm:relative sm:bottom-auto
        fixed bottom-0 left-0 right-0 z-50 sm:z-auto
      `}
    >
      <div className="max-w-7xl mx-auto">
        {/* Mobile Compact View */}
        <div className="sm:hidden flex justify-between items-center p-4 bg-mitti-cream border-t border-mitti-khaki/20">
          <div>
            <span className="text-lg font-semibold text-mitti-dark-brown">
              ₹{homestay.pricePerNight}/night
            </span>
            <span className="text-sm text-mitti-muted ml-2">
              {homestay.rating.toFixed(1)} ({homestay.reviewCount} reviews)
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="text-mitti-dark-brown"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={
                isExpanded
                  ? "Collapse booking details"
                  : "Expand booking details"
              }
            >
              {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
            <Button
              onClick={handleBooking}
              disabled={bookingLoading || !dateRange.from || !dateRange.to}
              className="py-2 px-4 bg-mitti-brown text-white rounded-full hover:bg-mitti-brown/90 transition"
              aria-label="Book now"
            >
              Book Now
            </Button>
          </div>
        </div>

        {/* Full Booking Form */}
        <div
          className={`
            ${isExpanded ? "block" : "hidden sm:block"}
            sm:p-0 p-4 bg-mitti-cream sm:bg-transparent
          `}
        >
          <div className="space-y-6">
            <div className="hidden sm:block">
              <h2 className="text-2xl font-semibold text-mitti-dark-brown">
                ₹{homestay.pricePerNight} / night
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-mitti-dark-brown font-medium">
                  Dates
                </label>
                {loading ? (
                  <p className="text-mitti-muted">Loading available dates...</p>
                ) : (
                  <DateRangePicker
                    bookedDates={bookedDates}
                    onChange={(range) => {
                      setDateRange({
                        from: range?.from,
                        to: range?.to,
                      });
                    }}
                    initialRange={{
                      from: validatedCheckIn ? new Date(validatedCheckIn) : undefined,
                      to: validatedCheckOut ? new Date(validatedCheckOut) : undefined,
                    }}
                    className="mt-1"
                  />
                )}
              </div>
              <div>
                <label className="text-mitti-dark-brown font-medium">
                  Guests
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Users size={20} className="text-mitti-olive" />
                  <input
                    type="number"
                    min="1"
                    max={homestay.maxGuests}
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                    className="w-full p-2 border border-mitti-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-mitti-olive"
                  />
                </div>
              </div>
              {homestay.guideAvailable && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeGuide}
                    onChange={(e) => setIncludeGuide(e.target.checked)}
                    className="h-5 w-5 text-mitti-olive focus:ring-mitti-olive"
                  />
                  <label className="text-mitti-dark-brown">
                    Include Local Guide (₹{homestay.guideFee}/day)
                  </label>
                </div>
              )}
            </div>
            {nights > 0 && (
              <div className="border-t border-mitti-beige pt-4">
                <p className="text-mitti-dark-brown">
                  Total for {nights} night{nights !== 1 ? "s" : ""}: ₹{totalPrice.toFixed(2)}
                </p>
              </div>
            )}
            <Button
              onClick={handleBooking}
              disabled={bookingLoading || !dateRange.from || !dateRange.to}
              className="w-full py-3 bg-mitti-brown text-white rounded-full font-semibold hover:bg-mitti-brown/90 transition hidden sm:block"
              aria-label="Book now"
            >
              {bookingLoading ? "Booking..." : "Book Now"}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default PricingBookingSection;