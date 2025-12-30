import type { Decimal } from "@prisma/client/runtime/library";

export type BookingStatus =
  | "PENDING_HOST_APPROVAL"
  | "AWAITING_PAYMENT"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export interface BookingStatusFlags {
  canCancel: boolean;

  awaitingHostApproval: boolean;
  awaitingPayment: boolean;

  isActive: boolean;
  isUpcoming: boolean;
  isPast: boolean;
}

export interface HomestayOwner {
  id: string;
  name: string;
  image: string | null;
  phone: string | null;
  email: string | null;
}

export interface Homestay {
  id: string;
  name: string;
  flatno: string | null;
  street: string | null;
  landmark: string | null;
  village: string | null;
  district: string | null;
  state: string | null;
  pincode: string | null;
  imageUrl: string[];
  latitude: number | null;
  longitude: number | null;
  amenities: string[];
  guideAvailable: boolean;
  guideFee: Decimal | null;
  owner: HomestayOwner;
}

export interface BookingUser {
  id: string;
  name: string;
  image: string | null;
}

export interface BookingWithRelations {
  id: string;

  status: BookingStatus;

  checkIn: string;
  checkOut: string;

  guests: number;
  nights: number;

  totalPrice: Decimal;

  bookingStatus: BookingStatusFlags;

  homestay: Homestay;
  user: BookingUser;

  createdAt: string;
  updatedAt: string;
}
