"use client";

import { useState, useRef } from "react";
import { Search } from "lucide-react";
import useClickOutside from "@/hooks/useClickOutside";
import WhereDropdown from "./WhereDropdown";
import WhenDropdown from "./WhenDropdown";
import WhoDropdown from "./WhoDropdown";

const SearchBar = () => {
  const [activeSection, setActiveSection] = useState<
    "where" | "when" | "who" | null
  >(null);
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });

  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setActiveSection(null));

  const handleSearch = () => {
    console.log({ destination, checkIn, checkOut, guests });
    setActiveSection(null);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="bg-mitti-dark-brown text-mitti-beige rounded-full shadow-lg px-4 py-2 flex flex-col sm:flex-row items-stretch justify-between gap-1 sm:gap-0 overflow-hidden">
        <div
          className="flex-1 px-4 py-3 relative"
          onClick={() => setActiveSection("where")}
        >
          <p className="text-xs font-semibold uppercase">Where</p>
          <input
            type="text"
            placeholder="Search Destinations"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            disabled
            className="bg-transparent w-full text-sm focus:outline-none placeholder:text-mitti-beige"
          />
        </div>

        <div className="border-l border-mitti-beige/20 hidden sm:block" />

        <div
          className="flex-1 px-4 py-3 relative"
          onClick={() => setActiveSection("when")}
        >
          <p className="text-xs font-semibold uppercase">Check In</p>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="bg-transparent w-full text-sm focus:outline-none placeholder:text-mitti-beige"
          />
        </div>

        <div className="border-l border-mitti-beige/20 hidden sm:block" />

        <div
          className="flex-1 px-4 py-3"
          onClick={() => setActiveSection("when")}
        >
          <p className="text-xs font-semibold uppercase">Check Out</p>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="bg-transparent w-full text-sm focus:outline-none placeholder:text-mitti-beige"
          />
        </div>

        <div className="border-l border-mitti-beige/20 hidden sm:block" />

        <div
          className="flex-1 px-4 py-3 relative"
          onClick={() => setActiveSection("who")}
        >
          <p className="text-xs font-semibold uppercase">Who</p>
          <p className="text-sm">
            {guests.adults + guests.children + guests.infants} guests
          </p>
        </div>

        <button
          onClick={handleSearch}
          className="bg-mitti-beige text-mitti-dark-brown rounded-full w-13 h-13 flex items-center justify-center mt-2 sm:mt-0 sm:ml-4 self-center shrink-0"
        >
          <Search size={22} />
        </button>
      </div>

      <div
        ref={ref}
        className="absolute top-full left-0 w-full mt-2 z-50 text-mitti-dark-brown"
      >
        {activeSection === "where" && (
          <WhereDropdown value={destination} onChange={setDestination} />
        )}

        {activeSection === "when" && (
          <WhenDropdown
            checkIn={checkIn}
            checkOut={checkOut}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
          />
        )}

        {activeSection === "who" && (
          <WhoDropdown guests={guests} setGuests={setGuests} />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
