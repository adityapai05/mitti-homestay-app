"use client";

import { useState, useEffect } from "react";
import { Users, ChevronUp, ChevronDown } from "lucide-react";
import { Homestay } from "@/types";
import DateRangePicker from "@/components/ui/prebuilt-components/date-range-picker";

interface PricingBookingSectionProps {
  homestay: Homestay;
}

const PricingBookingSection: React.FC<PricingBookingSectionProps> = ({
  homestay,
}) => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [guests, setGuests] = useState(1);
  const [includeGuide, setIncludeGuide] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookedDates = async () => {
      //TODO: Replace with real API endpoint
      setBookedDates([]);
      setLoading(false);
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
  const totalPrice = basePrice + (includeGuide ? guideFee : 0);

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
            <button
              className="py-2 px-4 bg-mitti-brown text-white rounded-full hover:bg-mitti-brown/90 transition"
              aria-label="Book now"
            >
              Book Now
            </button>
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
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full p-2 border border-mitti-beige rounded-lg"
                  />
                </div>
              </div>
              {homestay.guideAvailable && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeGuide}
                    onChange={(e) => setIncludeGuide(e.target.checked)}
                    className="h-5 w-5 text-mitti-olive"
                  />
                  <label className="text-mitti-dark-brown">
                    Include Local Guide (₹{homestay.guideFee}/day)
                  </label>
                </div>
              )}
            </div>
            <div className="border-t border-mitti-beige pt-4">
              <p className="text-mitti-dark-brown">
                Total: ₹{totalPrice.toFixed(2)}
              </p>
            </div>
            <button
              className="w-full py-3 bg-mitti-brown text-white rounded-full hover:bg-mitti-brown/90 transition hidden sm:block"
              aria-label="Book now"
              disabled={loading || !dateRange.from || !dateRange.to}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default PricingBookingSection;
