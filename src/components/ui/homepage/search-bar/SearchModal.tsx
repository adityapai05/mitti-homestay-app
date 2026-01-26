"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import qs from "query-string";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/prebuilt-components/dialog";
import { Button } from "@/components/ui/prebuilt-components/button";
import { Calendar } from "@/components/ui/prebuilt-components/calendar";
import type { DateRange } from "react-day-picker";
import SearchLocationPicker, { LocationValue } from "./SearchLocationPicker";
import { MapPin, Calendar as CalendarIcon, Users } from "lucide-react";

type Step = 1 | 2 | 3 | 4;

interface SearchModalProps {
  onClose: () => void;
  initialLocation?: LocationValue;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}

export default function SearchModal({ onClose, initialLocation, initialCheckIn, initialCheckOut, initialGuests }: SearchModalProps) {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);

  const [location, setLocation] = useState<LocationValue | undefined>(
    initialLocation,
  );

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (initialCheckIn && initialCheckOut) {
      return {
        from: new Date(initialCheckIn),
        to: new Date(initialCheckOut),
      };
    }
    return undefined;
  });

  const [guests, setGuests] = useState<number>(initialGuests ?? 1);

  const canContinue =
    (step === 1 && !!location) ||
    (step === 2 && !!dateRange?.from && !!dateRange?.to) ||
    step === 3;

  const handleSearch = () => {
    const query = qs.stringifyUrl(
      {
        url: "/explore",
        query: {
          location: location?.label,
          lat: location?.latitude,
          lng: location?.longitude,
          checkIn: dateRange?.from?.toISOString(),
          checkOut: dateRange?.to?.toISOString(),
          guests,
        },
      },
      { skipNull: true },
    );

    router.push(query);
    onClose();
  };

  const subtitle =
    step === 1
      ? "Search villages, towns, or rural regions in India."
      : step === 2
        ? "Choose your check-in and check-out dates."
        : step === 3
          ? "Let hosts know how many guests to expect."
          : "Confirm the details before searching stays.";

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-full max-w-3xl rounded-4xl bg-mitti-cream p-0 mx-auto">
        <div className="flex flex-col">
          {/* HEADER */}
          <div className="border-b border-mitti-khaki px-8 py-6">
            <p className="text-sm text-mitti-dark-brown">Step {step} of 4</p>
            <h2 className="mt-1 text-2xl font-semibold text-mitti-dark-brown">
              {step === 1 && "Where do you want to go?"}
              {step === 2 && "When are you traveling?"}
              {step === 3 && "Who’s coming?"}
              {step === 4 && "Review your trip"}
            </h2>
            <p className="mt-1 text-sm text-mitti-dark-brown">{subtitle}</p>
          </div>

          {/* BODY */}
          <div className="px-8 py-8">
            {step === 1 && (
              <SearchLocationPicker value={location} onChange={setLocation} />
            )}

            {step === 2 && (
              <div className="flex flex-col items-center gap-6">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={1}
                  disabled={(date) => date < new Date()}
                  className="rounded-2xl border border-mitti-khaki bg-white p-4"
                />

                {dateRange?.from && dateRange?.to && (
                  <div className="flex items-center gap-3 rounded-xl bg-mitti-beige px-5 py-3 text-mitti-dark-brown">
                    <CalendarIcon size={18} />
                    <span className="font-medium">
                      {dateRange.from.toDateString()} →{" "}
                      {dateRange.to.toDateString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="mx-auto max-w-sm rounded-2xl border border-mitti-khaki bg-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-mitti-dark-brown">
                    <Users size={18} />
                    <span className="text-lg font-medium">
                      {guests} guest{guests > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      disabled={guests <= 1}
                      onClick={() => setGuests((g) => g - 1)}
                      className="cursor-pointer"
                    >
                      −
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setGuests((g) => g + 1)}
                      className="cursor-pointer"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="grid gap-4">
                <div className="rounded-2xl border border-mitti-khaki bg-white p-6">
                  <div className="flex items-center gap-3 text-mitti-dark-brown">
                    <MapPin size={18} />
                    <span className="font-medium">{location?.label}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-mitti-khaki bg-white p-6">
                  <div className="flex items-center gap-3 text-mitti-dark-brown">
                    <CalendarIcon size={18} />
                    <span>
                      {dateRange?.from?.toDateString()} →{" "}
                      {dateRange?.to?.toDateString()}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-mitti-khaki bg-white p-6">
                  <div className="flex items-center gap-3 text-mitti-dark-brown">
                    <Users size={18} />
                    <span>{guests} guests</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between border-t border-mitti-khaki bg-mitti-beige px-8 py-6">
            <Button
              variant="ghost"
              disabled={step === 1}
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="cursor-pointer hover:underline hover:bg-mitti-beige"
            >
              Back
            </Button>

            {step < 4 ? (
              <Button
                disabled={!canContinue}
                onClick={() => setStep((s) => (s + 1) as Step)}
                className="rounded-full bg-mitti-dark-brown px-8 text-white cursor-pointer"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleSearch}
                className="rounded-full bg-mitti-dark-brown px-8 text-white cursor-pointer"
              >
                Search stays
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
