"use client";

import { Calendar } from "@/components/ui/prebuilt-components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/prebuilt-components/popover";
import { Button } from "@/components/ui/prebuilt-components/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

export interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  disabled?: (date: Date) => boolean;
  modifiers?: Record<string, (date: Date) => boolean>;
  modifiersClassNames?: Record<string, string>;
  className?: string;
  variant?: "popover" | "sheet";
}

export default function DateRangePicker({
  value,
  onChange,
  disabled,
  modifiers,
  modifiersClassNames,
  className,
  variant = "popover",
}: DateRangePickerProps) {
  /* ---------------- MOBILE SHEET MODE ---------------- */
  if (variant === "sheet") {
    return (
      <div
        className={cn(
          "rounded-xl border border-mitti-khaki px-3 py-4",
          className,
        )}
      >
        <div className="flex justify-center">
          <div className="w-[320px] max-w-full">
            <Calendar
              mode="range"
              numberOfMonths={1}
              selected={value}
              onSelect={onChange}
              disabled={disabled}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              className="text-mitti-dark-brown mx-auto"
            />
          </div>
        </div>
      </div>
    );
  }
  /* ---------------- DESKTOP POPOVER MODE ---------------- */
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal border-mitti-khaki bg-white text-mitti-dark-brown",
              !value?.from && "text-mitti-dark-brown/60",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-mitti-olive" />
            {value?.from
              ? value.to
                ? `${format(value.from, "LLL dd, y")} – ${format(
                    value.to,
                    "LLL dd, y",
                  )}`
                : format(value.from, "LLL dd, y")
              : "Select check-in and check-out"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 bg-mitti-beige border border-mitti-khaki shadow-lg rounded-xl">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={value}
            onSelect={onChange}
            disabled={disabled}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="text-mitti-dark-brown"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
