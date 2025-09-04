import { requireRole } from "@/lib/auth/requireRole";
import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    //TODO: add caching headers for revalidation
    const { id: homestayId } = await context.params;

    if (!homestayId) {
      return NextResponse.json(
        { error: "Homestay ID is required." },
        { status: 400 }
      );
    }

    const homestay = await prisma.homestay.findUnique({
      where: { id: homestayId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        reviews: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!homestay) {
      return NextResponse.json(
        { error: "Homestay Not Found." },
        { status: 404 }
      );
    }

    const reviewCount = homestay.reviews.length;

    const response = {
      id: homestay.id,
      ownerId: homestay.ownerId,
      name: homestay.name,
      description: homestay.description,
      address: homestay.address,
      latitude: homestay.latitude,
      longitude: homestay.longitude,
      pricePerNight: homestay.pricePerNight.toString(),
      beds: homestay.beds,
      type: homestay.type,
      maxGuests: homestay.maxGuests,
      imageUrl: homestay.imageUrl,
      amenities: homestay.amenities,
      rating: homestay.rating,
      reviewCount,
      guideAvailable: homestay.guideAvailable,
      guideFee: homestay.guideFee ? homestay.guideFee.toString() : null,
      checkInTime: homestay.checkInTime,
      checkOutTime: homestay.checkOutTime,
      category: homestay.category,
      isVerified: homestay.isVerified,
      createdAt: homestay.createdAt.toISOString(),
      updatedAt: homestay.updatedAt.toISOString(),
      owner: {
        id: homestay.owner.id,
        name: homestay.owner.name,
        image: homestay.owner.image,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[GET homestays/[id]]", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

const updateHomestaySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  address: z.string().min(1, "Address is required").optional(),
  latitude: z
    .number()
    .refine((val) => val >= -90 && val <= 90, {
      message: "Latitude must be between -90 and 90",
    })
    .optional(),
  longitude: z
    .number()
    .refine((val) => val >= -180 && val <= 180, {
      message: "Longitude must be between -180 and 180",
    })
    .optional(),
  pricePerNight: z.number().positive("Price must be positive").optional(),
  beds: z.number().int().positive("Beds must be a positive integer").optional(),
  maxGuests: z
    .number()
    .int()
    .positive("Max guests must be a positive integer")
    .optional(),
  imageUrl: z.array(z.url("Each image URL must be valid")).optional(),
  amenities: z.array(z.string()).optional(),
  guideAvailable: z.boolean().optional(),
  guideFee: z
    .number()
    .positive("Guide fee must be a positive number")
    .optional()
    .nullable(),
  category: z
    .enum([
      "FARM_STAY",
      "ECO_LODGE",
      "TRADITIONAL_HOME",
      "MOUNTAIN_RETREAT",
      "LAKESIDE",
      "OTHER",
    ])
    .optional(),
  checkInTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format (HH:MM)")
    .optional(),
  checkOutTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format (HH:MM)")
    .optional(),
});

type UpdateHomestayData = Partial<{
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  pricePerNight: Decimal;
  beds: number;
  maxGuests: number;
  imageUrl: string[];
  amenities: string[];
  guideAvailable: boolean;
  guideFee: Decimal | null;
  category: Category;
  checkInTime: string;
  checkOutTime: string;
}>;

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const host = await requireRole("HOST");
    const { id: homestayId } = await context.params;

    if (!homestayId) {
      return NextResponse.json(
        { error: "Homestay ID is required." },
        { status: 400 }
      );
    }

    const existingHomestay = await prisma.homestay.findUnique({
      where: { id: homestayId },
      select: { id: true, ownerId: true },
    });

    if (!existingHomestay) {
      return NextResponse.json(
        { error: "Homestay not found." },
        { status: 404 }
      );
    }

    if (existingHomestay.ownerId !== host.id) {
      return NextResponse.json(
        { error: "You can only update your own homestays" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = updateHomestaySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: z.treeifyError(parsed.error) },
        { status: 400 }
      );
    }
    const updateData: UpdateHomestayData = {
      ...parsed.data,
      pricePerNight: parsed.data.pricePerNight
        ? new Decimal(parsed.data.pricePerNight)
        : undefined,
      guideFee:
        parsed.data.guideFee !== undefined
          ? parsed.data.guideFee
            ? new Decimal(parsed.data.guideFee)
            : null
          : undefined,
    };
    if (parsed.data.pricePerNight) {
      updateData.pricePerNight = new Decimal(parsed.data.pricePerNight);
    }
    if (parsed.data.guideFee !== undefined) {
      updateData.guideFee = parsed.data.guideFee
        ? new Decimal(parsed.data.guideFee)
        : null;
    }

    const updatedHomestay = await prisma.homestay.update({
      where: { id: homestayId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(updatedHomestay);
  } catch (error: unknown) {
    console.error("[PUT /homestay/[id]", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const host = await requireRole("HOST");
    const { id: homestayId } = await context.params;

    if (!homestayId) {
      return NextResponse.json(
        { error: "Homestay ID is required." },
        { status: 400 }
      );
    }

    const existingHomestay = await prisma.homestay.findUnique({
      where: { id: homestayId },
      select: {
        id: true,
        ownerId: true,
        name: true,
        bookings: {
          where: {
            status: {
              in: ["CONFIRMED", "PENDING"],
            },
            checkIn: {
              gte: new Date(),
            },
          },
          select: { id: true },
        },
      },
    });

    if (!existingHomestay) {
      return NextResponse.json(
        { error: "Homestay not found." },
        { status: 404 }
      );
    }

    if (existingHomestay.ownerId !== host.id) {
      return NextResponse.json(
        { error: "You can only delete your own homestays." },
        { status: 403 }
      );
    }

    if (existingHomestay.bookings.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete homestay with active or upcoming bookings. Please wait for bookings to complete or contact support.",
        },
        { status: 400 }
      );
    }

    await prisma.homestay.delete({
      where: { id: homestayId },
    });

    return NextResponse.json(
      {
        message: "Homestay deleted successfully.",
        deletedHomestayId: homestayId,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[DELETE] /homestays[id", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
