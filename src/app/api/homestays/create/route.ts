import { requireRole } from "@/lib/auth/requireRole";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const homestaySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(1, "Address is required"),
  latitude: z.number().refine((val) => val >= -90 && val <= 90, {
    message: "Latitude must be between -90 and 90",
  }),
  longitude: z.number().refine((val) => val >= -180 && val <= 180, {
    message: "Longitude must be between -180 and 180",
  }),
  pricePerNight: z.number().positive("Price must be positive"),
  beds: z.number().int().positive("Beds must be a positive integer"),
  maxGuests: z.number().int().positive("Max guests must be a positive integer"),
  imageUrl: z.url("Image URL must be valid"),
  amenities: z.array(z.string()).optional(),
  guideAvailable: z.boolean().optional().default(false),
  guideFee: z
    .number()
    .positive("Guide fee must be a positive number")
    .optional(),
  category: z.enum([
    "FARM_STAY",
    "ECO_LODGE",
    "TRADITIONAL_HOME",
    "MOUNTAIN_RETREAT",
    "LAKESIDE",
    "OTHER",
  ]),
  checkInTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format (HH:MM)")
    .optional()
    .default("14:00"),
  checkOutTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format (HH:MM)")
    .optional()
    .default("11:00"),
});


export async function POST(req: NextRequest) {
  try {
    const host = await requireRole("HOST");

    const body = await req.json();

    const parsed = homestaySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: z.treeifyError(parsed.error) },
        { status: 400 }
      );
    }

    const newHomestay = await prisma.homestay.create({
      data: {
        ...parsed.data,
        pricePerNight: new Decimal(parsed.data.pricePerNight),
        guideFee: parsed.data.guideFee
          ? new Decimal(parsed.data.guideFee)
          : undefined,
        ownerId: host.id,
      },
    });

    return NextResponse.json(newHomestay, { status: 201 });
  } catch (error: unknown) {
    console.error("[POST /homestays/create]", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
