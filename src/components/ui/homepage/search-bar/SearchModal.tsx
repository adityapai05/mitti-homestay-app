"use client";

import { useState } from "react";
import { X, Plus, Minus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import qs from "query-string";

interface SearchModalProps {
  onClose: () => void;
  initialDestination?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}

const SearchModal = ({
  onClose,
  initialDestination = "",
  initialCheckIn = "",
  initialCheckOut = "",
  initialGuests = 1,
}: SearchModalProps) => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<
    "where" | "when" | "who" | null
  >("where");
  const [destination, setDestination] = useState(initialDestination);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);
  const MAX_GUESTS = 15;

  const canIncrement = () => guests < MAX_GUESTS;
  const canDecrement = () => guests > 1;

  const incrementGuest = () => {
    if (canIncrement()) {
      setGuests((prev) => prev + 1);
    }
  };

  const decrementGuest = () => {
    if (canDecrement()) {
      setGuests((prev) => prev - 1);
    }
  };

  const handleSearch = () => {
    const query = qs.stringifyUrl(
      {
        url: "/explore",
        query: {
          destination: destination || undefined,
          checkIn: checkIn || undefined,
          checkOut: checkOut || undefined,
          guests: guests || undefined,
        },
      },
      { arrayFormat: "bracket" }
    );
    router.push(query);
    onClose();
  };

  const handleClear = () => {
    setDestination("");
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
    setActiveSection("where");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-mitti-dark-brown">
            Explore Stays
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-mitti-olive hover:bg-mitti-olive/80 transition-colors text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Where */}
          <div
            onClick={() => setActiveSection("where")}
            className="bg-mitti-beige/10 p-4 rounded-xl cursor-pointer hover:bg-mitti-beige/20 transition-colors"
          >
            <p className="text-lg font-semibold text-mitti-dark-brown mb-2">
              Where
            </p>
            {activeSection === "where" ? (
              <input
                type="text"
                placeholder="Search Destinations in Bharat"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-mitti-olive"
              />
            ) : (
              <p className="text-gray-600">
                {destination || "Anywhere in Bharat"}
              </p>
            )}
          </div>

          {/* When */}
          <div
            onClick={() => setActiveSection("when")}
            className="bg-mitti-beige/10 p-4 rounded-xl cursor-pointer hover:bg-mitti-beige/20 transition-colors"
          >
            <p className="text-lg font-semibold text-mitti-dark-brown mb-2">
              When
            </p>
            {activeSection === "when" ? (
              <div className="flex gap-3">
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-1/2 bg-white border border-gray-300 rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-mitti-olive"
                />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-1/2 bg-white border border-gray-300 rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-mitti-olive"
                />
              </div>
            ) : (
              <p className="text-gray-600">
                {checkIn && checkOut ? `${checkIn} - ${checkOut}` : "Add dates"}
              </p>
            )}
          </div>

          {/* Who */}
          <div
            onClick={() => setActiveSection("who")}
            className="bg-mitti-beige/10 p-4 rounded-xl cursor-pointer hover:bg-mitti-beige/20 transition-colors"
          >
            <p className="text-lg font-semibold text-mitti-dark-brown mb-2">
              Who
            </p>
            {activeSection === "who" ? (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Guests</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      decrementGuest();
                    }}
                    className="w-8 h-8 bg-mitti-olive/10 rounded-full flex items-center justify-center hover:bg-mitti-olive/20 disabled:opacity-50"
                    disabled={!canDecrement()}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-lg font-medium">{guests}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      incrementGuest();
                    }}
                    className="w-8 h-8 bg-mitti-olive/10 rounded-full flex items-center justify-center hover:bg-mitti-olive/20 disabled:opacity-50"
                    disabled={!canIncrement()}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">{`${guests} Guests`}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-4">
          <button
            onClick={handleClear}
            className="w-1/2 py-3 bg-white border border-gray-300 rounded-xl text-mitti-dark-brown font-medium hover:bg-gray-100 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleSearch}
            className="w-1/2 py-3 bg-mitti-olive text-white rounded-xl font-medium hover:bg-mitti-olive/90 transition-colors"
          >
            <Search size={20} className="inline mr-2" /> Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
