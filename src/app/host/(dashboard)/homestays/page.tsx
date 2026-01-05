"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, ShieldCheck, Clock } from "lucide-react";

type Homestay = {
  id: string;
  name: string;
  imageUrl: string[];
  pricePerNight: string;
  isVerified: boolean;
  category: string;
  type: "ROOM" | "HOME";
  village?: string | null;
  state?: string | null;
};

const HostHomestaysPage = () => {
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomestays = async () => {
      try {
        const res = await fetch("/api/host/homestays", {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch homestays");

        const data = await res.json();
        setHomestays(data.homestays || []);
      } catch (err) {
        console.error("[HOST_HOMESTAYS_FETCH]", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomestays();
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-mitti-beige px-4 sm:px-6 py-2">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-mitti-dark-brown">
              Your homestays
            </h1>
            <p className="mt-1 text-sm text-mitti-dark-brown/80">
              Manage and track the homestays you’ve listed on MITTI.
            </p>
          </div>

          <Link
            href="/host/homestays/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-mitti-brown text-white font-medium hover:bg-mitti-brown/90 cursor-pointer"
          >
            <Plus size={18} />
            Create homestay
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-mitti-khaki rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-52 bg-mitti-khaki/40" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 bg-mitti-khaki/40 rounded" />
                  <div className="h-3 w-full bg-mitti-khaki/30 rounded" />
                  <div className="h-4 w-1/2 bg-mitti-khaki/40 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && homestays.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center bg-mitti-cream border border-mitti-khaki rounded-2xl p-10">
            <h2 className="text-xl font-semibold text-mitti-dark-brown">
              You haven’t listed any homestays yet
            </h2>
            <p className="mt-2 text-sm text-mitti-dark-brown/80 max-w-md">
              Create your first homestay to start hosting guests and accepting
              bookings on MITTI.
            </p>

            <Link
              href="/host/homestays/create"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-mitti-brown text-white font-medium hover:bg-mitti-brown/90 cursor-pointer"
            >
              <Plus size={18} />
              Create your first homestay
            </Link>
          </div>
        )}

        {/* Homestay grid */}
        {!loading && homestays.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {homestays.map((stay) => {
              const coverImage =
                stay.imageUrl?.[0] || "/mitti-placeholder.jpg";

              const location =
                [stay.village, stay.state].filter(Boolean).join(", ") ||
                "Location not set";

              return (
                <Link
                  key={stay.id}
                  href={`/host/homestays/${stay.id}`}
                  className="group bg-white border border-mitti-khaki rounded-2xl overflow-hidden shadow-sm
                             hover:shadow-md hover:-translate-y-[2px]
                             transition-all cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-44 w-full">
                    <Image
                      src={coverImage}
                      alt={stay.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="font-semibold text-mitti-dark-brown">
                      {stay.name}
                    </h3>

                    <p className="text-xs text-mitti-dark-brown/70 line-clamp-1">
                      {location}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-base font-semibold text-mitti-dark-brown">
                        ₹{Number(stay.pricePerNight).toLocaleString()}{" "}
                        <span className="font-normal text-mitti-dark-brown/70">
                          / night
                        </span>
                      </p>

                      {stay.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-mitti-olive text-white">
                          <ShieldCheck size={14} />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-mitti-khaki text-mitti-dark-brown">
                          <Clock size={14} />
                          Pending
                        </span>
                      )}
                    </div>

                    <p className="text-xs mt-1 text-mitti-dark-brown/70">
                      {stay.isVerified
                        ? "Guests can book this homestay"
                        : "Not bookable until verified"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostHomestaysPage;
