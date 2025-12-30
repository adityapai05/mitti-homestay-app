import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import HostBookingHeader from "./_components/HostBookingHeader";
import GuestSnapshot from "./_components/GuestSnapshot";
import StayDetails from "./_components/StayDetails";
import HomestaySnapshot from "./_components/HomestaySnapshot";
import PriceBreakdown from "./_components/PriceBreakdown";
import HostBookingActionZone from "./_components/HostBookingActionZone";

export default async function HostBookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) notFound();

  if (user.role !== "HOST" && user.role !== "ADMIN") {
    notFound();
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id,
      homestay: {
        ownerId: user.id,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
        },
      },
      homestay: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
          village: true,
          state: true,
          district: true,
          pincode: true,
        },
      },
      payment: true,
    },
  });

  if (!booking) notFound();

  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);

  const nights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );

  const displayAddress = [booking.homestay.village, booking.homestay.state]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6">
      <HostBookingHeader status={booking.status} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GuestSnapshot guest={booking.user} />
          <StayDetails
            booking={{
              checkIn: booking.checkIn.toISOString(),
              checkOut: booking.checkOut.toISOString(),
              nights,
              guests: booking.guests,
            }}
          />

          <HomestaySnapshot
            homestay={{
              id: booking.homestay.id,
              name: booking.homestay.name,
              imageUrl: booking.homestay.imageUrl,
              displayAddress,
            }}
          />
        </div>

        <div className="space-y-6">
          <PriceBreakdown
            price={{ total: Number(booking.totalPrice) }}
            payment={
              booking.payment
                ? {
                    amount: Number(booking.payment.amount),
                    currency: booking.payment.currency,
                    razorpayPaymentId: booking.payment.razorpayPaymentId,
                    createdAt: booking.payment.createdAt.toISOString(),
                  }
                : null
            }
          />

          <HostBookingActionZone
            bookingId={booking.id}
            status={booking.status}
            hostActions={{
              canApprove: booking.status === "PENDING_HOST_APPROVAL",
              canReject: booking.status === "PENDING_HOST_APPROVAL",
            }}
          />
        </div>
      </div>
    </div>
  );
}
