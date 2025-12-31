"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar } from "@/components/ui/prebuilt-components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/prebuilt-components/popover";
import { Button } from "@/components/ui/prebuilt-components/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, isBefore, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  bookedDates: Date[];
  onChange: (range: DateRange | undefined) => void;
  initialRange?: {
    from?: Date;
    to?: Date;
  };
  className?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  bookedDates,
  onChange,
  initialRange,
  className,
}) => {
  const [range, setRange] = useState<DateRange | undefined>(() => {
    if (initialRange?.from || initialRange?.to) {
      return {
        from: initialRange.from,
        to: initialRange.to,
      };
    }
    return undefined;
  });

  useEffect(() => {
    if (initialRange) {
      setRange({
        from: initialRange.from,
        to: initialRange.to,
      });
    }
  }, [initialRange]);

  const handleSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange);
    onChange(selectedRange);
  };

  // Memoize booked matcher for performance
  const bookedMatcher = useMemo(
    () => (date: Date) => bookedDates.some((booked) => isSameDay(booked, date)),
    [bookedDates]
  );

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal border-mitti-beige text-mitti-dark-brown cursor-pointer",
              !range?.from && !range?.to && "text-mitti-muted"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-mitti-olive" />
            {range?.from
              ? range.to
                ? `${format(range.from, "LLL dd, y")} - ${format(
                    range.to,
                    "LLL dd, y"
                  )}`
                : format(range.from, "LLL dd, y")
              : "Select check-in and check-out"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 bg-mitti-cream border-mitti-beige">
          <Calendar
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={2}
            autoFocus
            disabled={(date) =>
              isBefore(date, new Date()) || bookedMatcher(date)
            }
            modifiers={{
              booked: bookedMatcher,
            }}
            modifiersClassNames={{
              booked: "bg-red-100 text-red-700 line-through cursor-not-allowed",
            }}
            className="text-mitti-dark-brown border border-mitti-dark-brown rounded"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
