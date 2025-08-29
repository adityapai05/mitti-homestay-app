import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const category = searchParams.get("category");
    const maxGuests = searchParams.get("maxGuests");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const type = searchParams.get("type");
    const rating = searchParams.get("rating");
    const amenities = searchParams.getAll("amenities");
    const page = Number(searchParams.get("page") || 1);
    const limit = 8; // Fixed limit of 8 homestays per page
    const isVerified = searchParams.get("isVerified");
    const guideAvailable = searchParams.get("guideAvailable");
    const destination = searchParams.get("destination");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const sort = searchParams.get("sort") || "createdAt-desc";

    const where: any = {};

    if (isVerified) where.isVerified = isVerified === "true";
    if (guideAvailable) where.guideAvailable = guideAvailable === "true";
    if (category) where.category = category;
    if (maxGuests) where.maxGuests = { gte: Number(maxGuests) };
    if (minPrice || maxPrice) {
      where.pricePerNight = {};
      if (minPrice) where.pricePerNight.gte = Number(minPrice);
      if (maxPrice) where.pricePerNight.lte = Number(maxPrice);
    }
    if (type) where.type = type;
    if (rating) where.rating = { gte: Number(rating) };
    if (amenities.length > 0) {
      where.amenities = {
        hasEvery: [...new Set(amenities)], // Remove duplicates
      };
    }
    if (destination)
      where.location = { contains: destination, mode: "insensitive" };
    if (checkIn && checkOut) {
      where.bookings = {
        none: {
          OR: [{ checkIn: { lte: checkOut }, checkOut: { gte: checkIn } }],
        },
      };
    }

    const orderBy: any = {};
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

    // Get total count for pagination
    const totalHomestays = await prisma.homestay.count({ where });

    // Calculate skip based on page number
    const skip = (page - 1) * limit;
    const homestays = await prisma.homestay.findMany({
      where,
      orderBy,
      take: limit,
      skip,
    });

    const totalPages = Math.ceil(totalHomestays / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      homestays,
      totalPages,
      currentPage: page,
      hasNextPage,
      hasPrevPage,
    });
  } catch (error) {
    console.error("[GET /homestays]", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
