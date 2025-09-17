"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";

interface WhoDropdownProps {
  guests: number;
  setGuests: React.Dispatch<React.SetStateAction<number>>;
}

const MAX_GUESTS = 15;

const WhoDropdown: React.FC<WhoDropdownProps> = ({ guests, setGuests }) => {
  const canIncrement = () => guests < MAX_GUESTS;
  const canDecrement = () => guests > 1;

  const updateGuest = (delta: number) => {
    setGuests((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="shadow-xl rounded-xl p-4 space-y-3 bg-mitti-beige border-2 border-mitti-dark-brown">
      <div className="flex justify-between items-center">
        <p>Guests</p>
        <div className="flex items-center gap-2">
          <button
            disabled={!canDecrement()}
            onClick={(e) => {
              e.stopPropagation();
              updateGuest(-1);
            }}
            className="border p-1 rounded-full disabled:opacity-30"
          >
            <Minus size={16} />
          </button>
          <span className="w-6 text-center">{guests}</span>
          <button
            disabled={!canIncrement()}
            onClick={(e) => {
              e.stopPropagation();
              updateGuest(1);
            }}
            className="border p-1 rounded-full disabled:opacity-30"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <p className="text-xs mt-1">
        Max {MAX_GUESTS} guests. At least 1 guest required.
      </p>
    </div>
  );
};

export default WhoDropdown;
