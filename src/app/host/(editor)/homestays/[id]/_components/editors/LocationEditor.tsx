"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/shared/MapView"), {
  ssr: false,
});

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    village?: string;
    town?: string;
    city?: string;
    hamlet?: string;
    suburb?: string;
    county?: string;
    state?: string;
    state_district?: string;
    postcode?: string;
  };
};

export type LocationEditorValue = {
  latitude: number;
  longitude: number;

  flatno: string;
  street: string;
  landmark?: string;
  village: string;
  district?: string;
  state: string;
  pincode: string;
};

type Props = {
  value?: LocationEditorValue;
  onChange: (value: LocationEditorValue) => void;
};

const LocationEditor = ({ value, onChange }: Props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&countrycodes=in&addressdetails=1&limit=8`,
          { signal: controller.signal }
        );

        const data: NominatimResult[] = await res.json();
        setResults(data);
      } catch {
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [query]);

  const update = (key: keyof LocationEditorValue, val: string | number) => {
    if (!value) return;
    onChange({ ...value, [key]: val });
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Location</h2>
        <p className="text-sm text-muted-foreground">
          Guests see the general area. Exact address is shared after booking.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <div className="flex items-center gap-3 border rounded-xl px-4 py-3">
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search village or town"
              className="w-full bg-transparent outline-none"
            />
          </div>

          {query.length >= 3 && (
            <div className="absolute z-20 mt-2 w-full rounded-xl border bg-white shadow">
              {loading && <div className="px-4 py-3 text-sm">Searching…</div>}

              {!loading &&
                results.map((item) => {
                  const a = item.address;
                  return (
                    <button
                      key={item.place_id}
                      type="button"
                      onClick={() => {
                        onChange({
                          latitude: Number(item.lat),
                          longitude: Number(item.lon),

                          flatno: "",
                          street: "",
                          landmark: "",
                          village:
                            a?.village || a?.town || a?.hamlet || a?.city || "",
                          district: a?.county || a?.state_district,
                          state: a?.state || "",
                          pincode: a?.postcode || "",
                        });
                        setQuery(item.display_name);
                        setResults([]);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-muted"
                    >
                      {item.display_name}
                    </button>
                  );
                })}
            </div>
          )}
        </div>

        {/* Map */}
        {value && (
          <div className="h-72 rounded-xl overflow-hidden border">
            <MapView
              latitude={value.latitude}
              longitude={value.longitude}
              zoom={13}
            />
          </div>
        )}

        {/* Address fields */}
        {value && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              placeholder="House / Flat number"
              value={value.flatno}
              onChange={(e) => update("flatno", e.target.value)}
              className="border rounded-lg px-3 py-2"
            />

            <input
              placeholder="Street"
              value={value.street}
              onChange={(e) => update("street", e.target.value)}
              className="border rounded-lg px-3 py-2"
            />

            <input
              placeholder="Landmark (optional)"
              value={value.landmark || ""}
              onChange={(e) => update("landmark", e.target.value)}
              className="border rounded-lg px-3 py-2"
            />

            <input
              placeholder="Village / Town"
              value={value.village}
              onChange={(e) => update("village", e.target.value)}
              className="border rounded-lg px-3 py-2"
            />

            <input
              placeholder="District (optional)"
              value={value.district || ""}
              onChange={(e) => update("district", e.target.value)}
              className="border rounded-lg px-3 py-2"
            />

            <input
              placeholder="State"
              value={value.state}
              onChange={(e) => update("state", e.target.value)}
              className="border rounded-lg px-3 py-2"
            />

            <input
              placeholder="PIN code"
              value={value.pincode}
              maxLength={6}
              onChange={(e) =>
                update("pincode", e.target.value.replace(/\D/g, ""))
              }
              className="border rounded-lg px-3 py-2"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default LocationEditor;
