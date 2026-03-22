import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { sendBookingEmail } from "@/lib/notifications/email/sendBookingEmail";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { serverCalculateBookingPrice } from "@/lib/pricing/serverCalculateBookingPrice";
import { Prisma } from "@prisma/client";
import { adminAuth } from "@/lib/firebase/admin";
import { createSchema as createBookingSchema } from "@/lib/validation/bookingSchemas";
import { parseJsonBody } from "@/lib/validation/commonSchemas";

const ACTIVE_BOOKING_STATUSES = [
  "PENDING_HOST_APPROVAL",
  "AWAITING_PAYMENT",
  "CONFIRMED",
] as const;

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    const firebaseUser = await adminAuth.getUser(user.firebaseUid);
    if (!firebaseUser.emailVerified) {
      return NextResponse.json(
        {
          error: "Please verify your email before requesting a booking.",
          code: "EMAIL_NOT_VERIFIED",
        },
        { status: 403 },
      );
    }

    const parsedBody = await parseJsonBody(req, createBookingSchema);
    if (!parsedBody.success) {
      return parsedBody.response;
    }

    const { homestayId, checkIn, checkOut, guests } = parsedBody.data;

    const checkInDate = new Date(`${checkIn}T00:00:00.000Z`);
    const checkOutDate = new Date(`${checkOut}T00:00:00.000Z`);

    let booking;
    let lastError: unknown;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        booking = await prisma.$transaction(
          async (tx) => {
            const homestay = await tx.homestay.findUnique({
              where: { id: homestayId },
              select: {
                id: true,
                ownerId: true,
                isVerified: true,
                maxGuests: true,
              },
            });

            if (!homestay) throw new Error("HOMESTAY_NOT_FOUND");
            if (!homestay.isVerified) throw new Error("HOMESTAY_NOT_VERIFIED");
            if (homestay.ownerId === user.id) {
              throw new Error("CANNOT_BOOK_OWN_HOMESTAY");
            }
            if (guests > homestay.maxGuests) throw new Error("MAX_GUESTS_EXCEEDED");

            const overlapping = await tx.booking.findFirst({
              where: {
                homestayId,
                status: { in: [...ACTIVE_BOOKING_STATUSES] },
                checkIn: { lt: checkOutDate },
                checkOut: { gt: checkInDate },
              },
              select: { id: true },
            });

            if (overlapping) throw new Error("DATES_NOT_AVAILABLE");

            const pricing = await serverCalculateBookingPrice({
              homestayId,
              checkIn: checkInDate,
              checkOut: checkOutDate,
              guests,
              includeGuide: false,
              prismaClient: tx,
            });

            return tx.booking.create({
              data: {
                userId: user.id,
                homestayId,
                checkIn: checkInDate,
                checkOut: checkOutDate,
                guests,
                nights: pricing.nights,
                stayBase: new Prisma.Decimal(pricing.stayBase),
                guideFee: new Prisma.Decimal(pricing.guideFee),
                platformFee: new Prisma.Decimal(pricing.platformFee),
                gst: new Prisma.Decimal(pricing.gst),
                subtotal: new Prisma.Decimal(pricing.subtotal),
                totalPrice: new Prisma.Decimal(pricing.total),
                status: "PENDING_HOST_APPROVAL",
              },
            });
          },
          { isolationLevel: "Serializable" },
        );
        break;
      } catch (error) {
        lastError = error;
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2034" &&
          attempt < 1
        ) {
          continue;
        }
        throw error;
      }
    }
    if (!booking) {
      throw lastError ?? new Error("BOOKING_CREATION_FAILED");
    }
    await sendBookingEmail(booking.id, "BOOKING_REQUESTED");
    return NextResponse.json(
      {
        message: "Booking request sent to host.",
        booking,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("[POST /bookings/create]", error);
    const code = (error as Error).message;
    if (
      code === "HOMESTAY_NOT_FOUND" ||
      code === "HOMESTAY_NOT_VERIFIED" ||
      code === "MAX_GUESTS_EXCEEDED" ||
      code === "DATES_NOT_AVAILABLE"
    ) {
      return NextResponse.json({ error: code, code }, { status: 400 });
    }
    if (code === "CANNOT_BOOK_OWN_HOMESTAY") {
      return NextResponse.json({ error: code, code }, { status: 403 });
    }

    return NextResponse.json(
      {
        error: (error as Error).message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
