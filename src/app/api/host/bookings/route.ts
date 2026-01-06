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

    if (user.role !== "HOST" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only hosts can access this resource." },
        { status: 403 }
      );
    }

    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const pending = searchParams.get("pending") === "true";
    const upcoming = searchParams.get("upcoming") === "true";
    const past = searchParams.get("past") === "true";

    const limit = Number(searchParams.get("limit") || 20);
    const page = Number(searchParams.get("page") || 1);

    const now = new Date();

    const where: Prisma.BookingWhereInput = {
      homestay: {
        ownerId: user.id,
      },
    };

    if (pending) {
      where.status = "PENDING_HOST_APPROVAL";
    }

    if (upcoming) {
      where.status = {
        in: ["CONFIRMED", "AWAITING_PAYMENT"],
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
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          homestay: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              village: true,
              district: true,
              state: true,
              pincode: true,
            },
          },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    const bookingsWithMeta = bookings.map((booking) => {
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
        id: booking.id,
        status: booking.status,
        guests: booking.guests,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        nights,
        createdAt: booking.createdAt,

        guest: booking.user,
        homestay: {
          ...booking.homestay,
          displayAddress,
        },

        hostActions,
      };
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      bookings: bookingsWithMeta,
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
    console.error("[GET /api/host/bookings]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
