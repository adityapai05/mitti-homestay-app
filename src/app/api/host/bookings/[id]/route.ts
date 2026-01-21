import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { sendBookingEmail } from "@/lib/notifications/email/sendBookingEmail";
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

    if (user.role !== "HOST" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only hosts can access this resource." },
        { status: 403 }
      );
    }

    const { id } = await context.params;

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
          },
        },
        payment: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 }
      );
    }

    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);

    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const displayAddress = [booking.homestay.village, booking.homestay.state]
      .filter(Boolean)
      .join(", ");

    const hostActions = {
      canApprove: booking.status === "PENDING_HOST_APPROVAL",
      canReject: booking.status === "PENDING_HOST_APPROVAL",
    };

    return NextResponse.json({
      id: booking.id,
      status: booking.status,
      guests: booking.guests,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      nights,
      createdAt: booking.createdAt,

      guest: booking.user,

      homestay: {
        id: booking.homestay.id,
        name: booking.homestay.name,
        imageUrl: booking.homestay.imageUrl,
        displayAddress,
      },

      price: {
        total: Number(booking.totalPrice),
      },

      payment: booking.payment
        ? {
            amount: Number(booking.payment.amount),
            currency: booking.payment.currency,
            razorpayPaymentId: booking.payment.razorpayPaymentId,
            createdAt: booking.payment.createdAt,
          }
        : null,

      hostActions,
    });
  } catch (error) {
    console.error("[GET /api/host/bookings/[id]]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "HOST" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { action } = body;

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const booking = await prisma.booking.findFirst({
      where: {
        id,
        homestay: { ownerId: user.id },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status !== "PENDING_HOST_APPROVAL") {
      return NextResponse.json(
        { error: "Booking is not pending approval" },
        { status: 400 }
      );
    }

    const newStatus =
      action === "approve" ? "AWAITING_PAYMENT" : "CANCELLED_BY_HOST";

    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: newStatus },
    });

    if (action === "approve") {
      await sendBookingEmail(booking.id, "BOOKING_APPROVED");
    }

    if (action === "reject") {
      await sendBookingEmail(booking.id, "BOOKING_CANCELLED");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PATCH /api/host/bookings/[id]]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
