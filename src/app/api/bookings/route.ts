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

    const upcoming = searchParams.get("upcoming") === "true";
    const past = searchParams.get("past") === "true";
    const limit = Number(searchParams.get("limit") || 20);
    const page = Number(searchParams.get("page") || 1);

    const now = new Date();

    const where: Prisma.BookingWhereInput = {
      userId: user.id,
    };

    if (upcoming) {
      where.status = {
        in: ["PENDING_HOST_APPROVAL", "AWAITING_PAYMENT", "CONFIRMED"],
      };
      where.checkOut = { gt: now };
    }

    if (past) {
      where.status = {
        in: ["COMPLETED", "CANCELLED_BY_GUEST", "CANCELLED_BY_HOST"],
      };
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
              imageUrl: true,
              latitude: true,
              longitude: true,
              flatno: true,
              street: true,
              village: true,
              district: true,
              state: true,
              pincode: true,
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

    const bookingsWithComputedState = bookings.map((booking) => {
      const checkInDate = new Date(booking.checkIn);
      const checkOutDate = new Date(booking.checkOut);

      const nights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      const displayAddress = [booking.homestay.village, booking.homestay.state]
        .filter(Boolean)
        .join(", ");

      const bookingStatusMeta = {
        canCancel: booking.status === "CONFIRMED" && checkInDate > now,

        canPay: booking.status === "AWAITING_PAYMENT",

        isAwaitingHostApproval: booking.status === "PENDING_HOST_APPROVAL",

        isUpcoming: booking.status === "CONFIRMED" && checkInDate > now,

        isActive:
          booking.status === "CONFIRMED" &&
          checkInDate <= now &&
          checkOutDate > now,

        isPast:
          booking.status === "COMPLETED" ||
          booking.status === "CANCELLED_BY_GUEST" ||
          booking.status === "CANCELLED_BY_HOST",
      };

      return {
        ...booking,
        nights,
        bookingStatus: bookingStatusMeta,
        homestay: {
          ...booking.homestay,
          displayAddress,
        },
      };
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      bookings: bookingsWithComputedState,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
    });
  } catch (error) {
    console.error("[GET /bookings]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
