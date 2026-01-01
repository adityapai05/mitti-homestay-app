import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [
    pendingHostVerifications,
    pendingHomestayVerifications,
    pendingPayouts,
    totalUsers,
    totalHomestays,
  ] = await Promise.all([
    prisma.hostProfile.count({
      where: { verificationStatus: "PENDING" },
    }),
    prisma.homestay.count({
      where: { isVerified: false },
    }),
    prisma.hostPayout.aggregate({
      where: { status: "PENDING" },
      _sum: { amount: true },
    }),
    prisma.user.count(),
    prisma.homestay.count(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-mitti-dark-brown mb-6">
        Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Pending Host Verifications"
          value={pendingHostVerifications}
        />
        <StatCard
          title="Pending Homestay Verifications"
          value={pendingHomestayVerifications}
        />
        <StatCard
          title="Pending Payout Amount"
          value={`₹ ${pendingPayouts._sum.amount ?? 0}`}
        />
        <StatCard title="Total Users" value={totalUsers} />
        <StatCard title="Total Homestays" value={totalHomestays} />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-mitti-khaki bg-mitti-cream p-4">
      <p className="text-sm text-mitti-dark-brown/70">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-mitti-dark-brown">
        {value}
      </p>
    </div>
  );
}
