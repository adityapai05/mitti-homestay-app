"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { MapPin, Calendar, Users, Pencil } from "lucide-react";

const SearchModal = dynamic(
  () => import("@/components/shared/search/SearchModal"),
  { ssr: false },
);

export default function ExploreSearch() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const location = searchParams.get("location");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = Number(searchParams.get("guests")) || 1;

  const hasDates = Boolean(checkIn && checkOut);

  const formatDate = (value: string | null) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* MOBILE */}
        <button
          onClick={() => setOpen(true)}
          className="sm:hidden w-full rounded-2xl bg-mitti-dark-brown text-mitti-cream p-4 shadow-md flex flex-col gap-3 text-left"
        >
          {/* Location */}
          <div className="flex items-center gap-2 min-w-0">
            <MapPin size={20} className="shrink-0" />
            <span className="font-medium truncate">
              {location ?? "Anywhere"}
            </span>
          </div>

          {/* Meta row */}
          <div className="flex items-center justify-between text-sm text-mitti-cream/90">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Calendar size={18} className="shrink-0" />
                <span>
                  {hasDates
                    ? `${formatDate(checkIn)} → ${formatDate(checkOut)}`
                    : "Any dates"}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Users size={18} className="shrink-0" />

                <span>
                  {guests} guest{guests > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-mitti-cream text-mitti-dark-brown rounded-full px-3 py-1.5">
              <Pencil size={14} className="shrink-0" />
              <span className="text-xs font-semibold">Edit</span>
            </div>
          </div>
        </button>

        {/* DESKTOP */}
        <button
          onClick={() => setOpen(true)}
          className="hidden sm:flex w-full rounded-full bg-mitti-dark-brown text-mitti-cream px-6 py-4 items-center gap-6 shadow-md hover:shadow-lg transition cursor-pointer"
        >
          {/* WHERE */}
          <div className="flex items-center gap-2 min-w-0">
            <MapPin size={16} />
            <span className="text-sm font-medium truncate max-w-[280px]">
              {location ?? "Anywhere"}
            </span>
          </div>

          <div className="h-6 w-px bg-mitti-cream/30" />

          {/* WHEN */}
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span className="text-sm font-medium">
              {hasDates
                ? `${formatDate(checkIn)} → ${formatDate(checkOut)}`
                : "Any dates"}
            </span>
          </div>

          <div className="h-6 w-px bg-mitti-cream/30" />

          {/* WHO */}
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span className="text-sm font-medium">
              {guests} guest{guests > 1 ? "s" : ""}
            </span>
          </div>

          {/* EDIT */}
          <div className="ml-auto flex items-center gap-2 bg-mitti-cream text-mitti-dark-brown rounded-full px-4 py-2 hover:bg-mitti-cream/80">
            <Pencil size={14} />
            <span className="text-sm font-semibold">Edit</span>
          </div>
        </button>
      </div>

      {open && (
        <SearchModal
          onClose={() => setOpen(false)}
          initialGuests={guests}
          initialCheckIn={checkIn ?? undefined}
          initialCheckOut={checkOut ?? undefined}
          initialLocation={
            location
              ? {
                  label: location,
                  latitude: Number(searchParams.get("lat")),
                  longitude: Number(searchParams.get("lng")),
                  address: { country: "India" },
                }
              : undefined
          }
        />
      )}
    </>
  );
}
