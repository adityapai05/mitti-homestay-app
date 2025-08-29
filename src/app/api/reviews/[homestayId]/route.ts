import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

type ReviewOrderByInput =
  | { createdAt: "asc" | "desc" }
  | { rating: "asc" | "desc" };

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ homestayId: string }> }
) {
  try {
    const { homestayId } = await context.params;
    if (!homestayId) {
      return NextResponse.json(
        { error: "Homestay ID is required" },
        { status: 400 }
      );
    }

    const homestay = await prisma.homestay.findUnique({
      where: { id: homestayId },
      select: { id: true, name: true },
    });

    if (!homestay) {
      return NextResponse.json(
        { error: "Homestay not found." },
        { status: 404 }
      );
    }

    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const limit = Number(searchParams.get("limit") || 20);
    const page = Number(searchParams.get("page") || 1);
    const rating = searchParams.get("rating");
    const sortBy = searchParams.get("sortBy") || "newest";

    const where: Prisma.ReviewWhereInput = {
      homestayId,
    };

    if (rating) {
      where.rating = Number(rating);
    }

    let orderBy: ReviewOrderByInput = { createdAt: "desc" };
    if (sortBy === "oldest") orderBy = { createdAt: "asc" };
    if (sortBy === "highest") orderBy = { rating: "desc" };
    if (sortBy === "oldest") orderBy = { rating: "asc" };

    const skip = (page - 1) * limit;

    const [reviews, totalCount, avgRating] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy,
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
          booking: {
            select: {
              id: true,
              checkIn: true,
              checkOut: true,
              guests: true,
            },
          },
        },
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where,
        _avg: {
          rating: true,
        },
      }),
    ]);

    const ratingDistribution = await prisma.review.groupBy({
      by: ["rating"],
      where,
      _count: {
        rating: true,
      },
      orderBy: {
        rating: "desc",
      },
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      reviews,
      homestay: {
        id: homestay.id,
        name: homestay.name,
      },
      stats: {
        totalReviews: totalCount,
        averageRating: Number(avgRating._avg.rating?.toFixed(1)) || 0,
        ratingDistribution: ratingDistribution.map((item) => ({
          rating: item.rating,
          count: item._count.rating,
        })),
      },
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    });
  } catch (error: unknown) {
    console.error("[GET /reviews/[homestayId]] ", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

const createReviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(1000, "Comment must be less than 1000 characters")
    .optional(),
  bookingId: z.uuid("Invalid booking ID"),
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ homestayId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const { homestayId } = await context.params;

    if (!homestayId) {
      return NextResponse.json(
        { error: "Homestay ID is required." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = createReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: z.treeifyError(parsed.error) },
        { status: 400 }
      );
    }

    const { rating, comment, bookingId } = parsed.data;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        homestay: {
          select: { id: true, name: true },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 }
      );
    }

    if (booking.userId !== user.id) {
      return NextResponse.json(
        { error: "You can only review your own bookings." },
        { status: 403 }
      );
    }

    if (booking.homestayId !== homestayId) {
      return NextResponse.json(
        { error: "Booking does not match the homestay." },
        { status: 400 }
      );
    }

    if (booking.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "You can only review completed bookings." },
        { status: 400 }
      );
    }

    const existingReview = await prisma.review.findUnique({
      where: { bookingId },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this booking." },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        homestayId,
        bookingId,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        booking: {
          select: {
            id: true,
            checkIn: true,
            checkOut: true,
            guests: true,
          },
        },
      },
    });

    const avgRatingResult = await prisma.review.aggregate({
      where: { homestayId },
      _avg: {
        rating: true,
      },
    });

    await prisma.homestay.update({
      where: { id: homestayId },
      data: {
        rating: Number(avgRatingResult._avg.rating?.toFixed(1) || 0),
      },
    });

    return NextResponse.json(
      {
        message: "Review created successfully!",
        review,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[POST /reviews/[homestayId]]", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
