import {
  CancellationPolicy,
  Category,
  HostVerificationStatus,
  Type,
} from "@prisma/client";

import {
  Droplets,
  Zap,
  Fan,
  Car,
  Wifi,
  Utensils,
  CookingPot,
  Sprout,
  Trees,
  Map,
  ShieldPlus,
  FireExtinguisher,
  BellRing,
  Camera,
} from "lucide-react";

export type HomestayDetailsDTO = {
  id: string;
  name: string;
  description: string;
  images: string[];

  category: Category;
  type: Type;

  location: {
    flatno: string | null;
    street: string | null;
    landmark: string | null;
    village: string | null;
    district: string | null;
    state: string | null;
    pincode: string | null;
    latitude: number;
    longitude: number;
  };

  capacity: {
    maxGuests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };

  pricing: {
    pricePerNight: string;
    guideAvailable: boolean;
    guideFee: string | null;
  };

  policies: {
    checkInTime: string;
    checkOutTime: string;
    cancellationPolicy: CancellationPolicy;
  };

  amenities: string[];

  rating: {
    average: number;
    reviewCount: number;
  };

  host: {
    id: string;
    name: string;
    image: string | null;
    about: string | null;
    languages: string[];
    isUserVerified: boolean;
    verificationStatus: HostVerificationStatus;

    stats: {
      hostingSince: number;
      reviewCount: number;
      averageRating: number | null;
    };
  };

  meta: {
    isVerified: boolean;
    createdAt: string;
  };
};

export const ESSENTIALS = [
  { key: "drinking_water", label: "Drinking water", icon: Droplets },
  { key: "electricity", label: "Electricity", icon: Zap },
  { key: "power_backup", label: "Power backup", icon: Zap },
  { key: "fan", label: "Fan", icon: Fan },
  { key: "parking", label: "Parking", icon: Car },
  { key: "wifi", label: "WiFi", icon: Wifi },
];

export const EXPERIENCES = [
  { key: "home_food", label: "Home cooked meals", icon: Utensils },
  { key: "kitchen", label: "Kitchen access", icon: CookingPot },
  { key: "farm_access", label: "Farm access", icon: Sprout },
  { key: "garden", label: "Garden or courtyard", icon: Trees },
  { key: "local_guide", label: "Local guide", icon: Map },
];

export const SAFETY = [
  { key: "first_aid", label: "First aid kit", icon: ShieldPlus },
  {
    key: "fire_extinguisher",
    label: "Fire extinguisher",
    icon: FireExtinguisher,
  },
  { key: "smoke_alarm", label: "Smoke alarm", icon: BellRing },
  { key: "cctv", label: "CCTV (common areas)", icon: Camera },
];
