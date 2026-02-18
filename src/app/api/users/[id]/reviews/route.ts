import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type SortBy = "newest" | "oldest" | "highest" | "lowest";

type HostReviewDTO = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  homestay: {
    id: string;
    name: string;
    village: string | null;
    state: string | null;
  };
  booking: {
    checkIn: string;
    checkOut: string;
  };
};

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.floor(parsed);
}

function parseRating(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5) return undefined;
  return parsed;
}

function parseSortBy(value: string | null): SortBy {
  if (value === "oldest") return "oldest";
  if (value === "highest") return "highest";
  if (value === "lowest") return "lowest";
  return "newest";
}

function getOrderBy(sortBy: SortBy): Prisma.ReviewOrderByWithRelationInput {
  if (sortBy === "oldest") return { createdAt: "asc" };
  if (sortBy === "highest") return { rating: "desc" };
  if (sortBy === "lowest") return { rating: "asc" };
  return { createdAt: "desc" };
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: userId } = await context.params;
    const { searchParams } = new URL(req.url);

    const requestedPage = parsePositiveInt(searchParams.get("page"), 1);
    const limit = parsePositiveInt(searchParams.get("limit"), 10);
    const rating = parseRating(searchParams.get("rating"));
    const sortBy = parseSortBy(searchParams.get("sortBy"));

    const host = await prisma.user.findFirst({
      where: {
        id: userId,
        role: { in: ["HOST", "USER"] },
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });

    if (!host) {
      return NextResponse.json({ error: "Host not found." }, { status: 404 });
    }

    const where: Prisma.ReviewWhereInput = {
      homestay: { ownerId: userId },
      ...(rating ? { rating } : {}),
    };

    const totalCount = await prisma.review.count({ where });
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    const currentPage = Math.min(requestedPage, totalPages);
    const skip = (currentPage - 1) * limit;

    const [reviews, avgRating, distribution] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: getOrderBy(sortBy),
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, image: true } },
          homestay: {
            select: {
              id: true,
              name: true,
              village: true,
              state: true,
            },
          },
          booking: {
            select: {
              checkIn: true,
              checkOut: true,
            },
          },
        },
      }),
      prisma.review.aggregate({
        where,
        _avg: {
          rating: true,
        },
      }),
      prisma.review.groupBy({
        by: ["rating"],
        where,
        _count: {
          rating: true,
        },
        orderBy: {
          rating: "desc",
        },
      }),
    ]);

    const mappedReviews: HostReviewDTO[] = reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      user: {
        id: review.user.id,
        name: review.user.name,
        image: review.user.image,
      },
      homestay: {
        id: review.homestay.id,
        name: review.homestay.name,
        village: review.homestay.village,
        state: review.homestay.state,
      },
      booking: {
        checkIn: review.booking.checkIn.toISOString(),
        checkOut: review.booking.checkOut.toISOString(),
      },
    }));

    return NextResponse.json({
      host: {
        id: host.id,
        name: host.name,
        image: host.image,
      },
      reviews: mappedReviews,
      stats: {
        totalReviews: totalCount,
        averageRating: Number(avgRating._avg.rating?.toFixed(1) ?? 0),
        ratingDistribution: distribution.map((item) => ({
          rating: item.rating,
          count: item._count.rating,
        })),
      },
      pagination: {
        currentPage,
        totalPages,
        totalCount,
        limit,
      },
    });
  } catch (error) {
    console.error("[GET /api/users/[id]/reviews]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
