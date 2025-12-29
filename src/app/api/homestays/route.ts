import { prisma } from "@/lib/prisma";
import { Category, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { publicHomestayWhere } from "@/lib/visibility/homestayVisibility";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const category = searchParams.get("category");
    const guests = searchParams.get("guests");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const type = searchParams.get("type");
    const rating = searchParams.get("rating");
    const amenities = searchParams.getAll("amenities");
    const page = Number(searchParams.get("page") || 1);
    const limit = 8;
    const guideAvailable = searchParams.get("guideAvailable");
    const destination = searchParams.get("destination");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const sort = searchParams.get("sort") || "createdAt-desc";

    const where: Prisma.HomestayWhereInput = {
      ...publicHomestayWhere(),
    };

    if (guideAvailable) where.guideAvailable = guideAvailable === "true";

    if (category) {
      const validCategories = Object.values(Category);
      if (validCategories.includes(category as Category)) {
        where.category = category as Category;
      } else {
        return NextResponse.json(
          {
            error: `Invalid category. Must be one of: ${validCategories.join(
              ", "
            )}`,
          },
          { status: 400 }
        );
      }
    }

    if (guests) where.maxGuests = { gte: Number(guests) };

    if (minPrice || maxPrice) {
      where.pricePerNight = {};
      if (minPrice) where.pricePerNight.gte = Number(minPrice);
      if (maxPrice) where.pricePerNight.lte = Number(maxPrice);
    }

    if (type) {
      const validTypes = ["ROOM", "HOME"];
      if (validTypes.includes(type)) {
        where.type = type as "ROOM" | "HOME";
      } else {
        return NextResponse.json(
          { error: "Invalid type. Must be one of: ROOM, HOME" },
          { status: 400 }
        );
      }
    }

    if (rating) where.rating = { gte: Number(rating) };

    if (amenities.length > 0) {
      where.amenities = {
        hasEvery: [...new Set(amenities)],
      };
    }

    if (destination) {
      where.OR = [
        { village: { contains: destination, mode: "insensitive" } },
        { district: { contains: destination, mode: "insensitive" } },
        { state: { contains: destination, mode: "insensitive" } },
      ];
    }

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid checkIn or checkOut date format. Use YYYY-MM-DD." },
          { status: 400 }
        );
      }

      if (checkOutDate <= checkInDate) {
        return NextResponse.json(
          { error: "checkOut date must be after checkIn date." },
          { status: 400 }
        );
      }

      where.bookings = {
        none: {
          OR: [
            {
              checkIn: { lte: checkOutDate },
              checkOut: { gte: checkInDate },
            },
          ],
        },
      };
    }

    const orderBy: Prisma.HomestayOrderByWithRelationInput = {};
    switch (sort) {
      case "price-asc":
        orderBy.pricePerNight = "asc";
        break;
      case "price-desc":
        orderBy.pricePerNight = "desc";
        break;
      case "rating-desc":
        orderBy.rating = "desc";
        break;
      case "createdAt-desc":
      default:
        orderBy.createdAt = "desc";
        break;
    }

    const totalHomestays = await prisma.homestay.count({ where });

    const skip = (page - 1) * limit;
    const homestays = await prisma.homestay.findMany({
      where,
      orderBy,
      take: limit,
      skip,
    });

    const totalPages = Math.ceil(totalHomestays / limit);

    return NextResponse.json({
      homestays,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error("[GET /homestays]", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
