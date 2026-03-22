import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import {
  createSchema as reviewCreateSchema,
  querySchema as reviewQuerySchema,
  routeParamSchema as reviewRouteParamSchema,
  updateSchema as reviewUpdateSchema,
} from "@/lib/validation/reviewSchemas";
import {
  parseJsonBody,
  parseParams,
  parseQueryParams,
} from "@/lib/validation/commonSchemas";

type ReviewOrderByInput =
  | { createdAt: "asc" | "desc" }
  | { rating: "asc" | "desc" };

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ homestayId: string }> },
) {
  try {
    const parsedParams = parseParams(await context.params, reviewRouteParamSchema);
    if (!parsedParams.success) {
      return parsedParams.response;
    }

    const parsedQuery = parseQueryParams(req, reviewQuerySchema);
    if (!parsedQuery.success) {
      return parsedQuery.response;
    }

    const { homestayId } = parsedParams.data;
    const user = await getCurrentUser();

    const homestay = await prisma.homestay.findFirst({
      where: {
        id: homestayId,
        ...(user?.role === "ADMIN"
          ? {}
          : user?.role === "HOST"
            ? { OR: [{ isVerified: true }, { ownerId: user.id }] }
            : { isVerified: true }),
      },
      select: { id: true, name: true },
    });

    if (!homestay) {
      return NextResponse.json({ error: "Homestay not found." }, { status: 404 });
    }

    const limit = parsedQuery.data.limit ?? 20;
    const page = parsedQuery.data.page ?? 1;
    const rating = parsedQuery.data.rating;
    const sortBy = parsedQuery.data.sortBy ?? "newest";

    const where: Prisma.ReviewWhereInput = { homestayId };
    if (rating && rating !== "all") where.rating = Number(rating);

    let orderBy: ReviewOrderByInput = { createdAt: "desc" };
    if (sortBy === "oldest") orderBy = { createdAt: "asc" };
    if (sortBy === "highest") orderBy = { rating: "desc" };
    if (sortBy === "lowest") orderBy = { rating: "asc" };

    const skip = (page - 1) * limit;

    const [reviews, totalCount, avgRating] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy,
        take: limit,
        skip,
        include: {
          user: { select: { id: true, name: true, image: true } },
          booking: {
            select: { id: true, checkIn: true, checkOut: true, guests: true },
          },
        },
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({ where, _avg: { rating: true } }),
    ]);

    const ratingDistribution = await prisma.review.groupBy({
      by: ["rating"],
      where,
      _count: { rating: true },
      orderBy: { rating: "desc" },
    });

    return NextResponse.json({
      reviews,
      homestay,
      stats: {
        totalReviews: totalCount,
        averageRating: Number(avgRating._avg.rating?.toFixed(1) ?? 0),
        ratingDistribution: ratingDistribution.map((r) => ({
          rating: r.rating,
          count: r._count.rating,
        })),
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit,
      },
    });
  } catch (error) {
    console.error("[GET /reviews]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ homestayId: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsedParams = parseParams(await context.params, reviewRouteParamSchema);
    if (!parsedParams.success) {
      return parsedParams.response;
    }

    const parsedBody = await parseJsonBody(req, reviewCreateSchema);
    if (!parsedBody.success) {
      return parsedBody.response;
    }

    const { homestayId } = parsedParams.data;
    const body = parsedBody.data;

    const booking = await prisma.booking.findUnique({
      where: { id: body.bookingId },
      select: {
        id: true,
        homestayId: true,
        userId: true,
        status: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    if (booking.homestayId !== homestayId) {
      return NextResponse.json(
        { error: "Booking does not belong to this homestay." },
        { status: 400 },
      );
    }

    if (booking.userId !== user.id) {
      return NextResponse.json(
        { error: "You can only review your own booking." },
        { status: 403 },
      );
    }

    if (booking.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "You can only review completed stays." },
        { status: 400 },
      );
    }

    const review = await prisma.$transaction(async (tx) => {
      const existing = await tx.review.findUnique({
        where: { bookingId: body.bookingId },
        select: { id: true },
      });

      if (existing) {
        throw new Error("REVIEW_ALREADY_EXISTS");
      }

      const created = await tx.review.create({
        data: {
          userId: user.id,
          homestayId: booking.homestayId,
          bookingId: body.bookingId,
          rating: body.rating,
          comment: body.comment,
        },
      });

      const avg = await tx.review.aggregate({
        where: { homestayId: booking.homestayId },
        _avg: { rating: true },
      });

      await tx.homestay.update({
        where: { id: booking.homestayId },
        data: {
          rating: Number(avg._avg.rating?.toFixed(1) ?? 0),
        },
      });

      return created;
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    if ((error as Error).message === "REVIEW_ALREADY_EXISTS") {
      return NextResponse.json({ error: "Review already exists." }, { status: 400 });
    }

    console.error("[POST /reviews]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ homestayId: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsedParams = parseParams(await context.params, reviewRouteParamSchema);
    if (!parsedParams.success) {
      return parsedParams.response;
    }

    const parsedBody = await parseJsonBody(req, reviewUpdateSchema);
    if (!parsedBody.success) {
      return parsedBody.response;
    }

    const { homestayId } = parsedParams.data;
    const body = parsedBody.data;

    const review = await prisma.review.findUnique({
      where: { bookingId: body.bookingId },
      select: {
        bookingId: true,
        userId: true,
        homestayId: true,
      },
    });

    if (!review || review.userId !== user.id) {
      return NextResponse.json(
        { error: "Review not found or forbidden." },
        { status: 403 },
      );
    }

    if (review.homestayId !== homestayId) {
      return NextResponse.json(
        { error: "Review does not belong to this homestay." },
        { status: 400 },
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: body.bookingId },
      select: { id: true, status: true, homestayId: true, userId: true },
    });

    if (!booking || booking.userId !== user.id || booking.homestayId !== homestayId) {
      return NextResponse.json({ error: "Invalid booking." }, { status: 400 });
    }

    if (booking.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Only completed stays can be reviewed." },
        { status: 400 },
      );
    }

    const updated = await prisma.review.update({
      where: { bookingId: body.bookingId },
      data: {
        rating: body.rating,
        comment: body.comment,
      },
    });

    const avg = await prisma.review.aggregate({
      where: { homestayId },
      _avg: { rating: true },
    });

    await prisma.homestay.update({
      where: { id: homestayId },
      data: { rating: Number(avg._avg.rating?.toFixed(1) ?? 0) },
    });

    return NextResponse.json({ review: updated });
  } catch (error) {
    console.error("[PATCH /reviews]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}