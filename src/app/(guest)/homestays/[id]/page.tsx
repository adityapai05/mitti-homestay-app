import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { publicHomestayWhere } from "@/lib/visibility/homestayVisibility";

import { HomestayDetailsDTO } from "./types";

import Gallery from "./_components/gallery/Gallery";
import Overview from "./_components/overview/Overview";
import Description from "./_components/description/Description";
import Amenities from "./_components/amenities/Amenities";
import HostOverview from "./_components/host/HostOverview";
import LocationOverview from "./_components/location/LocationOverview";

async function getHomestay(id: string): Promise<HomestayDetailsDTO> {
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
          createdAt: true,
          hostProfile: {
            select: {
              verificationStatus: true,
            },
          },
          homestays: {
            select: {
              rating: true,
              _count: {
                select: { reviews: true },
              },
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
    notFound();
  }

  const hostHomestays = homestay.owner.homestays;

  const reviewCount = hostHomestays.reduce(
    (sum, h) => sum + h._count.reviews,
    0,
  );

  const ratings = hostHomestays
    .map((h) => h.rating)
    .filter((r): r is number => r !== null);

  const averageRating =
    ratings.length > 0
      ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2))
      : null;

  const hostingSince = homestay.owner.createdAt.getFullYear();

  return {
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

      stats: {
        hostingSince,
        reviewCount,
        averageRating,
      },
    },

    meta: {
      isVerified: homestay.isVerified,
      createdAt: homestay.createdAt.toISOString(),
    },
  };
}

export default async function HomestayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const homestay = await getHomestay(id);

  return (
    <div className="space-y-10 pb-20">
      <Gallery images={homestay.images} name={homestay.name} />

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-12">
        {/* Left content */}
        <div className="space-y-8">
          <Overview homestay={homestay} />
          <Description homestay={homestay} />
          <Amenities homestay={homestay} />
          <HostOverview homestay={homestay} />
          <LocationOverview homestay={homestay} />
        </div>

        {/* Right booking column */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            {/* BookingCard will live here */}
          </div>
        </aside>
      </div>
    </div>
  );
}
