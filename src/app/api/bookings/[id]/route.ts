import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
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

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required." },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        homestay: {
          select: {
            id: true,
            name: true,
            address: true,
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

    const isBookingOwner = booking.userId === user.id;
    const isHomestayOwner = booking.homestay.owner.id === user.id;

    if (!isBookingOwner && !isHomestayOwner) {
      return NextResponse.json(
        { error: "You don't have permission to view this booking." },
        { status: 403 }
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

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required." },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
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

    const isBookingOwner = booking.userId === user.id;
    const isHomestayOwner = booking.homestay.ownerId === user.id;

    if (!isBookingOwner && !isHomestayOwner) {
      return NextResponse.json(
        { error: "You don't have permission to cancel this booking." },
        { status: 403 }
      );
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Booking is already cancelled." },
        { status: 400 }
      );
    }

    if (booking.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Cannot cancel a completed booking." },
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
          error:
            "Cannot cancel booking less than 24 hours before check-in. Please contact support.",
        },
        { status: 400 }
      );
    }

    if (checkInDate <= now) {
      return NextResponse.json(
        { error: "Cannot cancel booking after check-in date has passed." },
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

    const refundInfo = {
      refundAmount,
      refundPolicy,
      processingTime: "3-5 business days",
    };

    // TODO: Send cancellation emails to both user and host
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

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status } = body;

    const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: "Invalid status. Must be one of: " + validStatuses.join(", "),
        },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        homestay: {
          select: {
            id: true,
            name: true,
            ownerId: true,
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

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 }
      );
    }
    const isBookingOwner = booking.userId === user.id;
    const isHomestayOwner = booking.homestay.ownerId === user.id;

    if (!isBookingOwner && !isHomestayOwner) {
      return NextResponse.json(
        { error: "You don't have permission to update this booking." },
        { status: 403 }
      );
    }

    const currentStatus = booking.status;
    const newStatus = status;

    const canUserCancel =
      isBookingOwner &&
      (currentStatus === "PENDING" || currentStatus === "CONFIRMED");
    const canHostConfirm = isHomestayOwner && currentStatus === "PENDING";
    const canHostCancel =
      isHomestayOwner &&
      (currentStatus === "PENDING" || currentStatus === "CONFIRMED");
    const canComplete =
      (isBookingOwner || isHomestayOwner) && currentStatus === "CONFIRMED";

    if (newStatus === "CONFIRMED") {
      if (!canHostConfirm) {
        return NextResponse.json(
          { error: "Only homestay owners can confirm pending bookings." },
          { status: 403 }
        );
      }
    } else if (newStatus === "CANCELLED") {
      if (!canUserCancel && !canHostCancel) {
        return NextResponse.json(
          {
            error:
              "Cannot cancel booking in current status or insufficient permissions.",
          },
          { status: 403 }
        );
      }
      if (isBookingOwner) {
        const now = new Date();
        const checkInDate = new Date(booking.checkIn);
        const hoursUntilCheckIn =
          (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (hoursUntilCheckIn < 24 && hoursUntilCheckIn > 0) {
          return NextResponse.json(
            {
              error:
                "Cannot cancel booking less than 24 hours before check-in.",
            },
            { status: 400 }
          );
        }
      }
    } else if (newStatus === "COMPLETED") {
      if (!canComplete) {
        return NextResponse.json(
          { error: "Can only complete confirmed bookings." },
          { status: 403 }
        );
      }
      const now = new Date();
      const checkOutDate = new Date(booking.checkOut);
      if (checkOutDate > now) {
        return NextResponse.json(
          { error: "Cannot complete booking before checkout date." },
          { status: 400 }
        );
      }
    } else if (newStatus === "PENDING") {
      return NextResponse.json(
        { error: "Cannot change status back to pending." },
        { status: 400 }
      );
    }

    if (currentStatus === newStatus) {
      return NextResponse.json(
        { error: `Booking is already ${newStatus.toLowerCase()}.` },
        { status: 400 }
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
      include: {
        homestay: {
          select: {
            id: true,
            name: true,
            address: true,
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
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    let response: any = {
      message: `Booking status updated to ${newStatus.toLowerCase()}.`,
      booking: updatedBooking,
    };

    if (newStatus === "CANCELLED") {
      // Calculate refund (same logic as DELETE endpoint)
      const now = new Date();
      const checkInDate = new Date(booking.checkIn);
      const hoursUntilCheckIn =
        (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

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

      response.refundInfo = {
        refundAmount,
        refundPolicy,
        processingTime: "3-5 business days",
      };
    }

    if (newStatus === "CONFIRMED") {
      // TODO: Send confirmation emails to both parties
      response.message =
        "Booking confirmed successfully! Guest will be notified.";
    }

    if (newStatus === "COMPLETED") {
      // TODO: Send completion emails
      // TODO: Prompt for review
      response.message =
        "Booking marked as completed. You can now leave a review!";
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    console.error("[PUT /bookings/[id]]", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
