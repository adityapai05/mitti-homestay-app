"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Search, MapPin, LocationEdit } from "lucide-react";

const MapView = dynamic(() => import("@/components/shared/MapView"), {
  ssr: false,
});

type NominatimAddress = {
  village?: string;
  hamlet?: string;
  town?: string;
  suburb?: string;
  city?: string;
  county?: string;
  state?: string;
  state_district?: string;
  postcode?: string;
};

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: NominatimAddress;
};

export type LocationValue = {
  label: string;
  latitude: number;
  longitude: number;
  address: {
    country: string;
    state?: string;
    district?: string;
    city?: string;
    pincode?: string;
  };
};

interface Props {
  value?: LocationValue;
  onChange: (value: LocationValue) => void;
}

export default function SearchLocationPicker({ value, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState<string>(value?.label ?? "");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  /* Close suggestions on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Fetch locations */
  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }

    const controller = new AbortController();

    const fetchLocations = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query,
          )}&countrycodes=in&addressdetails=1&limit=6`,
          {
            signal: controller.signal,
            headers: { "Accept-Language": "en" },
          },
        );

        const data: NominatimResult[] = await res.json();

        const ruralFirst = data.filter((item) => {
          const a = item.address;
          return a?.village || a?.hamlet || a?.town || a?.county;
        });

        setResults(ruralFirst);
        setOpen(true);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
    return () => controller.abort();
  }, [query]);

  return (
    <div className="space-y-6" ref={containerRef}>
      {/* SEARCH INPUT */}
      <div className="relative">
        <div className="flex items-center gap-3 rounded-xl border border-mitti-khaki bg-white px-4 py-3">
          <Search size={18} className="text-mitti-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search village, town, or region"
            className="w-full bg-transparent text-mitti-dark-brown outline-none"
            onFocus={() => {
              if (results.length > 0) setOpen(true);
            }}
          />
        </div>

        {/* AUTOCOMPLETE */}
        {open && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-mitti-khaki bg-white shadow-lg">
            {loading && (
              <div className="px-4 py-3 text-sm text-mitti-muted">
                Searching locations…
              </div>
            )}

            {!loading && results.length === 0 && (
              <div className="px-4 py-3 text-sm text-mitti-muted">
                No rural locations found
              </div>
            )}

            {!loading &&
              results.map((item) => {
                const a = item.address;
                return (
                  <button
                    key={item.place_id}
                    type="button"
                    className="w-full px-4 py-3 text-left hover:bg-mitti-beige"
                    onClick={() => {
                      onChange({
                        label: item.display_name,
                        latitude: Number(item.lat),
                        longitude: Number(item.lon),
                        address: {
                          country: "India",
                          state: a?.state,
                          district: a?.county || a?.state_district,
                          city: a?.village || a?.town || a?.city,
                          pincode: a?.postcode,
                        },
                      });
                      setQuery(item.display_name);
                      setOpen(false);
                      setResults([]);
                    }}
                  >
                    <p className="text-sm text-mitti-dark-brown">
                      {item.display_name}
                    </p>
                  </button>
                );
              })}
          </div>
        )}
      </div>

      {/* MAP PREVIEW (ALWAYS VISIBLE) */}
      <div className="h-56 overflow-hidden rounded-2xl border border-mitti-khaki bg-mitti-beige">
        {value ? (
          <MapView
            latitude={value.latitude}
            longitude={value.longitude}
            label={value.label}
            zoom={12}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-mitti-dark-brown">
            <LocationEdit size={24} className="mr-3"/>
            Search to preview location
          </div>
        )}
      </div>

      {/* SELECTED LOCATION SUMMARY */}
      {value && (
        <div className="flex items-start gap-3 rounded-xl bg-mitti-beige p-4">
          <MapPin size={18} className="mt-1 text-mitti-dark-brown" />
          <div>
            <p className="font-medium text-mitti-dark-brown">{value.label}</p>
            <p className="text-sm text-mitti-muted">
              {value.address.city}, {value.address.state}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
