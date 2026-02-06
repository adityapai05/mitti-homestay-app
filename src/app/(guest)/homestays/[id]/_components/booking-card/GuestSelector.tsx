"use client";

import { Users } from "lucide-react";

interface GuestSelectorProps {
  value?: number;
  maxGuests: number;
  onChange?: (guests: number) => void;
}

export default function GuestSelector({
  value = 1,
  maxGuests,
  onChange,
}: GuestSelectorProps) {
  const handleChange = (next: number) => {
    if (next < 1) return;
    if (next > maxGuests) return;
    onChange?.(next);
  };

  return (
    <div>
      <label className="text-sm font-medium text-mitti-dark-brown">
        Guests
      </label>

      <div className="mt-2 flex items-center gap-3 border border-mitti-khaki rounded-lg px-3 py-2 bg-white">
        <Users size={18} className="text-mitti-dark-brown/70" />

        <input
          type="number"
          min={1}
          max={maxGuests}
          value={value}
          onChange={(e) => handleChange(Number(e.target.value) || 1)}
          className="w-full bg-transparent outline-none text-mitti-dark-brown"
        />

        <span className="text-xs text-mitti-dark-brown/60 whitespace-nowrap">
          max {maxGuests}
        </span>
      </div>
    </div>
  );
}
