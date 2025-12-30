import { BookingStatus } from "@prisma/client";

export interface Stay {
  id: string;
  status: BookingStatus;
  checkIn: string;
  checkOut: string;
  nights: number;
  bookingStatus: {
    canCancel: boolean;
    canPay: boolean;
    isUpcoming: boolean;
    isActive: boolean;
    isPast: boolean;
  };
  homestay: {
    id: string;
    name: string;
    imageUrl: string[];
    displayAddress: string;
  };
}
