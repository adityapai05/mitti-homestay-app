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
import { useEffect } from "react";

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

type Props = {
  value?: string[];
  onChange: (value: string[]) => void;
};

const StepAmenities = ({ value = [], onChange }: Props) => {
  const toggleAmenity = (key: string) => {
    if (value.includes(key)) {
      onChange(value.filter((a) => a !== key));
    } else {
      onChange([...value, key]);
    }
  };

  useEffect(() => {
    if (!value) onChange([]);
  }, [value, onChange]);

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-mitti-dark-brown">
            What amenities do you offer?
          </h1>
          <p className="mt-2 text-mitti-dark-brown">
            Select the facilities available to guests at your homestay.
          </p>
        </div>

        {/* Amenity groups */}
        <div className="space-y-10">
          {AMENITY_GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="text-lg font-semibold text-mitti-dark-brown">
                {group.title}
              </h2>
              <p className="text-sm text-mitti-dark-brown mt-1 mb-4">
                {group.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {group.items.map((amenity) => {
                  const Icon = amenity.icon;
                  const selected = value.includes(amenity.key);

                  return (
                    <button
                      key={amenity.key}
                      type="button"
                      onClick={() => toggleAmenity(amenity.key)}
                      className={`
                        flex flex-col items-start gap-3 p-4 rounded-2xl border
                        transition cursor-pointer
                        ${
                          selected
                            ? "border-mitti-brown bg-mitti-cream shadow-sm"
                            : "border-mitti-khaki bg-mitti-cream hover:shadow-sm"
                        }
                      `}
                    >
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-mitti-khaki text-mitti-dark-brown">
                        <Icon size={20} />
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
      </div>
    </div>
  );
};

export default StepAmenities;
