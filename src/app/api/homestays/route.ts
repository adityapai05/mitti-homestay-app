import { prisma } from "@/lib/prisma";
import { Category, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { publicHomestayWhere } from "@/lib/visibility/homestayVisibility";
import { parseQueryParams } from "@/lib/validation/commonSchemas";
import { querySchema as homestayQuerySchema } from "@/lib/validation/homestaySchemas";

const PAGE_SIZE = 8;
const MAX_PAGE_SIZE = 20;

const SORT_MAP: Record<string, Prisma.HomestayOrderByWithRelationInput> = {
  "createdAt-desc": { createdAt: "desc" },
  "price-asc": { pricePerNight: "asc" },
  "price-desc": { pricePerNight: "desc" },
  "rating-desc": { rating: "desc" },
};

export async function GET(req: NextRequest) {
  try {
    const parsedQuery = parseQueryParams(req, homestayQuerySchema);
    if (!parsedQuery.success) {
      return parsedQuery.response;
    }

    const query = parsedQuery.data;

    const page = query.page ?? 1;
    const limit = PAGE_SIZE;

    const destination = query.destination;
    const categories = query.category
      ? query.category
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];
    const type = query.type;
    const sort = query.sort || "createdAt-desc";
    const amenities = query.amenities
      ? query.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    const checkIn = query.checkIn;
    const checkOut = query.checkOut;

    const where: Prisma.HomestayWhereInput = {
      ...publicHomestayWhere(),
    };

    /* ---------- category ---------- */
    if (categories.length > 0) {
      const valid = categories.filter((c) =>
        Object.values(Category).includes(c as Category),
      );

      if (valid.length === 0) {
        return NextResponse.json(
          { error: "Invalid category" },
          { status: 400 },
        );
      }

      if (valid.length !== categories.length) {
        return NextResponse.json(
          { error: "Invalid category" },
          { status: 400 },
        );
      }

      where.category = { in: valid as Category[] };
    }

    /* ---------- type ---------- */
    if (type) {
      if (type !== "ROOM" && type !== "HOME") {
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
      }
      where.type = type;
    }

    /* ---------- capacity ---------- */
    if (query.minGuests !== undefined) {
      where.maxGuests = { gte: query.minGuests };
    }
    if (query.minBedrooms !== undefined) {
      where.bedrooms = { gte: query.minBedrooms };
    }
    if (query.minBathrooms !== undefined) {
      where.bathrooms = { gte: query.minBathrooms };
    }

    /* ---------- price ---------- */
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.pricePerNight = {};
      if (query.minPrice !== undefined) {
        where.pricePerNight.gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        where.pricePerNight.lte = query.maxPrice;
      }
    }

    if (
      query.minPrice !== undefined &&
      query.maxPrice !== undefined &&
      query.minPrice > query.maxPrice
    ) {
      return NextResponse.json(
        { error: "minPrice cannot exceed maxPrice" },
        { status: 400 },
      );
    }

    /* ---------- amenities ---------- */
    if (amenities.length > 0) {
      where.amenities = {
        hasEvery: Array.from(new Set(amenities)),
      };
    }

    /* ---------- guide ---------- */
    if (query.guideAvailable !== undefined) {
      where.guideAvailable = query.guideAvailable === "true";
    }

    /* ---------- cancellation ---------- */
    if (query.freeCancellation === "true") {
      where.cancellationPolicy = { not: "STRICT" };
    }

    /* ---------- destination ---------- */
    if (destination) {
      where.OR = [
        { village: { contains: destination, mode: "insensitive" } },
        { district: { contains: destination, mode: "insensitive" } },
        { state: { contains: destination, mode: "insensitive" } },
      ];
    }

    /* ---------- availability ---------- */
    if (checkIn && checkOut) {
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);

      if (
        Number.isNaN(inDate.getTime()) ||
        Number.isNaN(outDate.getTime()) ||
        outDate <= inDate
      ) {
        return NextResponse.json(
          { error: "Invalid checkIn or checkOut" },
          { status: 400 },
        );
      }

      where.bookings = {
        none: {
          OR: [
            {
              checkIn: { lte: outDate },
              checkOut: { gte: inDate },
            },
          ],
        },
      };
    }
    /* ---------- rating ---------- */
    if (query.rating !== undefined) {
      where.rating = { gte: query.rating };
    }

    /* ---------- sorting ---------- */
    const orderBy = SORT_MAP[sort] ?? SORT_MAP["createdAt-desc"];

    const total = await prisma.homestay.count({ where });

    const skip = (page - 1) * limit;

    const homestays = await prisma.homestay.findMany({
      where,
      orderBy,
      take: Math.min(limit, MAX_PAGE_SIZE),
      skip,
    });

    return NextResponse.json({
      homestays,
      page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
    });
  } catch (error) {
    console.error("[GET /homestays]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
