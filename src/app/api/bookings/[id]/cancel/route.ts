import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { calculateRefund } from "@/lib/cancellation/calculateRefund";
import { sendBookingEmail } from "@/lib/notifications/email/sendBookingEmail";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const user = await getCurrentUser();
    const { id } = await params;

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        homestay: {
          select: {
            cancellationPolicy: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    if (booking.status !== "CONFIRMED") {
      return NextResponse.json(
        { success: false, error: "Booking cannot be cancelled" },
        { status: 400 }
      );
    }

    const now = new Date();
    if (now >= booking.checkIn) {
      return NextResponse.json(
        { success: false, error: "Cannot cancel after check-in" },
        { status: 400 }
      );
    }

    const daysBeforeCheckIn = Math.ceil(
      (booking.checkIn.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const refundAmount = calculateRefund({
      policy: booking.homestay.cancellationPolicy,
      totalPrice: Number(booking.totalPrice),
      daysBeforeCheckIn,
    });

    await prisma.booking.update({
      where: { id },
      data: {
        status: "CANCELLED_BY_GUEST",
        cancelledAt: new Date(),
        cancelledBy: "GUEST",
        refundAmount,
        refundStatus: refundAmount > 0 ? "PENDING" : "NOT_APPLICABLE",
      },
    });

    // 🔔 Send cancellation emails AFTER update
    await sendBookingEmail(booking.id, "BOOKING_CANCELLED");

    return NextResponse.json({
      success: true,
      refundAmount,
      refundStatus: refundAmount > 0 ? "PENDING" : "NOT_APPLICABLE",
    });
  } catch (error) {
    console.error("[POST /bookings/[id]/cancel]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
