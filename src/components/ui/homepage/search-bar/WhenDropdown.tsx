"use client";

import React from "react";

interface WhenDropdownProps {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
}

const WhenDropdown: React.FC<WhenDropdownProps> = ({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
}) => {
  return (
          <div className="bg-mitti-beige shadow-xl rounded-xl p-4 grid grid-cols-2 gap-4 border-2 border-mitti-dark-brown">
            <div>
              <p className="text-xs font-semibold mb-1">Check-In</p>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => onCheckInChange(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg text-sm"
              />
            </div>
            <div>
              <p className="text-xs font-semibold mb-1">Check-Out</p>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => onCheckOutChange(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg text-sm"
              />
            </div>
          </div>
  );
};

export default WhenDropdown;
