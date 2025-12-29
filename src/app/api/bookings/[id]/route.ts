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
    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required." },
        { status: 400 }
      );
    }

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
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);

    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const bookingStatus = {
      canCancel:
        booking.status === "PENDING" ||
        (booking.status === "CONFIRMED" && checkInDate > now),
      canComplete: booking.status === "CONFIRMED" && checkOutDate <= now,
      isActive:
        booking.status === "CONFIRMED" &&
        checkInDate <= now &&
        checkOutDate > now,
      isUpcoming: booking.status === "CONFIRMED" && checkInDate > now,
      isPast: checkOutDate < now,
    };

    return NextResponse.json({
      ...booking,
      nights,
      bookingStatus,
    });
  } catch (error: unknown) {
    console.error("[GET /bookings/[id]]", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
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
      include: {
        homestay: {
          select: {
            id: true,
            name: true,
            ownerId: true,
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

    if (booking.status === "CANCELLED" || booking.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Booking cannot be cancelled." },
        { status: 400 }
      );
    }

    const now = new Date();
    const checkInDate = new Date(booking.checkIn);
    const hoursUntilCheckIn =
      (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilCheckIn < 24 && hoursUntilCheckIn > 0) {
      return NextResponse.json(
        {
          error: "Cannot cancel booking less than 24 hours before check-in.",
        },
        { status: 400 }
      );
    }

    const cancelledBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
        updatedAt: new Date(),
      },
      include: {
        homestay: {
          select: {
            id: true,
            name: true,
            owner: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    let refundAmount: Decimal;
    let refundPolicy: "full" | "partial" | "none";

    if (hoursUntilCheckIn >= 24 * 7) {
      refundAmount = booking.totalPrice;
      refundPolicy = "full";
    } else if (hoursUntilCheckIn >= 48) {
      refundAmount = booking.totalPrice.mul(0.5);
      refundPolicy = "partial";
    } else {
      refundAmount = new Decimal(0);
      refundPolicy = "none";
    }

    return NextResponse.json({
      message: "Booking cancelled successfully.",
      booking: cancelledBooking,
      refundInfo: {
        refundAmount,
        refundPolicy,
        processingTime: "3-5 business days",
      },
    });
  } catch (error: unknown) {
    console.error("[DELETE /bookings/[id]]", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

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

    const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid booking status." },
        { status: 400 }
      );
    }

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
            ownerId: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        homestay: {
          select: {
            id: true,
            name: true,
            flatno: true,
            street: true,
            village: true,
            district: true,
            state: true,
            pincode: true,
          },
        },
        user: true,
      },
    });

    return NextResponse.json({
      message: `Booking status updated to ${status.toLowerCase()}.`,
      booking: updatedBooking,
    });
  } catch (error: unknown) {
    console.error("[PUT /bookings/[id]]", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
