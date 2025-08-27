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
    const cursor = searchParams.get("cursor");
    const limit = Number(searchParams.get("limit") || 20);
    const isVerified = searchParams.get("isVerified");
    const guideAvailable = searchParams.get("guideAvailable");

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
    if (rating) where.rating = Number(rating);
    if (amenities.length > 0) {
      where.amenities = {
        hasEvery: amenities,
      };
    }
    const homestays = await prisma.homestay.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
    });

    const hasNextPage = homestays.length > limit;
    const paginatedHomestays = hasNextPage
      ? homestays.slice(0, limit)
      : homestays;
    const nextCursor = hasNextPage ? paginatedHomestays[limit - 1] : null;

    return NextResponse.json({
      homestays: paginatedHomestays,
      nextCursor,
      hasNextPage,
    });
  } catch (error) {
    console.error("[GET /homestays]", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}