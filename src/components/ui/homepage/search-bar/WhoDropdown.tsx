"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";

interface Guests {
  adults: number;
  children: number;
  infants: number;
}

interface WhoDropdownProps {
  guests: Guests;
  setGuests: React.Dispatch<React.SetStateAction<Guests>>;
}

const MAX_GUESTS = 15;

const WhoDropdown: React.FC<WhoDropdownProps> = ({ guests, setGuests }) => {
  const totalGuests = guests.adults + guests.children + guests.infants;

  const canIncrement = () => totalGuests < MAX_GUESTS;
  const canDecrement = (type: keyof Guests) => {
    const current = guests[type];
    if (current === 0) return false;
    if (
      type === "adults" &&
      current === 1 &&
      (guests.children > 0 || guests.infants > 0)
    )
      return false;
    return true;
  };

  const updateGuest = (type: keyof Guests, delta: number) => {
    setGuests((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  return (
    <div className=" shadow-xl rounded-xl p-4 space-y-3 bg-mitti-beige border-2 border-mitti-dark-brown ">
      {["adults", "children", "infants"].map((type) => (
        <div key={type} className="flex justify-between items-center">
          <p className="capitalize">{type}</p>
          <div className="flex items-center gap-2">
            <button
              disabled={!canDecrement(type as keyof typeof guests)}
              onClick={(e) => {
                e.stopPropagation();
                updateGuest(type as keyof Guests, -1);
              }}
              className="border p-1 rounded-full disabled:opacity-30"
            >
              <Minus size={16} />
            </button>
            <span className="w-6 text-center">
              {guests[type as keyof typeof guests]}
            </span>
            <button
              disabled={!canIncrement()}
              onClick={(e) => {
                e.stopPropagation();
                updateGuest(type as keyof Guests, 1);
              }}
              className="border p-1 rounded-full disabled:opacity-30"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      ))}
      <p className="text-xs mt-1">
        Max {MAX_GUESTS} guests. At least 1 adult required.
      </p>
    </div>
  );
};

export default WhoDropdown;
