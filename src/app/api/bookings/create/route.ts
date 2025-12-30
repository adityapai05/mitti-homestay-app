import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const createBookingSchema = z
  .object({
    homestayId: z.uuid("Invalid homestay ID"),
    checkIn: z.string().refine((date) => {
      const d = new Date(date);
      return !isNaN(d.getTime()) && d > new Date();
    }),
    checkOut: z.string(),
    guests: z.number().int().min(1),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = createBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: z.treeifyError(parsed.error) },
        { status: 400 }
      );
    }

    const { homestayId, checkIn, checkOut, guests } = parsed.data;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const booking = await prisma.$transaction(async (tx) => {
      // Fetch homestay inside transaction
      const homestay = await tx.homestay.findUnique({
        where: { id: homestayId },
        select: {
          id: true,
          ownerId: true,
          isVerified: true,
          maxGuests: true,
          pricePerNight: true,
        },
      });

      if (!homestay) throw new Error("HOMESTAY_NOT_FOUND");
      if (!homestay.isVerified) throw new Error("HOMESTAY_NOT_VERIFIED");
      if (homestay.ownerId === user.id)
        throw new Error("CANNOT_BOOK_OWN_HOMESTAY");
      if (guests > homestay.maxGuests) throw new Error("MAX_GUESTS_EXCEEDED");

      // Block dates for all non-dead bookings
      const overlapping = await tx.booking.findFirst({
        where: {
          homestayId,
          status: {
            in: ["PENDING_HOST_APPROVAL", "AWAITING_PAYMENT", "CONFIRMED"],
          },
          checkIn: { lt: checkOutDate },
          checkOut: { gt: checkInDate },
        },
      });

      if (overlapping) throw new Error("DATES_NOT_AVAILABLE");

      const nights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      const totalPrice = homestay.pricePerNight.mul(nights);

      return tx.booking.create({
        data: {
          userId: user.id,
          homestayId,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests,
          totalPrice,
          status: "PENDING_HOST_APPROVAL",
        },
      });
    });

    return NextResponse.json(
      {
        message: "Booking request sent to host.",
        booking,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[POST /bookings/create]", error);

    const statusMap: Record<string, number> = {
      HOMESTAY_NOT_FOUND: 404,
      HOMESTAY_NOT_VERIFIED: 403,
      CANNOT_BOOK_OWN_HOMESTAY: 400,
      MAX_GUESTS_EXCEEDED: 400,
      DATES_NOT_AVAILABLE: 409,
    };

    return NextResponse.json(
      {
        error: (error as Error).message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
