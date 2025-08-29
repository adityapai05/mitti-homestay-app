import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // const status = searchParams.get("status");
    const upcoming = searchParams.get("upcoming") === "true";
    const past = searchParams.get("past") === "true";
    const limit = Number(searchParams.get("limit") || 20);
    const page = Number(searchParams.get("page") || 1);

    const where: Prisma.BookingWhereInput = {
      userId: user.id,
    };

    const now = new Date();
    if (upcoming) {
      where.checkIn = { gt: now };
      where.status = { in: ["CONFIRMED", "PENDING"] };
    } else if (past) {
      where.checkOut = { lt: now };
    }

    const skip = (page - 1) * limit;

    const [bookings, totalCount] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
        include: {
          homestay: {
            select: {
              id: true,
              name: true,
              address: true,
              imageUrl: true,
              latitude: true,
              longitude: true,
              owner: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    const bookingsWithStatus = bookings.map((booking) => {
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
      return {
        ...booking,
        nights,
        bookingStatus,
      };
    });
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      bookings: bookingsWithStatus,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    });
  } catch (error) {
    console.error("[GET /bookings]", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
