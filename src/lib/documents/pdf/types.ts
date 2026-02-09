import {
  Prisma,
  BookingStatus,
  RefundStatus,
  CancellationPolicy,
} from "@prisma/client";

export type BookingPdfData = {
  bookingId: string;
  status: BookingStatus;
  createdAt: Date;

  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;

  pricing: {
    nights: number;
    stayBase: Prisma.Decimal;
    guideFee: Prisma.Decimal;
    platformFee: Prisma.Decimal;
    gst: Prisma.Decimal;
    subtotal: Prisma.Decimal;
    total: Prisma.Decimal;
  };

  refundAmount: Prisma.Decimal | null;
  refundStatus: RefundStatus;

  homestay: {
    name: string;
    images: string[];
    address: string;
    category: string;
    cancellationPolicy: CancellationPolicy;
    cancellationPolicyText: {
      title: string;
      description: string;
    };
    checkInTime: string;
    checkOutTime: string;
  };

  guest: {
    name: string;
    email: string | null;
    phone: string | null;
  };

  host: {
    name: string;
    email: string | null;
    phone: string | null;
  };

  payment: null | {
    amount: Prisma.Decimal;
    currency: string;
    paymentId: string;
    paidAt: Date;
  };
};
