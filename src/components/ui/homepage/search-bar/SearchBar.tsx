"use client";

import { useState, useRef } from "react";
import { Check, Edit, Search } from "lucide-react";
import useClickOutside from "@/hooks/useClickOutside";
import WhereDropdown from "./WhereDropdown";
import WhenDropdown from "./WhenDropdown";
import WhoDropdown from "./WhoDropdown";
import { useSearchParams, useRouter } from "next/navigation";
import qs from "query-string";
import { Button } from "../../prebuilt-components/button";
import axios from "axios";

interface SearchBarProps {
  mode?: "search" | "edit";
}

const SearchBar = ({ mode = "search" }: SearchBarProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<
    "where" | "when" | "who" | null
  >(null);
  const [destination, setDestination] = useState(
    searchParams.get("destination") || ""
  );
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");
  const [guests, setGuests] = useState({
    adults: Number(searchParams.get("adults")) || 1,
    children: Number(searchParams.get("children")) || 0,
    infants: Number(searchParams.get("infants")) || 0,
  });

  const ref = useRef<HTMLDivElement>(null);
  const whereInputRef = useRef<HTMLInputElement>(null);
  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);
  const whoRef = useRef<HTMLButtonElement>(null);

  useClickOutside(ref, () => setActiveSection(null));

  const handleSearch = () => {
    const totalGuests = guests.adults + guests.children + guests.infants;

    const query = qs.stringifyUrl(
      {
        url: "/explore",
        query: {
          destination: destination || undefined,
          checkIn: checkIn || undefined,
          checkOut: checkOut || undefined,
          adults: guests.adults || undefined,
          children: guests.children || undefined,
          infants: guests.infants || undefined,
          totalGuests: totalGuests || undefined,
        },
      },
      { arrayFormat: "bracket" }
    );

    router.push(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent, step: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (step === "where") {
        setActiveSection("when");
        checkInRef.current?.focus();
      } else if (step === "checkIn") {
        checkOutRef.current?.focus();
      } else if (step === "checkOut") {
        setActiveSection("who");
        whoRef.current?.focus();
      } else if (step === "who") {
        handleSearch();
      }
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (mode === "search") {
      handleSearch();
    } else if (mode === "edit") {
      if (activeSection) {
        handleSearch();
        setActiveSection(null);
      } else {
        setActiveSection("where");
      }
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="bg-mitti-dark-brown text-mitti-beige rounded-full shadow-lg px-4 py-2 flex flex-col sm:flex-row items-stretch justify-between gap-1 sm:gap-0 overflow-hidden">
        {/* WHERE */}
        <div
          className="flex-1 px-4 py-3 relative"
          onClick={() => setActiveSection("where")}
        >
          <p className="text-xs font-semibold uppercase">Where</p>
          <input
            ref={whereInputRef}
            type="text"
            placeholder="Search Destinations"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "where")}
            className="bg-transparent w-full text-sm focus:outline-none placeholder:text-mitti-beige"
          />
        </div>

        <div className="border-l border-mitti-beige/20 hidden sm:block" />

        {/* CHECK-IN */}
        <div
          className="flex-1 px-4 py-3 relative"
          onClick={() => setActiveSection("when")}
        >
          <p className="text-xs font-semibold uppercase">Check In</p>
          <input
            ref={checkInRef}
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "checkIn")}
            className="bg-transparent w-full text-sm focus:outline-none placeholder:text-mitti-beige"
          />
        </div>

        <div className="border-l border-mitti-beige/20 hidden sm:block" />

        {/* CHECK-OUT */}
        <div
          className="flex-1 px-4 py-3"
          onClick={() => setActiveSection("when")}
        >
          <p className="text-xs font-semibold uppercase">Check Out</p>
          <input
            ref={checkOutRef}
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "checkOut")}
            className="bg-transparent w-full text-sm focus:outline-none placeholder:text-mitti-beige"
          />
        </div>

        <div className="border-l border-mitti-beige/20 hidden sm:block" />

        {/* WHO */}
        <div
          className="flex-1 px-4 py-3 relative"
          onClick={() => setActiveSection("who")}
        >
          <p className="text-xs font-semibold uppercase">Who</p>
          <button
            ref={whoRef}
            onKeyDown={(e) => handleKeyDown(e, "who")}
            className="text-sm bg-transparent focus:outline-none w-full text-left"
          >
            {guests.adults + guests.children + guests.infants} guests
          </button>
        </div>

        {/* BUTTON */}
        <Button
          onClick={handleButtonClick}
          className="bg-mitti-beige hover:bg-mitti-beige/90 text-mitti-dark-brown rounded-full w-13 h-13 flex items-center justify-center mt-2 sm:mt-0 sm:ml-4 self-center shrink-0 cursor-pointer"
        >
          {mode === "edit" ? (
            activeSection ? (
              <Check size={22} />
            ) : (
              <Edit size={22} />
            )
          ) : (
            <Search size={22} />
          )}
        </Button>
      </div>

      {/* DROPDOWNS */}
      <div
        ref={ref}
        onKeyDown={(e) => handleKeyDown(e, "where")}
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
