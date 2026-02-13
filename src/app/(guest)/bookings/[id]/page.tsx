import { notFound, redirect } from "next/navigation";
import {
  Prisma,
  BookingStatus,
  RefundStatus,
  CancellationPolicy,
} from "@prisma/client";

import BookingStatusHeader from "./_components/BookingStatusHeader";
import HomestaySnapshot from "./_components/HomestaySnapshot";
import BookingDetails from "./_components/BookingDetails";
import PriceBreakdown from "./_components/PriceBreakdown";
import BookingActionZone from "./_components/BookingActionZone";
import PaymentInfo from "./_components/PaymentInfo";
import BookingReview from "./_components/BookingReview";

import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";

interface BookingPageProps {
  params: Promise<{ id: string }>;
}

type BookingPageData = {
  id: string;
  status: BookingStatus;

  guests: number;
  nights: number;

  checkIn: Date;
  checkOut: Date;
  totalPrice: Prisma.Decimal;

  refundAmount: Prisma.Decimal | null;
  refundStatus: RefundStatus;

  bookingStatus: {
    canCancel: boolean;
    awaitingHostApproval: boolean;
    awaitingPayment: boolean;
    isActive: boolean;
    isUpcoming: boolean;
    isPast: boolean;
  };

  homestay: {
    id: string;
    name: string;
    imageUrl: string[];
    guideAvailable: boolean;
    guideFee: Prisma.Decimal | null;
    cancellationPolicy: CancellationPolicy;
    village: string | null;
    district: string | null;
    state: string | null;
    pincode: string | null;
    owner: {
      id: string;
      name: string;
      image: string | null;
      phone: string | null;
      email: string | null;
    };
  };

  payment: null | {
    amount: Prisma.Decimal;
    currency: string;
    razorpayPaymentId: string;
    createdAt: Date;
  };

  review: null | {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
  };

  pricing: {
    nights: number;
    stayBase: number;
    guideFee: number;
    platformFee: number;
    gst: number;
    subtotal: number;
    total: number;
  };
};

async function getBooking(id: string): Promise<BookingPageData> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const booking = await prisma.booking.findFirst({
    where: {
      id,
      OR: [{ userId: user.id }, { homestay: { ownerId: user.id } }],
    },
    include: {
      payment: true,
      review: true,
      homestay: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
          guideAvailable: true,
          guideFee: true,
          cancellationPolicy: true,
          village: true,
          district: true,
          state: true,
          pincode: true,
          owner: {
            select: {
              id: true,
              name: true,
              image: true,
              phone: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!booking) notFound();

  const now = new Date();
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);

  const nights = booking.nights;

  const bookingStatus = {
    canCancel: booking.status === "CONFIRMED" && checkIn > now,

    awaitingHostApproval: booking.status === "PENDING_HOST_APPROVAL",
    awaitingPayment: booking.status === "AWAITING_PAYMENT",

    isActive:
      booking.status === "CONFIRMED" && checkIn <= now && checkOut > now,

    isUpcoming: booking.status === "CONFIRMED" && checkIn > now,

    isPast:
      booking.status === "COMPLETED" ||
      booking.status === "CANCELLED_BY_GUEST" ||
      booking.status === "CANCELLED_BY_HOST",
  };

  return {
    id: booking.id,
    status: booking.status,

    guests: booking.guests,
    nights,

    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    totalPrice: booking.totalPrice,

    refundAmount: booking.refundAmount,
    refundStatus: booking.refundStatus,

    bookingStatus,

    homestay: {
      id: booking.homestay.id,
      name: booking.homestay.name,
      imageUrl: booking.homestay.imageUrl,
      guideAvailable: booking.homestay.guideAvailable,
      guideFee: booking.homestay.guideFee,
      cancellationPolicy: booking.homestay.cancellationPolicy,
      village: booking.homestay.village,
      district: booking.homestay.district,
      state: booking.homestay.state,
      pincode: booking.homestay.pincode,
      owner: booking.homestay.owner,
    },

    payment: booking.payment
      ? {
          amount: booking.payment.amount,
          currency: booking.payment.currency,
          razorpayPaymentId: booking.payment.razorpayPaymentId,
          createdAt: booking.payment.createdAt,
        }
      : null,

    review: booking.review
      ? {
          id: booking.review.id,
          rating: booking.review.rating,
          comment: booking.review.comment,
          createdAt: booking.review.createdAt,
        }
      : null,
    pricing: {
      nights: booking.nights,
      stayBase: Number(booking.stayBase),
      guideFee: Number(booking.guideFee),
      platformFee: Number(booking.platformFee),
      gst: Number(booking.gst),
      subtotal: Number(booking.subtotal),
      total: Number(booking.totalPrice),
    },
  };
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { id } = await params;
  const booking = await getBooking(id);

  // Auto-complete booking if checkout passed
  if (
    booking.status === "CONFIRMED" &&
    new Date(booking.checkOut) < new Date()
  ) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "COMPLETED" },
    });

    booking.status = "COMPLETED";
  }

  return (
    <main className="bg-mitti-beige min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            <BookingStatusHeader status={booking.status} />

            <HomestaySnapshot homestay={booking.homestay} />

            <BookingDetails
              checkIn={booking.checkIn}
              checkOut={booking.checkOut}
              nights={booking.nights}
              guests={booking.guests}
              guideAvailable={booking.homestay.guideAvailable}
              cancellationPolicy={booking.homestay.cancellationPolicy}
              host={{
                name: booking.homestay.owner.name,
                phone: booking.homestay.owner.phone,
                email: booking.homestay.owner.email,
              }}
            />

            <BookingActionZone
              bookingId={booking.id}
              status={booking.status}
              bookingStatus={booking.bookingStatus}
              homestayOwner={booking.homestay.owner}
              homestayId={booking.homestay.id}
              refundAmount={
                booking.refundAmount ? Number(booking.refundAmount) : null
              }
              refundStatus={booking.refundStatus}
              review={booking.review}
            />
          </div>

          {/* Right */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              <PriceBreakdown pricing={booking.pricing} />

              {booking.payment && <PaymentInfo payment={booking.payment} />}

              {booking.review && (
                <BookingReview
                  review={booking.review}
                  bookingId={booking.id}
                  homestayId={booking.homestay.id}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
