import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const createBookingSchema = z
  .object({
    homestayId: z.uuid("Invalid homestay ID"),
    checkIn: z.string().refine((date) => {
      const checkInDate = new Date(date);
      const now = new Date();
      return !isNaN(checkInDate.getTime()) && checkInDate > now;
    }, "Check-in date must be a valid future date"),

    checkOut: z.string().refine((date) => {
      const checkOutDate = new Date(date);
      return !isNaN(checkOutDate.getTime());
    }, "Check-out date must be a valid date"),

    guests: z.number().int().min(1, "At least 1 guest is required"),
  })
  .refine(
    (data) => {
      const checkIn = new Date(data.checkIn);
      const checkOut = new Date(data.checkOut);

      if (checkOut <= checkIn) return false;

      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 1) return false;

      return true;
    },
    {
      message: "Check-out must be after check-in with minimum 1 night stay",
      path: ["checkOut"],
    }
  );

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

    const homestay = await prisma.homestay.findUnique({
      where: { id: homestayId },
      select: {
        id: true,
        name: true,
        maxGuests: true,
        pricePerNight: true,
        ownerId: true,
        bookings: {
          where: {
            status: {
              in: ["CONFIRMED", "PENDING"],
            },
            OR: [
              {
                checkIn: { lt: checkOutDate },
                checkOut: { gt: checkInDate },
              },
            ],
          },
        },
      },
    });

    if (!homestay) {
      return NextResponse.json(
        { error: "Homestay not found." },
        { status: 404 }
      );
    }

    if (homestay.ownerId === user.id) {
      return NextResponse.json(
        { error: "You cannot book your own homestay." },
        { status: 400 }
      );
    }

    if (guests > homestay.maxGuests) {
      return NextResponse.json(
        { error: `Maximum ${homestay.maxGuests} guests allowed` },
        { status: 400 }
      );
    }

    if (homestay.bookings.length > 0) {
      return NextResponse.json(
        { error: "Homestay is not available for the selected dates." },
        { status: 400 }
      );
    }

    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = homestay.pricePerNight.mul(nights);

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        homestayId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        totalPrice,
        status: "PENDING",
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
            owner: {
              select: {
                id: true,
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

    return NextResponse.json(
      {
        message: "Booking created successfully!",
        booking,
        nights,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[POST /bookings/create] ", error);
    return NextResponse.json(
      {
        error: (error as Error).message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
