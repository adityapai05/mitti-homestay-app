"use client";

import Image from "next/image";
import {
  Home,
  Users,
  Bed,
  Bath,
  MapPin,
  IndianRupee,
  Wifi,
  Droplets,
  Plug,
  TreePalm,
  CookingPot,
  Clock,
  ShieldCheck,
} from "lucide-react";

import type { AddressValue } from "./StepAddress";
import type { BasicsValue } from "./StepBasics";
import { JSX } from "react";

type ReviewData = {
  category?: string;
  type?: "ROOM" | "HOME";
  address?: AddressValue;
  basics?: BasicsValue;
  amenities?: string[];
  images?: string[];
  name?: string;
  description?: string;
  pricePerNight?: number;
  cancellationPolicy?: "FLEXIBLE" | "MODERATE" | "STRICT";
};

type Props = {
  data: ReviewData;
};

/* ---------- helpers ---------- */

const formatCategory = (value?: string) =>
  value
    ?.replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());

const formatType = (value?: string) =>
  value === "ROOM" ? "Private room" : "Entire home";

const formatAddress = (address?: AddressValue) => {
  if (!address) return "";
  return [
    address.flatno,
    address.street,
    address.landmark,
    address.village,
    address.district,
    address.state,
    address.pincode,
  ]
    .filter(Boolean)
    .join(", ");
};

const formatPolicyTitle = (policy?: "FLEXIBLE" | "MODERATE" | "STRICT") => {
  if (!policy) return "—";
  return policy.charAt(0) + policy.slice(1).toLowerCase();
};

const policyDescriptionMap: Record<"FLEXIBLE" | "MODERATE" | "STRICT", string> =
  {
    FLEXIBLE:
      "Guests get a full refund if they cancel at least 7 days before check-in.",
    MODERATE:
      "Guests get a full refund up to 14 days before check-in, and a 50% refund up to 7 days before.",
    STRICT:
      "Guests get a 50% refund only if they cancel at least 30 days before check-in.",
  };

const amenityIconMap: Record<string, JSX.Element> = {
  wifi: <Wifi size={16} />,
  electricity: <Plug size={16} />,
  drinking_water: <Droplets size={16} />,
  kitchen: <CookingPot size={16} />,
  outdoor_space: <TreePalm size={16} />,
};

const formatAmenity = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/* ---------- component ---------- */

const StepReview = ({ data }: Props) => {
  if (!data.images || data.images.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-mitti-dark-brown">
          Review your listing
        </h1>
        <p className="mt-1 text-mitti-dark-brown/70">
          Take a moment to review the details below before publishing your
          homestay.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
        {/* Photos */}
        <div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-mitti-khaki mb-3">
            <Image
              src={data.images[0]}
              alt="Cover photo"
              fill
              className="object-cover"
            />
            <span className="absolute top-3 left-3 bg-mitti-brown text-white text-xs px-3 py-1 rounded-full">
              Cover photo
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {data.images.slice(1).map((url) => (
              <div
                key={url}
                className="relative aspect-square rounded-xl overflow-hidden border border-mitti-khaki"
              >
                <Image
                  src={url}
                  alt="Homestay photo"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          {/* Title + description */}
          <div className="bg-mitti-cream border border-mitti-khaki rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-mitti-dark-brown mb-1">
              {data.name}
            </h2>
            <p className="text-sm text-mitti-dark-brown/70 mb-3">
              {formatCategory(data.category)} · {formatType(data.type)}
            </p>
            <p className="text-mitti-dark-brown whitespace-pre-line">
              {data.description}
            </p>
          </div>

          {/* Basics + timing */}
          <div className="bg-mitti-cream border border-mitti-khaki rounded-2xl p-6 grid grid-cols-2 gap-4 text-mitti-dark-brown">
            <div className="flex items-center gap-2">
              <Users size={18} /> {data.basics?.guests} guests
            </div>
            <div className="flex items-center gap-2">
              <Bed size={18} /> {data.basics?.beds} beds
            </div>
            <div className="flex items-center gap-2">
              <Home size={18} /> {data.basics?.bedrooms} bedrooms
            </div>
            <div className="flex items-center gap-2">
              <Bath size={18} /> {data.basics?.bathrooms} bathrooms
            </div>

            {/* Check-in */}
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <Clock size={18} />
              Check-in:{" "}
              <span className="font-medium">
                {data.basics?.checkInTime ?? "—"}
              </span>
            </div>

            {/* Check-out */}
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <Clock size={18} />
              Check-out:{" "}
              <span className="font-medium">
                {data.basics?.checkOutTime ?? "—"}
              </span>
            </div>
          </div>

          {/* Amenities */}
          {data.amenities && data.amenities.length > 0 && (
            <div className="bg-mitti-cream border border-mitti-khaki rounded-2xl p-6">
              <h3 className="font-medium text-mitti-dark-brown mb-3">
                Amenities
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {data.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2 text-sm">
                    {amenityIconMap[a] || <Home size={16} />}
                    {formatAmenity(a)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cancellation policy */}
          {data.cancellationPolicy && (
            <div className="bg-mitti-cream border border-mitti-khaki rounded-2xl p-6">
              <h3 className="font-medium text-mitti-dark-brown mb-2">
                Cancellation policy
              </h3>

              <div className="flex items-start gap-3 text-mitti-dark-brown">
                <ShieldCheck size={20} className="mt-0.5 text-mitti-olive" />
                <div>
                  <p className="font-medium">
                    {formatPolicyTitle(data.cancellationPolicy)} policy
                  </p>
                  <p className="text-sm text-mitti-dark-brown/80 mt-1">
                    {policyDescriptionMap[data.cancellationPolicy]}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Address */}
          <div className="bg-mitti-cream border border-mitti-khaki rounded-2xl p-6 flex items-start gap-3">
            <MapPin size={20} />
            <span>{formatAddress(data.address)}</span>
          </div>

          {/* Pricing */}
          <div className="bg-mitti-cream border border-mitti-khaki rounded-2xl p-6 flex items-center gap-2">
            <IndianRupee size={18} />
            <span className="text-lg font-semibold">
              {data.pricePerNight} per night
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepReview;
