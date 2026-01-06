import { notFound, redirect } from "next/navigation";
import BookingStatusHeader from "./_components/BookingStatusHeader";
import HomestaySnapshot from "./_components/HomestaySnapshot";
import BookingDetails from "./_components/BookingDetails";
import PriceBreakdown from "./_components/PriceBreakdown";
import BookingActionZone from "./_components/BookingActionZone";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { Prisma, BookingStatus } from "@prisma/client";
import PaymentInfo from "./_components/PaymentInfo";
import BookingReview from "./_components/BookingReview";

interface BookingPageProps {
  params: Promise<{
    id: string;
  }>;
}

type BookingPageData = {
  id: string;
  status: BookingStatus;
  guests: number;
  totalPrice: Prisma.Decimal;
  checkIn: Date;
  checkOut: Date;

  nights: number;
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
    pincode: string | null;
    state: string | null;
    village: string | null;
    district: string | null;
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

  review: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
  } | null;
};

async function getBooking(id: string): Promise<BookingPageData> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

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
          flatno: true,
          street: true,
          landmark: true,
          village: true,
          district: true,
          state: true,
          pincode: true,
          imageUrl: true,
          latitude: true,
          longitude: true,
          amenities: true,
          guideAvailable: true,
          guideFee: true,
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
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  if (!booking) {
    notFound();
  }

  const now = new Date();
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);

  const nights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );

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
    totalPrice: booking.totalPrice,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,

    nights,
    bookingStatus,

    homestay: {
      id: booking.homestay.id,
      name: booking.homestay.name,
      pincode: booking.homestay.pincode,
      state: booking.homestay.state,
      district: booking.homestay.district,
      village: booking.homestay.village,
      imageUrl: booking.homestay.imageUrl,
      guideAvailable: booking.homestay.guideAvailable,
      guideFee: booking.homestay.guideFee,
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
  };
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { id } = await params;
  const booking = await getBooking(id);

  const {
    status,
    nights,
    bookingStatus,
    homestay,
    checkIn,
    checkOut,
    guests,
    totalPrice,
  } = booking;

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
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <BookingStatusHeader status={status} />
            <HomestaySnapshot homestay={homestay} />
            <BookingDetails
              checkIn={checkIn}
              checkOut={checkOut}
              nights={nights}
              guests={guests}
              guideAvailable={homestay.guideAvailable}
              host={{
                name: homestay.owner.name,
                phone: homestay.owner.phone,
                email: homestay.owner.email,
              }}
            />
            <BookingActionZone
              bookingId={booking.id}
              status={status}
              bookingStatus={bookingStatus}
              homestayOwner={homestay.owner}
              homestayId={homestay.id}
              review={booking.review}
            />
          </div>

          {/* Right column */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              <PriceBreakdown
                totalPrice={totalPrice}
                guideFee={homestay.guideFee}
              />
              {booking.payment && (
                <PaymentInfo
                  payment={{
                    amount: booking.payment.amount,
                    currency: booking.payment.currency,
                    razorpayPaymentId: booking.payment.razorpayPaymentId,
                    createdAt: booking.payment.createdAt,
                  }}
                />
              )}
              {booking.review && (
                <BookingReview
                  review={booking.review}
                  bookingId={booking.id}
                  homestayId={homestay.id}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
