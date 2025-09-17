"use client";

import { useState } from "react";
import { Edit, Check, Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import qs from "query-string";
import SearchBar from "../homepage/search-bar/SearchBar";

const SearchModal = dynamic(
  () => import("../../ui/homepage/search-bar/SearchModal"),
  { ssr: false }
);

const ExploreSearch = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "where" | "when" | "who" | null
  >(null);

  // Pre-populate from search params
  const initialDestination = searchParams.get("destination") || "";
  const initialCheckIn = searchParams.get("checkIn") || "";
  const initialCheckOut = searchParams.get("checkOut") || "";
  const initialGuests = Number(searchParams.get("guests")) || 1;

  // Dynamic button text and icon based on search params
  const hasSearchParams =
    initialDestination || initialCheckIn || initialCheckOut || initialGuests > 1;
  const buttonText = hasSearchParams ? "Edit Search" : "Search Stays";
  const buttonIcon = activeSection ? <Check size={22} /> : <Edit size={22} />;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSearch = () => {
    if (isModalOpen && activeSection) {
      const query = qs.stringifyUrl(
        {
          url: "/explore",
          query: {
            destination: initialDestination || undefined,
            checkIn: initialCheckIn || undefined,
            checkOut: initialCheckOut || undefined,
            guests: initialGuests || undefined,
          },
        },
        { arrayFormat: "bracket" }
      );
      router.push(query);
      setActiveSection(null);
      closeModal();
    } else {
      openModal();
    }
  };

  return (
    <>
      {/* Mobile View */}
      <div className="sm:hidden px-4">
        <button
          onClick={handleSearch}
          className="w-full bg-white text-mitti-dark-brown rounded-full py-3 px-4 shadow flex items-center justify-between"
        >
          <span className="text-lg font-medium">{buttonText}</span>
          {hasSearchParams ? buttonIcon : <Search size={22} />}
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block">
        <SearchBar mode="edit" />
      </div>

      {isModalOpen && (
        <SearchModal
          onClose={closeModal}
          initialDestination={initialDestination}
          initialCheckIn={initialCheckIn}
          initialCheckOut={initialCheckOut}
          initialGuests={initialGuests}
        />
      )}
    </>
  );
};

export default ExploreSearch;
