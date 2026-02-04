"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  ESSENTIALS,
  EXPERIENCES,
  HomestayDetailsDTO,
  SAFETY,
} from "../../types";

interface AmenitiesProps {
  homestay: HomestayDetailsDTO;
}

export default function Amenities({ homestay }: AmenitiesProps) {
  const [expanded, setExpanded] = useState(false);

  const amenities = homestay.amenities || [];

  const hasAmenity = (key: string) =>
    amenities.some((a) => a === key || a.startsWith(`${key}:`));

  const getVisibleItems = (
    items: {
      key: string;
      label: string;
      icon: React.ComponentType<{ className?: string }>;
    }[],
  ) => items.filter((item) => hasAmenity(item.key));

  const essentials = getVisibleItems(ESSENTIALS);
  const experiences = getVisibleItems(EXPERIENCES);
  const safety = getVisibleItems(SAFETY);

  const hasAnyAmenities =
    essentials.length > 0 || experiences.length > 0 || safety.length > 0;

  if (!hasAnyAmenities) {
    return (
      <section className="max-w-4xl px-4 pt-8 space-y-4 border-t border-mitti-dark-brown/20">
        <h2 className="text-2xl font-semibold text-mitti-dark-brown">
          What this place offers
        </h2>

        <p className="text-mitti-dark-brown/70 text-base max-w-md">
          The host has not listed amenities yet. You can ask the host for
          details before booking.
        </p>
      </section>
    );
  }

  // Mobile limits
  const mobileEssentials = expanded ? essentials : essentials.slice(0, 3);
  const mobileExperiences = expanded ? experiences : experiences.slice(0, 2);
  const showMobileToggle =
    essentials.length > 3 || experiences.length > 2 || safety.length > 0;

  return (
    <section className="max-w-4xl px-4 pt-8 space-y-4 border-t border-mitti-dark-brown/20">
      <h2 className="text-2xl font-semibold text-mitti-dark-brown">
        What this place offers
      </h2>

      {/* Desktop layout */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-10">
        {essentials.length > 0 && (
          <AmenityColumn title="Essentials" items={essentials} />
        )}

        {experiences.length > 0 && (
          <AmenityColumn title="Experiences" items={experiences} />
        )}

        {safety.length > 0 && <AmenityColumn title="Safety" items={safety} />}
      </div>

      {/* Mobile layout */}
      <div className="md:hidden space-y-8">
        {essentials.length > 0 && (
          <AmenityColumn title="Essentials" items={mobileEssentials} />
        )}

        {experiences.length > 0 && (
          <AmenityColumn title="Experiences" items={mobileExperiences} />
        )}

        {expanded && safety.length > 0 && (
          <AmenityColumn title="Safety" items={safety} />
        )}

        {!expanded && showMobileToggle && (
          <button
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-mitti-dark-brown underline-offset-4 hover:underline"
          >
            Show all amenities
            <ChevronDown className="h-4 w-4" />
          </button>
        )}
      </div>
    </section>
  );
}

function AmenityColumn({
  title,
  items,
}: {
  title: string;
  items: {
    key: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-mitti-dark-brown">{title}</h3>

      <ul className="space-y-3">
        {items.map(({ key, label, icon: Icon }) => (
          <li key={key} className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-mitti-olive" />
            <span className="text-mitti-dark-brown">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
