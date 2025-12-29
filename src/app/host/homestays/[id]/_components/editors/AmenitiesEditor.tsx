"use client";

import {
  Droplets,
  Plug,
  Zap,
  Wifi,
  Fan,
  Car,
  Utensils,
  CookingPot,
  Trees,
  Sprout,
  Armchair,
  PawPrint,
  Map,
  ShieldPlus,
  FireExtinguisher,
  BellRing,
  Camera,
} from "lucide-react";

type Amenity = {
  key: string;
  label: string;
  icon: React.ElementType;
};

const AMENITY_GROUPS: {
  title: string;
  description: string;
  items: Amenity[];
}[] = [
  {
    title: "Essentials",
    description: "Basic facilities available at your homestay",
    items: [
      { key: "drinking_water", label: "Drinking water", icon: Droplets },
      { key: "electricity", label: "Electricity", icon: Plug },
      { key: "power_backup", label: "Power backup", icon: Zap },
      { key: "hot_water", label: "Hot water", icon: Droplets },
      { key: "fan", label: "Fan", icon: Fan },
      { key: "wifi", label: "WiFi", icon: Wifi },
      { key: "parking", label: "Parking", icon: Car },
    ],
  },
  {
    title: "Comfort & local experience",
    description: "Features that enhance the rural stay experience",
    items: [
      { key: "home_food", label: "Home-cooked meals", icon: Utensils },
      { key: "kitchen", label: "Kitchen access", icon: CookingPot },
      { key: "garden", label: "Garden / courtyard", icon: Trees },
      { key: "farm_access", label: "Farm access", icon: Sprout },
      { key: "outdoor_seating", label: "Outdoor seating", icon: Armchair },
      { key: "pets", label: "Pet friendly", icon: PawPrint },
      { key: "local_guide", label: "Local guide available", icon: Map },
    ],
  },
  {
    title: "Safety & hygiene",
    description: "Safety items available for guests",
    items: [
      { key: "first_aid", label: "First aid kit", icon: ShieldPlus },
      {
        key: "fire_extinguisher",
        label: "Fire extinguisher",
        icon: FireExtinguisher,
      },
      { key: "smoke_alarm", label: "Smoke alarm", icon: BellRing },
      { key: "cctv", label: "CCTV (common areas)", icon: Camera },
    ],
  },
];

type AmenitiesEditorProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

const AmenitiesEditor = ({ value, onChange }: AmenitiesEditorProps) => {
  const toggleAmenity = (key: string) => {
    if (value.includes(key)) {
      onChange(value.filter((a) => a !== key));
    } else {
      onChange([...value, key]);
    }
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-mitti-dark-brown">
          Amenities
        </h2>
        <p className="text-sm text-mitti-dark-brown/70">
          Select all facilities available to guests.
        </p>
      </div>

      {/* Unified amenities container */}
      <div className="rounded-2xl border border-mitti-khaki bg-white p-6 space-y-10">
        {AMENITY_GROUPS.map((group) => (
          <div key={group.title} className="space-y-4">
            <div>
              <h3 className="font-medium text-mitti-dark-brown">
                {group.title}
              </h3>
              <p className="text-sm text-mitti-dark-brown/60">
                {group.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {group.items.map((amenity) => {
                const Icon = amenity.icon;
                const selected = value.includes(amenity.key);

                return (
                  <button
                    key={amenity.key}
                    type="button"
                    onClick={() => toggleAmenity(amenity.key)}
                    className={`
                      group flex items-center gap-3 p-3 rounded-xl border
                      transition cursor-pointer text-left
                      ${
                        selected
                          ? "border-mitti-brown bg-mitti-beige"
                          : "border-mitti-khaki bg-white hover:border-mitti-brown/60"
                      }
                    `}
                  >
                    <div
                      className={`
                        h-9 w-9 rounded-full flex items-center justify-center
                        ${
                          selected
                            ? "bg-mitti-brown text-white"
                            : "bg-mitti-khaki text-mitti-dark-brown"
                        }
                      `}
                    >
                      <Icon size={18} />
                    </div>

                    <span className="text-sm font-medium text-mitti-dark-brown">
                      {amenity.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AmenitiesEditor;
