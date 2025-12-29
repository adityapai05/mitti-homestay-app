import { requireRole } from "@/lib/auth/requireRole";
import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const host = await requireRole("HOST");

  const homestay = await prisma.homestay.findUnique({
    where: { id: id },
    select: {
      id: true,
      ownerId: true,
      name: true,
      description: true,
      imageUrl: true,
      category: true,
      type: true,
      pricePerNight: true,
      maxGuests: true,
      beds: true,
      bedrooms: true,
      bathrooms: true,
      amenities: true,

      flatno: true,
      street: true,
      landmark: true,
      village: true,
      district: true,
      state: true,
      pincode: true,

      latitude: true,
      longitude: true,
      guideAvailable: true,
      guideFee: true,
      checkInTime: true,
      checkOutTime: true,
      isVerified: true,
    },
  });

  if (!homestay) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (homestay.ownerId !== host.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    ...homestay,
    pricePerNight: homestay.pricePerNight?.toString() ?? null,
    guideFee: homestay.guideFee?.toString() ?? null,
  });
}

const updateSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().min(10).optional(),

  flatno: z.string().min(1).optional(),
  street: z.string().min(1).optional(),
  landmark: z.string().optional(),
  village: z.string().min(1).optional(),
  district: z.string().optional(),
  state: z.string().min(1).optional(),
  pincode: z.string().length(6).optional(),

  latitude: z.number().optional(),
  longitude: z.number().optional(),

  pricePerNight: z.number().positive().optional(),
  beds: z.number().int().positive().optional(),
  bedrooms: z.number().int().optional(),
  bathrooms: z.number().int().optional(),
  maxGuests: z.number().int().positive().optional(),

  amenities: z.array(z.string()).optional(),

  guideAvailable: z.boolean().optional(),
  guideFee: z.number().positive().nullable().optional(),

  category: z.nativeEnum(Category).optional(),

  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
});

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const host = await requireRole("HOST");
  const body = await req.json();

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(parsed.error.flatten(), { status: 400 });
  }

  const existing = await prisma.homestay.findUnique({
    where: { id: id },
    select: { ownerId: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.ownerId !== host.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = {
    ...parsed.data,
    pricePerNight: parsed.data.pricePerNight
      ? new Decimal(parsed.data.pricePerNight)
      : undefined,
    guideFee:
      parsed.data.guideFee !== undefined
        ? parsed.data.guideFee === null
          ? null
          : new Decimal(parsed.data.guideFee)
        : undefined,
  };

  const updated = await prisma.homestay.update({
    where: { id: id },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const host = await requireRole("HOST");

  const homestay = await prisma.homestay.findUnique({
    where: { id: id },
    select: {
      ownerId: true,
      bookings: {
        where: {
          status: { in: ["CONFIRMED", "PENDING"] },
          checkIn: { gte: new Date() },
        },
        select: { id: true },
      },
    },
  });

  if (!homestay) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (homestay.ownerId !== host.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (homestay.bookings.length > 0) {
    return NextResponse.json(
      { error: "Active bookings exist" },
      { status: 400 }
    );
  }

  await prisma.homestay.delete({
    where: { id: id },
  });

  return NextResponse.json({ success: true });
}
