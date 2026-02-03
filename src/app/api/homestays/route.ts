import { prisma } from "@/lib/prisma";
import { Category, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { publicHomestayWhere } from "@/lib/visibility/homestayVisibility";

const PAGE_SIZE = 8;
const MAX_PAGE_SIZE = 20;

const SORT_MAP: Record<string, Prisma.HomestayOrderByWithRelationInput> = {
  "createdAt-desc": { createdAt: "desc" },
  "price-asc": { pricePerNight: "asc" },
  "price-desc": { pricePerNight: "desc" },
  "rating-desc": { rating: "desc" },
};

type NumberParamOptions = {
  min?: number;
  max?: number;
  integer?: boolean;
};

function getNumberParam(
  params: URLSearchParams,
  key: string,
  options: NumberParamOptions = {},
): { value?: number; error?: string } {
  const raw = params.get(key);
  if (raw === null) return {};
  const num = Number(raw);
  if (!Number.isFinite(num)) {
    return { error: `Invalid ${key}` };
  }
  if (options.integer && !Number.isInteger(num)) {
    return { error: `Invalid ${key}` };
  }
  if (options.min !== undefined && num < options.min) {
    return { error: `Invalid ${key}` };
  }
  if (options.max !== undefined && num > options.max) {
    return { error: `Invalid ${key}` };
  }
  return { value: num };
}

function getBooleanParam(
  params: URLSearchParams,
  key: string,
): { value?: boolean; error?: string } {
  const raw = params.get(key);
  if (raw === null) return {};
  if (raw === "true") return { value: true };
  if (raw === "false") return { value: false };
  return { error: `Invalid ${key}` };
}

function getArrayParam(params: URLSearchParams, key: string): string[] {
  const raw = params.get(key);
  if (!raw) return [];
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const params = url.searchParams;

    const pageResult = getNumberParam(params, "page", {
      min: 1,
      integer: true,
    });
    if (pageResult.error) {
      return NextResponse.json({ error: pageResult.error }, { status: 400 });
    }
    const page = pageResult.value ?? 1;
    const limit = PAGE_SIZE;

    const destination = params.get("destination")?.trim() || undefined;
    if (params.getAll("category").length > 1) {
      return NextResponse.json(
        { error: "Invalid category format" },
        { status: 400 },
      );
    }
    if (params.getAll("amenities").length > 1) {
      return NextResponse.json(
        { error: "Invalid amenities format" },
        { status: 400 },
      );
    }

    const categories = getArrayParam(params, "category");

    const type = params.get("type");
    const sort = params.get("sort") || "createdAt-desc";

    if (params.get("sort") && !SORT_MAP[sort]) {
      return NextResponse.json({ error: "Invalid sort" }, { status: 400 });
    }

    const minPriceResult = getNumberParam(params, "minPrice", { min: 0 });
    const maxPriceResult = getNumberParam(params, "maxPrice", { min: 0 });
    if (minPriceResult.error || maxPriceResult.error) {
      return NextResponse.json(
        { error: minPriceResult.error || maxPriceResult.error },
        { status: 400 },
      );
    }

    const minGuestsResult = getNumberParam(params, "minGuests", {
      min: 1,
      integer: true,
    });
    const minBedroomsResult = getNumberParam(params, "minBedrooms", {
      min: 1,
      integer: true,
    });
    const minBathroomsResult = getNumberParam(params, "minBathrooms", {
      min: 1,
      integer: true,
    });
    if (
      minGuestsResult.error ||
      minBedroomsResult.error ||
      minBathroomsResult.error
    ) {
      return NextResponse.json(
        {
          error:
            minGuestsResult.error ||
            minBedroomsResult.error ||
            minBathroomsResult.error,
        },
        { status: 400 },
      );
    }

    const guideAvailableResult = getBooleanParam(params, "guideAvailable");
    const freeCancellationResult = getBooleanParam(params, "freeCancellation");
    if (guideAvailableResult.error || freeCancellationResult.error) {
      return NextResponse.json(
        { error: guideAvailableResult.error || freeCancellationResult.error },
        { status: 400 },
      );
    }

    const ratingResult = getNumberParam(params, "rating", { min: 0, max: 5 });
    if (ratingResult.error) {
      return NextResponse.json({ error: ratingResult.error }, { status: 400 });
    }

    const amenities = getArrayParam(params, "amenities");

    const checkIn = params.get("checkIn");
    const checkOut = params.get("checkOut");

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
    if (minGuestsResult.value !== undefined) {
      where.maxGuests = { gte: minGuestsResult.value };
    }
    if (minBedroomsResult.value !== undefined) {
      where.bedrooms = { gte: minBedroomsResult.value };
    }
    if (minBathroomsResult.value !== undefined) {
      where.bathrooms = { gte: minBathroomsResult.value };
    }

    /* ---------- price ---------- */
    if (
      minPriceResult.value !== undefined ||
      maxPriceResult.value !== undefined
    ) {
      where.pricePerNight = {};
      if (minPriceResult.value !== undefined) {
        where.pricePerNight.gte = minPriceResult.value;
      }
      if (maxPriceResult.value !== undefined) {
        where.pricePerNight.lte = maxPriceResult.value;
      }
    }

    if (
      minPriceResult.value !== undefined &&
      maxPriceResult.value !== undefined &&
      minPriceResult.value > maxPriceResult.value
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
    if (guideAvailableResult.value !== undefined) {
      where.guideAvailable = guideAvailableResult.value;
    }

    /* ---------- cancellation ---------- */
    if (freeCancellationResult.value === true) {
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
    if (ratingResult.value !== undefined) {
      where.rating = { gte: ratingResult.value };
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
