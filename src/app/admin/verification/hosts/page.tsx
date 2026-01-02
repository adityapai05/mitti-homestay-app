import { prisma } from "@/lib/prisma";
import HostVerificationClient from "./_components/HostVerificationClient";

export default async function HostVerificationPage() {
  const hosts = await prisma.hostProfile.findMany({
    where: { verificationStatus: "PENDING" },
    include: {
      user: {
        include: {
          homestays: true,
          payoutAccount: true,
        },
      },
    },
    orderBy: { user: { createdAt: "desc" } },
  });

  return (
    <div className="h-full flex flex-col py-8 px-24">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-mitti-dark-brown">
          Host Verification
        </h1>
        <p className="mt-1 text-sm text-mitti-dark-brown/70">
          Review and verify hosts before they list homestays
        </p>
      </div>

      <HostVerificationClient hosts={hosts} />
    </div>
  );
}
