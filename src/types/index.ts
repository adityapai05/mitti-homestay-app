import {
  Role,
  HostVerificationStatus,
  BookingStatus,
  PaymentStatus,
  PayoutMethodType,
  HostPayoutStatus,
  Type as HomestayType,
  Category as HomestayCategory,
} from "@prisma/client";

export {
  Role,
  HostVerificationStatus,
  BookingStatus,
  PaymentStatus,
  PayoutMethodType,
  HostPayoutStatus,
  HomestayType,
  HomestayCategory,
};

/* -------------------- */
/* Generic helpers */
/* -------------------- */

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

/* -------------------- */
/* User & Auth */
/* -------------------- */

export interface User {
  id: string;
  firebaseUid: string;

  name: string;
  email?: string | null;
  phone?: string | null;
  contactPhone?: string | null;

  image?: string | null;
  about?: string | null;
  languages: string[];

  role: Role;
  isVerified: boolean;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

/* -------------------- */
/* Host */
/* -------------------- */

export interface HostProfile {
  userId: string;
  verificationStatus: HostVerificationStatus;
  user: User;
}

export interface HostPayoutAccount {
  userId: string;
  method: PayoutMethodType;

  accountHolderName: string;

  upiId?: string | null;

  bankName?: string | null;
  accountNo?: string | null;
  ifsc?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface HostPayout {
  id: string;
  userId: string;

  amount: string;
  status: HostPayoutStatus;

  createdAt: string;
  processedAt?: string | null;

  user: User;
}

/* -------------------- */
/* Homestays */
/* -------------------- */

export interface Homestay {
  id: string;
  ownerId: string;

  name: string;
  description: string;

  flatno?: string | null;
  street?: string | null;
  landmark?: string | null;
  village?: string | null;
  district?: string | null;
  state?: string | null;
  pincode?: string | null;

  latitude?: number | null;
  longitude?: number | null;

  pricePerNight: string;

  beds: number;
  bedrooms: number;
  bathrooms: number;

  cancellationPolicy: "FLEXIBLE" | "MODERATE" | "STRICT";

  type: HomestayType;
  maxGuests: number;

  imageUrl: string[];
  amenities: string[];

  rating: number;
  reviewCount?: number;

  guideAvailable: boolean;
  guideFee?: string | null;

  checkInTime: string;
  checkOutTime: string;

  category: HomestayCategory;
  isVerified: boolean;

  createdAt: string;
  updatedAt: string;

  owner: {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    image?: string | null;
  };
}

/* -------------------- */
/* Bookings & Payments */
/* -------------------- */

export interface Booking {
  id: string;

  userId: string;
  homestayId: string;

  checkIn: string;
  checkOut: string;

  guests: number;
  totalPrice: string;

  status: BookingStatus;

  createdAt: string;
  updatedAt: string;

  user: User;
  homestay: Homestay;

  review?: Review | null;
  payment?: Payment | null;
}

export interface Payment {
  id: string;
  bookingId: string;

  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;

  amount: string;
  currency: string;

  status: PaymentStatus;

  createdAt: string;
  updatedAt: string;
}

/* -------------------- */
/* Reviews */
/* -------------------- */

export interface Review {
  id: string;

  userId: string;
  homestayId: string;
  bookingId: string;

  rating: number;
  comment?: string | null;

  createdAt: string;
  updatedAt: string;

  user: User;
}

/* -------------------- */
/* Admin */
/* -------------------- */

export interface AdminActionLog {
  id: string;

  adminId: string;
  action: string;
  entity: string;
  entityId: string;

  meta?: JsonValue | null;

  createdAt: string;

  admin: User;
}

export type AdminHomestayDetails = {
  id: string;
  name: string;

  description: string;
  amenities: string[];

  village?: string | null;
  district?: string | null;
  state?: string | null;

  latitude: number;
  longitude: number;

  pricePerNight: string | number;
  maxGuests: number;
  type: "ROOM" | "HOME";

  imageUrl: string[];

  owner: {
    id: string;
    name: string;
  };

  createdAt: string;
};

/* -------------------- */
/* API */
/* -------------------- */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
