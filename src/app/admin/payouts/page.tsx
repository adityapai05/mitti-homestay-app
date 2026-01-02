import { prisma } from "@/lib/prisma";
import AdminPayoutsClient from "./_components/AdminPayoutsClient";

export default async function AdminPayoutsPage() {
  const payouts = await prisma.hostPayout.findMany({
    include: {
      user: {
        include: {
          payoutAccount: true,
          hostProfile: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="h-full flex flex-col py-8 px-24">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-mitti-dark-brown">
          Payouts
        </h1>
        <p className="mt-1 text-sm text-mitti-dark-brown/70">
          Review and process host payout requests
        </p>
      </div>

      <AdminPayoutsClient payouts={payouts} />
    </div>
  );
}
