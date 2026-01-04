import { prisma } from "@/lib/prisma";
import AdminPayoutsClient from "./_components/AdminPayoutsClient";
import type { AdminPayout } from "./_components/PayoutReviewModal";

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

  /* ---------- Prisma → Admin DTO ---------- */
  const adminPayouts: AdminPayout[] = payouts.map((p) => ({
    id: p.id,
    amount: p.amount.toString(),
    status: p.status,
    createdAt: p.createdAt.toISOString(),

    user: {
      id: p.user.id,
      name: p.user.name,
      email: p.user.email,
      phone: p.user.phone,

      hostProfile: p.user.hostProfile
        ? {
            verificationStatus: p.user.hostProfile.verificationStatus,
          }
        : null,

      payoutAccount: p.user.payoutAccount
        ? {
            method: p.user.payoutAccount.method,
            accountHolderName: p.user.payoutAccount.accountHolderName,
            upiId: p.user.payoutAccount.upiId,
            bankName: p.user.payoutAccount.bankName,
            accountNo: p.user.payoutAccount.accountNo,
            ifsc: p.user.payoutAccount.ifsc,
          }
        : null,
    },
  }));

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

      <AdminPayoutsClient payouts={adminPayouts} />
    </div>
  );
}
