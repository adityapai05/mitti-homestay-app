import { prisma } from "@/lib/prisma";
import HomestayVerificationClient from "./_components/HomestayVerificationClient";

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

      <HomestayVerificationClient homestays={homestays} />
    </div>
  );
}
