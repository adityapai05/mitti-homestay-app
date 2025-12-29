import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const homestay = await prisma.homestay.findUnique({
      where: { id: id },
      select: {
        id: true,
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
        rating: true,
        latitude: true,
        longitude: true,

        flatno: true,
        street: true,
        landmark: true,
        village: true,
        district: true,
        state: true,
        pincode: true,

        checkInTime: true,
        checkOutTime: true,
        isVerified: true,

        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!homestay) {
      return NextResponse.json(
        { error: "Homestay not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...homestay,
      pricePerNight: homestay.pricePerNight.toString(),
    });
  } catch (error) {
    console.error("[GET /api/homestays/[id]]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
