import { Users, Home, BadgeCheck, Wallet, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import SmartLink from "@/components/shared/SmartLink";

export default async function AdminOverviewPage() {
  const [
    pendingHosts,
    pendingHomestays,
    pendingPayouts,
    totalUsers,
    totalHomestays,
    verifiedHosts,
  ] = await Promise.all([
    prisma.hostProfile.count({ where: { verificationStatus: "PENDING" } }),
    prisma.homestay.count({ where: { isVerified: false } }),
    prisma.hostPayout.aggregate({
      where: { status: "PENDING" },
      _sum: { amount: true },
    }),
    prisma.user.count(),
    prisma.homestay.count(),
    prisma.hostProfile.count({ where: { verificationStatus: "VERIFIED" } }),
  ]);

  return (
    <div className="h-full flex flex-col py-8 px-24">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-mitti-dark-brown">
          Overview
        </h1>
        <p className="mt-1 text-sm text-mitti-dark-brown/70">
          Platform health and key metrics
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard
          icon={BadgeCheck}
          label="Pending Host Verifications"
          value={pendingHosts}
          href="/admin/verification/hosts"
          context="Hosts awaiting admin approval"
        />

        <StatCard
          icon={Home}
          label="Pending Homestay Verifications"
          value={pendingHomestays}
          href="/admin/verification/homestays"
          context="Listings pending review"
        />

        <StatCard
          icon={Wallet}
          label="Pending Payout Amount"
          value={`₹ ${pendingPayouts._sum.amount ?? 0}`}
          href="/admin/payouts"
          context="To be processed via admin payouts"
        />

        <StatCard
          icon={Users}
          label="Total Users"
          value={totalUsers}
          href="/admin/users"
          context="Registered users on the platform"
        />

        <StatCard
          icon={Home}
          label="Total Homestays"
          value={totalHomestays}
          href="/admin/homestays"
          context="All listed properties"
        />

        <StatCard
          icon={UserCheck}
          label="Verified Hosts"
          value={verifiedHosts}
          href="/admin/verification/hosts"
          context="Approved and active hosts"
        />
      </div>
    </div>
  );
}

/* ---------- components ---------- */

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  context,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  href?: string;
  context?: string;
}) {
  const content = (
    <>
      {/* Top */}
      <div className="flex items-start gap-4">
        <div className="mt-1 text-mitti-olive">
          <Icon size={26} />
        </div>

        <div>
          <p className="text-lg text-mitti-dark-brown/70">{label}</p>
          <p className="mt-1 text-4xl font-semibold text-mitti-dark-brown">
            {value}
          </p>
        </div>
      </div>

      {/* Bottom context */}
      {context && <p className="mt-4 text-mitti-dark-brown/60">{context}</p>}
    </>
  );

  if (href) {
    return (
      <SmartLink
        href={href}
        className="rounded-lg border border-mitti-khaki bg-mitti-cream p-6
          flex flex-col justify-between
          hover:border-mitti-olive transition cursor-pointer"
      >
        {content}
      </SmartLink>
    );
  }

  return (
    <div
      className="rounded-lg border border-mitti-khaki bg-mitti-cream p-6
        flex flex-col justify-between"
    >
      {content}
    </div>
  );
}
