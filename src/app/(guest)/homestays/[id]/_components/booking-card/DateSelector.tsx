"use client";

import { useEffect, useMemo, useState } from "react";
import { isBefore, addDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";

import DateRangePicker from "@/components/ui/prebuilt-components/date-range-picker";
import { Skeleton } from "@/components/ui/prebuilt-components/skeleton";

interface DateSelectorProps {
  homestayId: string;
  value?: {
    from?: Date;
    to?: Date;
  };
  onChange?: (range: { from?: Date; to?: Date }) => void;
  variant?: "popover" | "sheet";
}

export default function DateSelector({
  homestayId,
  value,
  onChange,
  variant = "popover",
}: DateSelectorProps) {
  const [range, setRange] = useState<DateRange | undefined>(() => {
    if (value?.from) {
      return { from: value.from, to: value.to };
    }
    return undefined;
  });

  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  /* ------------------------------------------------------------ */
  /* Keep local state in sync with parent */
  /* ------------------------------------------------------------ */
  useEffect(() => {
    if (value?.from) {
      setRange({ from: value.from, to: value.to });
    } else {
      setRange(undefined);
    }
  }, [value?.from, value?.to]);

  /* ------------------------------------------------------------ */
  /* Fetch booked dates */
  /* ------------------------------------------------------------ */
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const res = await fetch(`/api/homestays/${homestayId}/booked-dates`);
        if (!res.ok) return;

        const data: { dates: string[] } = await res.json();
        setBookedDates(data.dates.map((d) => new Date(d)));
      } finally {
        setLoading(false);
      }
    };

    fetchBookedDates();
  }, [homestayId]);

  /* ------------------------------------------------------------ */
  /* Normalize booked dates for O(1) lookup */
  /* ------------------------------------------------------------ */
  const bookedSet = useMemo(
    () => new Set(bookedDates.map((d) => d.toISOString().slice(0, 10))),
    [bookedDates],
  );

  const isBooked = (date: Date) =>
    bookedSet.has(date.toISOString().slice(0, 10));

  /* ------------------------------------------------------------ */
  /* Validate full range strictly */
  /* ------------------------------------------------------------ */
  const isRangeValid = (from: Date, to: Date) => {
    let cursor = from;

    while (cursor < to) {
      if (isBooked(cursor)) return false;
      cursor = addDays(cursor, 1);
    }

    return true;
  };

  /* ------------------------------------------------------------ */
  /* Disable logic for calendar */
  /* ------------------------------------------------------------ */
  const isDisabled = (date: Date) => {
    if (isBefore(date, new Date())) return true;
    if (isBooked(date)) return true;

    if (range?.from && !range.to && date > range.from) {
      return !isRangeValid(range.from, date);
    }

    return false;
  };

  /* ------------------------------------------------------------ */
  /* Handle selection with user feedback */
  /* ------------------------------------------------------------ */
  const handleSelect = (next: DateRange | undefined) => {
    // Clear
    if (!next?.from) {
      setRange(undefined);
      onChange?.({});
      return;
    }

    // Selecting only check-in
    if (!next.to) {
      if (isBooked(next.from)) {
        toast.error("This date is already booked.");
        setRange(undefined);
        onChange?.({});
        return;
      }

      setRange({ from: next.from });
      onChange?.({ from: next.from });
      return;
    }

    // Full range selected but invalid
    if (!isRangeValid(next.from, next.to)) {
      toast.error(
        "These dates overlap with an existing booking. Please choose different dates.",
      );

      // Clear everything so user can retry cleanly
      setRange(undefined);
      onChange?.({});
      return;
    }

    // Valid range
    setRange(next);
    onChange?.({ from: next.from, to: next.to });
  };

  /* ------------------------------------------------------------ */
  return (
    <div>
      <label className="text-sm font-medium text-mitti-dark-brown">Dates</label>

      <div className="mt-2">
        {loading ? (
          variant === "sheet" ? (
            <div className="rounded-xl border border-mitti-khaki p-4 flex justify-center">
              <div className="w-[320px] space-y-3">
                <Skeleton className="h-6 w-40 mx-auto" />
                <Skeleton className="h-[260px] w-full rounded-lg" />
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-mitti-khaki px-3 py-2 bg-white">
              <Skeleton className="h-5 w-3/4" />
            </div>
          )
        ) : (
          <DateRangePicker
            variant={variant}
            value={range}
            onChange={handleSelect}
            disabled={isDisabled}
            modifiers={{
              booked: (date) => isBooked(date),
            }}
            modifiersClassNames={{
              booked:
                "bg-red-100/70 text-red-700 line-through cursor-not-allowed",
            }}
          />
        )}
      </div>
    </div>
  );
}
