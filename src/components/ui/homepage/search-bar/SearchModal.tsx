"use client";

import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";

const SearchModal = ({ onClose }: { onClose: () => void }) => {
  const [activeSection, setActiveSection] = useState<
    "where" | "when" | "who" | null
  >("where");
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });

  const totalGuests = guests.adults + guests.children + guests.infants;
  const MAX_GUESTS = 15;

  const canIncrement = (type: keyof typeof guests) => {
    return totalGuests < MAX_GUESTS;
  };

  const canDecrement = (type: keyof typeof guests) => {
    const current = guests[type];

    if (current === 0) return false;

    if (type === "adults" && current === 1)
      return false;


    return true;
  };

  const incrementGuest = (type: keyof typeof guests) => {
    if (!canIncrement(type)) return;

    setGuests((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  };

  const decrementGuest = (type: keyof typeof guests) => {
    if (!canDecrement(type)) return;

    setGuests((prev) => ({
      ...prev,
      [type]: prev[type] - 1,
    }));
  };

  const handleSearch = () => {
    console.log({ destination, checkIn, checkOut, guests });
    onClose();
  };

  const handleClear = () => {
    setDestination("");
    setCheckIn("");
    setCheckOut("");
    setGuests({ adults: 1, children: 0, infants: 0 });
    setActiveSection("where");
  };

  return (
    <div className="fixed inset-0 z-50 bg-mitti-dark-brown flex flex-col overflow-y-auto">
      <div className="mt-16 flex justify-between items-center py-2 px-4 border-b">
        <h2 className="text-xl font-semibold">Search</h2>
        <button onClick={onClose}>
          <div className="bg-mitti-olive flex items-center justify-center p-2 rounded-full">
            <X size={26} />
          </div>
        </button>
      </div>

      <div className="flex flex-col divide-y">
        <div onClick={() => setActiveSection("where")} className="p-4">
          <p className="text-2xl font-bold mb-1">Where?</p>
          {activeSection === "where" ? (
            <input
              type="text"
              placeholder="Search Destinations"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-md"
            />
          ) : (
            <p className="text-md text-mitti-beige">
              {destination || "Anywhere in Bharat"}
            </p>
          )}
        </div>

        <div onClick={() => setActiveSection("when")} className="p-4">
          <p className="text-2xl font-bold mb-1">When?</p>
          {activeSection === "when" ? (
            <div className="flex gap-2">
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-1/2 border rounded-lg px-3 py-2 text-md"
              />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-1/2 border rounded-lg px-3 py-2 text-md"
              />
            </div>
          ) : (
            <p className="text-md text-mitti-beige">
              {checkIn && checkOut ? `${checkIn} - ${checkOut}` : "Add dates"}
            </p>
          )}
        </div>

        <div onClick={() => setActiveSection("who")} className="p-4">
          <p className="text-2xl font-bold mb-1">Who?</p>
          {activeSection === "who" ? (
            <div className="space-y-3">
              {["adults", "children", "infants"].map((type) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="capitalize text-sm">{type}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        decrementGuest(type as keyof typeof guests);
                      }}
                      className="border rounded-full p-1 disabled:opacity-30"
                      disabled={!canDecrement(type as keyof typeof guests)}
                    >
                      <Minus size={16} />
                    </button>

                    <span className="w-6 text-center">
                      {guests[type as keyof typeof guests]}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        incrementGuest(type as keyof typeof guests);
                      }}
                      className="border rounded-full p-1 disabled:opacity-30"
                      disabled={!canIncrement(type as keyof typeof guests)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-md text-mitti-beige">
              {guests.adults} Adults, {guests.children} Children,{" "}
              {guests.infants} Infants
            </p>
          )}
        </div>
      </div>

      <div className="mt-auto p-4 border-t flex gap-4">
        <button
          onClick={handleClear}
          className="w-1/2 py-3 border rounded-full text-md font-medium"
        >
          Clear All
        </button>
        <button
          onClick={handleSearch}
          className="w-1/2 py-3 bg-mitti-olive text-white rounded-full text-md font-medium"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchModal;
