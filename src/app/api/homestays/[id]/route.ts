import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { publicHomestayWhere } from "@/lib/visibility/homestayVisibility";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const homestay = await prisma.homestay.findFirst({
      where: {
        id,
        ...publicHomestayWhere(),
      },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        category: true,
        type: true,

        pricePerNight: true,
        maxGuests: true,
        bedrooms: true,
        beds: true,
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
        cancellationPolicy: true,

        guideAvailable: true,
        guideFee: true,

        isVerified: true,
        createdAt: true,

        owner: {
          select: {
            id: true,
            name: true,
            image: true,
            about: true,
            languages: true,
            isVerified: true,
            hostProfile: {
              select: {
                verificationStatus: true,
              },
            },
          },
        },

        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!homestay) {
      return NextResponse.json(
        { error: "Homestay not found" },
        { status: 404 },
      );
    }

    const dto = {
      id: homestay.id,
      name: homestay.name,
      description: homestay.description,
      images: homestay.imageUrl,

      category: homestay.category,
      type: homestay.type,

      location: {
        flatno: homestay.flatno,
        street: homestay.street,
        landmark: homestay.landmark,
        village: homestay.village,
        district: homestay.district,
        state: homestay.state,
        pincode: homestay.pincode,
        latitude: homestay.latitude,
        longitude: homestay.longitude,
      },

      capacity: {
        maxGuests: homestay.maxGuests,
        bedrooms: homestay.bedrooms,
        beds: homestay.beds,
        bathrooms: homestay.bathrooms,
      },

      pricing: {
        pricePerNight: homestay.pricePerNight.toString(),
        guideAvailable: homestay.guideAvailable,
        guideFee: homestay.guideFee ? homestay.guideFee.toString() : null,
      },

      policies: {
        checkInTime: homestay.checkInTime,
        checkOutTime: homestay.checkOutTime,
        cancellationPolicy: homestay.cancellationPolicy,
      },

      amenities: homestay.amenities,

      rating: {
        average: homestay.rating,
        reviewCount: homestay._count.reviews,
      },

      host: {
        id: homestay.owner.id,
        name: homestay.owner.name,
        image: homestay.owner.image,
        about: homestay.owner.about,
        languages: homestay.owner.languages,
        isUserVerified: homestay.owner.isVerified,
        verificationStatus:
          homestay.owner.hostProfile?.verificationStatus ?? "PENDING",
      },

      meta: {
        isVerified: homestay.isVerified,
        createdAt: homestay.createdAt.toISOString(),
      },
    };

    return NextResponse.json(dto);
  } catch (error) {
    console.error("[GET /api/homestays/[id]]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
