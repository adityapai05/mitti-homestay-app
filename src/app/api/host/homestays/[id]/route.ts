import { requireRole } from "@/lib/auth/requireRole";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import { hostHomestayWhere } from "@/lib/visibility/homestayVisibility";
import {
  parseJsonBody,
  parseParams,
} from "@/lib/validation/commonSchemas";
import {
  routeParamSchema as homestayRouteParamSchema,
  updateSchema as homestayUpdateSchema,
} from "@/lib/validation/homestaySchemas";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const parsedParams = parseParams(await context.params, homestayRouteParamSchema);
    if (!parsedParams.success) {
      return parsedParams.response;
    }

    const host = await requireRole("HOST");

    const homestay = await prisma.homestay.findFirst({
      where: {
        id: parsedParams.data.id,
        ...hostHomestayWhere({ userId: host.id }),
      },
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
        cancellationPolicy: true,
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

    return NextResponse.json({
      ...homestay,
      pricePerNight: homestay.pricePerNight?.toString() ?? null,
      guideFee: homestay.guideFee?.toString() ?? null,
    });
  } catch (error) {
    if ((error as Error).message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.error("[GET /api/host/homestays/[id]]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const parsedParams = parseParams(await context.params, homestayRouteParamSchema);
    if (!parsedParams.success) {
      return parsedParams.response;
    }

    const host = await requireRole("HOST");

    const parsedBody = await parseJsonBody(req, homestayUpdateSchema);
    if (!parsedBody.success) {
      return parsedBody.response;
    }

    const existing = await prisma.homestay.findFirst({
      where: {
        id: parsedParams.data.id,
        ...hostHomestayWhere({ userId: host.id }),
      },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data = {
      ...parsedBody.data,
      pricePerNight:
        parsedBody.data.pricePerNight !== undefined
          ? new Decimal(parsedBody.data.pricePerNight)
          : undefined,
      guideFee:
        parsedBody.data.guideFee !== undefined
          ? parsedBody.data.guideFee === null
            ? null
            : new Decimal(parsedBody.data.guideFee)
          : undefined,
    };

    const updated = await prisma.homestay.update({
      where: { id: parsedParams.data.id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    if ((error as Error).message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.error("[PUT /api/host/homestays/[id]]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const parsedParams = parseParams(await context.params, homestayRouteParamSchema);
    if (!parsedParams.success) {
      return parsedParams.response;
    }

    const host = await requireRole("HOST");

    const homestay = await prisma.homestay.findFirst({
      where: {
        id: parsedParams.data.id,
        ...hostHomestayWhere({ userId: host.id }),
      },
      select: {
        id: true,
        bookings: {
          where: {
            status: {
              in: ["PENDING_HOST_APPROVAL", "AWAITING_PAYMENT", "CONFIRMED"],
            },
            checkIn: { gte: new Date() },
          },
          select: { id: true },
        },
      },
    });

    if (!homestay) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (homestay.bookings.length > 0) {
      return NextResponse.json(
        { error: "Active or upcoming bookings exist" },
        { status: 400 },
      );
    }

    await prisma.homestay.delete({
      where: { id: parsedParams.data.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as Error).message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.error("[DELETE /api/host/homestays/[id]]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}