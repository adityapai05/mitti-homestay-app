import { prisma } from "@/lib/prisma";
import HomestayVerificationClient from "./_components/HomestayVerificationClient";
import type { AdminHomestayRow } from "./_components/HomestayVerificationTable";

export default async function HomestayVerificationPage() {
  const homestays = await prisma.homestay.findMany({
    where: { isVerified: false },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          isVerified: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  /* ---------- Prisma → Admin DTO ---------- */
  const adminHomestays: AdminHomestayRow[] = homestays.map((h) => ({
    id: h.id,
    name: h.name,

    village: h.village,
    district: h.district,
    state: h.state,

    pricePerNight: h.pricePerNight.toString(),

    isVerified: h.isVerified,
    rejectionReason: h.rejectionReason,

    owner: {
      id: h.owner.id,
      name: h.owner.name,
      email: h.owner.email,
      isVerified: h.owner.isVerified,
    },

    createdAt: h.createdAt.toISOString(),
  }));

  return (
    <div className="h-full flex flex-col py-8 px-24">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-mitti-dark-brown">
          Homestay Verification
        </h1>
        <p className="mt-1 text-sm text-mitti-dark-brown/70">
          Review and approve homestays before they appear on Explore
        </p>
      </div>

      <HomestayVerificationClient homestays={adminHomestays} />
    </div>
  );
}
