import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const { id: bookingId } = await context.params;

    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        OR: [
          { userId: user.id }, // guest
          { homestay: { ownerId: user.id } }, // host
        ],
      },
      include: {
        homestay: {
          select: {
            id: true,
            name: true,
            village: true,
            district: true,
            state: true,
            imageUrl: true,
            guideAvailable: true,
            guideFee: true,
            owner: {
              select: {
                id: true,
                name: true,
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
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 }
      );
    }

    const isGuest = booking.userId === user.id;

    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);

    const bookingStatus = {
      isGuest,

      canCancel: isGuest && booking.status === "CONFIRMED" && checkIn > now,

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

    return NextResponse.json({
      ...booking,
      nights: booking.nights,
      pricing: {
        nights: booking.nights,
        stayBase: booking.stayBase,
        guideFee: booking.guideFee,
        platformFee: booking.platformFee,
        gst: booking.gst,
        subtotal: booking.subtotal,
        total: booking.totalPrice,
      },
      bookingStatus,
    });
  } catch (error) {
    console.error("[GET /api/bookings/[id]]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
