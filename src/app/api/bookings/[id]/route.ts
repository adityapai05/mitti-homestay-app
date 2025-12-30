import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
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
        OR: [{ userId: user.id }, { homestay: { ownerId: user.id } }],
      },
      include: {
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

    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);

    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );

    const bookingStatus = {
      canCancel:
        booking.status === "PENDING_HOST_APPROVAL" ||
        booking.status === "AWAITING_PAYMENT" ||
        (booking.status === "CONFIRMED" && checkIn > now),

      awaitingHostApproval: booking.status === "PENDING_HOST_APPROVAL",
      awaitingPayment: booking.status === "AWAITING_PAYMENT",

      isActive:
        booking.status === "CONFIRMED" && checkIn <= now && checkOut > now,

      isUpcoming: booking.status === "CONFIRMED" && checkIn > now,

      isPast:
        booking.status === "COMPLETED" ||
        (booking.status === "CONFIRMED" && checkOut < now),
    };

    return NextResponse.json({
      ...booking,
      nights,
      bookingStatus,
    });
  } catch (error) {
    console.error("[GET /bookings/[id]]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
        OR: [{ userId: user.id }, { homestay: { ownerId: user.id } }],
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 }
      );
    }

    if (booking.status === "CANCELLED" || booking.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Booking cannot be cancelled." },
        { status: 400 }
      );
    }

    const checkIn = new Date(booking.checkIn);
    const hoursUntilCheckIn =
      (checkIn.getTime() - Date.now()) / (1000 * 60 * 60);

    if (
      booking.status === "CONFIRMED" &&
      hoursUntilCheckIn < 24 &&
      hoursUntilCheckIn > 0
    ) {
      return NextResponse.json(
        { error: "Cannot cancel less than 24 hours before check-in." },
        { status: 400 }
      );
    }

    const cancelled = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
        updatedAt: new Date(),
      },
    });

    let refundAmount: Decimal = new Decimal(0);
    let refundPolicy: "full" | "partial" | "none" = "none";

    if (hoursUntilCheckIn >= 24 * 7) {
      refundAmount = booking.totalPrice;
      refundPolicy = "full";
    } else if (hoursUntilCheckIn >= 48) {
      refundAmount = booking.totalPrice.mul(0.5);
      refundPolicy = "partial";
    }

    return NextResponse.json({
      message: "Booking cancelled successfully.",
      booking: cancelled,
      refundInfo: {
        refundAmount,
        refundPolicy,
        processingTime: "3-5 business days",
      },
    });
  } catch (error) {
    console.error("[DELETE /bookings/[id]]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * TEMPORARY endpoint.
 * In future this will be split into:
 * - host approve
 * - payment success webhook
 * - system complete job
 */
export async function PUT(
  req: NextRequest,
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
    const { status } = await req.json();

    const allowedStatuses = [
      "PENDING_HOST_APPROVAL",
      "AWAITING_PAYMENT",
      "CONFIRMED",
      "CANCELLED",
      "COMPLETED",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid booking status." },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        homestay: { select: { ownerId: true } },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 }
      );
    }

    if (booking.status === "COMPLETED" || booking.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Booking cannot be updated." },
        { status: 400 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: `Booking status updated to ${status}.`,
      booking: updated,
    });
  } catch (error) {
    console.error("[PUT /bookings/[id]]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
