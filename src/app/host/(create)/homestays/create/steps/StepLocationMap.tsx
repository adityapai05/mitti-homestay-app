"use client";

import { MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

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

type Props = {
  value?: LocationValue;
  onChange: (value: LocationValue) => void;
};

const StepLocationMap = ({ value, onChange }: Props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const fetchLocations = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&countrycodes=in&featuretype=settlement&addressdetails=1&limit=8`,
          {
            signal: controller.signal,
            headers: {
              "Accept-Language": "en",
            },
          }
        );

        const data: NominatimResult[] = await res.json();

        const ruralFirst = data.filter((item) => {
          const a = item.address;
          return a?.village || a?.hamlet || a?.town || a?.suburb || a?.county;
        });

        setResults(ruralFirst);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("Location search failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
    return () => controller.abort();
  }, [query]);

  return (
    <div className="w-full mt-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-mitti-dark-brown">
            Where is your place located?
          </h1>
          <p className="mt-2 text-mitti-dark-brown">
            Search for a village, town, or rural area in India.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <div className="flex items-center gap-3 border border-mitti-khaki bg-mitti-cream rounded-xl px-4 py-3">
            <Search size={18} className="text-mitti-dark-brown" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search village or town"
              className="w-full bg-transparent outline-none text-mitti-dark-brown"
            />
          </div>

          {query.length >= 3 && (
            <div className="absolute z-20 mt-2 w-full bg-mitti-cream border border-mitti-khaki rounded-xl shadow-md">
              {loading && (
                <div className="px-4 py-3 text-sm text-mitti-dark-brown">
                  Searching locations…
                </div>
              )}

              {!loading && results.length === 0 && (
                <div className="px-4 py-3 text-sm text-mitti-dark-brown">
                  No rural locations found. Try nearby villages or towns.
                </div>
              )}

              {!loading &&
                results.map((item) => {
                  const a = item.address;

                  return (
                    <button
                      key={item.place_id}
                      type="button"
                      onClick={() => {
                        onChange({
                          label: item.display_name,
                          latitude: Number(item.lat),
                          longitude: Number(item.lon),
                          address: {
                            country: "India",
                            state: a?.state,
                            district: a?.county || a?.state_district,
                            city: a?.village || a?.town || a?.suburb || a?.city,
                            pincode: a?.postcode,
                          },
                        });
                        setQuery(item.display_name);
                        setResults([]);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-mitti-beige cursor-pointer"
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

        {/* Map */}
        {value && (
          <div className="h-72 rounded-2xl overflow-hidden border border-mitti-khaki mb-6">
            <MapView
              latitude={value.latitude}
              longitude={value.longitude}
              label={value.label}
              zoom={13}
            />
          </div>
        )}

        {/* Summary */}
        {value && (
          <div className="flex items-start gap-3 border border-mitti-khaki bg-mitti-cream rounded-xl p-4">
            <MapPin size={20} className="text-mitti-dark-brown mt-1" />
            <div>
              <p className="font-medium text-mitti-dark-brown">{value.label}</p>
              <p className="text-sm text-mitti-dark-brown">
                {value.address.city}, {value.address.state}{" "}
                {value.address.pincode}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepLocationMap;
