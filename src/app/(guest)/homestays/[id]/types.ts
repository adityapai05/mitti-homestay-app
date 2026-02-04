import {
  CancellationPolicy,
  Category,
  HostVerificationStatus,
  Type,
} from "@prisma/client";

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
  };

  meta: {
    isVerified: boolean;
    createdAt: string;
  };
};
