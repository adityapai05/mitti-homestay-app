"use client";

import { useEffect, useMemo } from "react";
import { format, differenceInDays, isBefore } from "date-fns";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import type { HomestayDetailsDTO } from "../../types";

import DateSelector from "./DateSelector";
import GuestSelector from "./GuestSelector";
import PriceBreakdown from "./PriceBreakdown";

import { Button } from "@/components/ui/prebuilt-components/button";
import { useAuthModal } from "@/hooks/useAuthModal";
import { Input } from "@/components/ui/prebuilt-components/input";

interface BookingFormProps {
  homestay: HomestayDetailsDTO;
  dateVariant?: "popover" | "sheet";

  dateRange: { from?: Date; to?: Date };
  setDateRange: (r: { from?: Date; to?: Date }) => void;

  guests: number;
  setGuests: (n: number) => void;

  onAuthRequired?: () => void;
}

const bookingErrorMessages: Record<string, string> = {
  HOMESTAY_NOT_FOUND: "This homestay is no longer available.",
  HOMESTAY_NOT_VERIFIED: "This homestay is not verified yet.",
  CANNOT_BOOK_OWN_HOMESTAY: "You cannot book your own homestay.",
  MAX_GUESTS_EXCEEDED: "The number of guests exceeds the allowed limit.",
  DATES_NOT_AVAILABLE:
    "These dates were just booked. Please choose different dates.",
  EMAIL_NOT_VERIFIED: "Please verify your email before requesting a booking.",
};

type BookingFormValues = {
  dateRange: { from?: Date; to?: Date };
  guests: number;
  includeGuide: boolean;
};

export default function BookingForm({
  homestay,
  dateVariant = "popover",
  dateRange,
  setDateRange,
  guests,
  setGuests,
  onAuthRequired,
}: BookingFormProps) {
  const { openModal } = useAuthModal();

  const bookingFormSchema = useMemo(
    () =>
      z
        .object({
          dateRange: z.object({
            from: z.date().optional(),
            to: z.date().optional(),
          }),
          guests: z.number().int().min(1).max(homestay.capacity.maxGuests),
          includeGuide: z.boolean(),
        })
        .superRefine((value, ctx) => {
          if (!value.dateRange.from || !value.dateRange.to) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["dateRange"],
              message: "Please select check-in and check-out dates.",
            });
            return;
          }

          if (
            isBefore(value.dateRange.to, value.dateRange.from) ||
            differenceInDays(value.dateRange.to, value.dateRange.from) < 1
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["dateRange"],
              message: "Minimum stay is 1 night.",
            });
          }
        }),
    [homestay.capacity.maxGuests],
  );

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, isValid },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      dateRange,
      guests,
      includeGuide: false,
    },
  });

  const selectedDateRange = watch("dateRange");
  const selectedGuests = watch("guests");
  const includeGuide = watch("includeGuide");

  useEffect(() => {
    setDateRange(selectedDateRange);
  }, [selectedDateRange, setDateRange]);

  useEffect(() => {
    setGuests(selectedGuests);
  }, [selectedGuests, setGuests]);

  const nights = useMemo(() => {
    if (!selectedDateRange.from || !selectedDateRange.to) return 0;
    return differenceInDays(selectedDateRange.to, selectedDateRange.from);
  }, [selectedDateRange]);

  const handleReserve = handleSubmit(async (values) => {
    if (!values.dateRange.from || !values.dateRange.to) {
      toast.error("Please select check-in and check-out dates.");
      return;
    }

    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homestayId: homestay.id,
          checkIn: format(values.dateRange.from, "yyyy-MM-dd"),
          checkOut: format(values.dateRange.to, "yyyy-MM-dd"),
          guests: values.guests,
        }),
      });

      if (res.status === 401) {
        toast.error("Please log in to continue.");

        onAuthRequired?.();
        openModal("login");

        return;
      }

      if (!res.ok) {
        const data = await res.json();

        const code = data.code || data.error;

        if (code === "EMAIL_NOT_VERIFIED") {
          toast.error("Please verify your email before requesting a booking.");
          return;
        }

        toast.error(
          bookingErrorMessages[code] ||
            data.error ||
            "Booking could not be completed.",
        );
        return;
      }

      const data = await res.json();
      toast.success("Booking request sent to host.");
      window.location.href = `/bookings/${data.booking.id}`;
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  });

  return (
    <div className="space-y-6">
      {/* Dates */}
      <Controller
        control={control}
        name="dateRange"
        render={({ field }) => (
          <DateSelector
            homestayId={homestay.id}
            value={field.value}
            onChange={field.onChange}
            variant={dateVariant}
          />
        )}
      />

      {/* Guests */}
      <Controller
        control={control}
        name="guests"
        render={({ field }) => (
          <GuestSelector
            value={field.value}
            maxGuests={homestay.capacity.maxGuests}
            onChange={field.onChange}
          />
        )}
      />

      {/* Guide option */}
      {homestay.pricing.guideAvailable && (
        <Controller
          control={control}
          name="includeGuide"
          render={({ field }) => (
            <label className="flex items-center gap-3 text-sm text-mitti-dark-brown">
              <Input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="h-4 w-4 accent-mitti-olive"
              />
              Include local guide ( Rs.{homestay.pricing.guideFee}/night)
            </label>
          )}
        />
      )}

      {/* Price */}
      <PriceBreakdown
        homestay={homestay}
        dateRange={selectedDateRange}
        includeGuide={includeGuide}
      />

      {/* CTA */}
      <Button
        onClick={handleReserve}
        disabled={isSubmitting || !isValid || nights < 1}
        className="w-full rounded-xl bg-mitti-brown text-white hover:bg-mitti-brown/90 cursor-pointer"
      >
        {isSubmitting ? "Booking..." : "Reserve"}
      </Button>

      <p className="text-center text-xs text-mitti-dark-brown/60">
        You will not be charged yet
      </p>
    </div>
  );
}