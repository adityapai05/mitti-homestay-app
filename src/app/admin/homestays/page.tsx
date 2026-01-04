import { prisma } from "@/lib/prisma";
import ListingsClient from "./_components/ListingsClient";
import type { AdminListing } from "./_components/ListingReviewModal";

type SearchParams = {
  search?: string;
  status?: string;
};

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const listings = await prisma.homestay.findMany({
    include: {
      owner: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  /* ---------- Prisma -> Admin DTO ---------- */
  const adminListings: AdminListing[] = listings.map((l) => ({
    id: l.id,
    name: l.name,

    description: l.description,
    amenities: l.amenities,

    village: l.village,
    district: l.district,
    state: l.state,

    latitude: l.latitude,
    longitude: l.longitude,

    pricePerNight: l.pricePerNight.toString(),
    maxGuests: l.maxGuests,
    type: l.type,

    imageUrl: l.imageUrl,

    isVerified: l.isVerified,
    rejectionReason: l.rejectionReason,

    owner: {
      id: l.owner.id,
      name: l.owner.name,
    },

    createdAt: l.createdAt.toISOString(),
  }));

  return (
    <div className="h-full flex flex-col py-8 px-24">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-mitti-dark-brown">
          Listings
        </h1>
        <p className="mt-1 text-sm text-mitti-dark-brown/70">
          Review and manage homestays on the platform
        </p>
      </div>

      <ListingsClient
        listings={adminListings}
        initialSearch={params?.search ?? ""}
        initialStatus={params?.status ?? ""}
      />
    </div>
  );
}
