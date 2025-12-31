import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: homestayId } = await context.params;

  try {
    const homestayExists = await prisma.homestay.findUnique({
      where: { id: homestayId },
      select: { id: true },
    });

    if (!homestayExists) {
      return NextResponse.json(
        { error: "Homestay not found" },
        { status: 404 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: {
        homestayId,
        status: {
          in: ["PENDING_HOST_APPROVAL", "AWAITING_PAYMENT", "CONFIRMED"],
        },
      },
      select: {
        checkIn: true,
        checkOut: true,
      },
    });

    const blockedDates = new Set<string>();

    for (const booking of bookings) {
      const current = new Date(booking.checkIn);
      const end = new Date(booking.checkOut);

      current.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      while (current < end) {
        blockedDates.add(current.toISOString().slice(0, 10));
        current.setDate(current.getDate() + 1);
      }
    }

    return NextResponse.json({
      dates: Array.from(blockedDates).sort(),
    });
  } catch (error) {
    console.error("[GET /api/homestays/[id]/booked-dates]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
