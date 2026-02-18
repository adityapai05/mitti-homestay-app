import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { HOST_COMMISSION_RATE } from "@/lib/payouts/constants";
import { prisma } from "@/lib/prisma";

export interface HostPayoutSummaryData {
  totalEarned: number;
  totalPaidOut: number;
  pendingPayouts: number;
  availableToWithdraw: number;
  lastPayout?: {
    amount: number;
    processedAt: string;
  };
}

export async function getHostPayoutSummary(): Promise<HostPayoutSummaryData | null> {
  const user = await getCurrentUser();

  if (!user || user.role !== "HOST") {
    return null;
  }

  const payments = await prisma.payment.findMany({
    where: {
      status: "SUCCESS",
      booking: {
        status: "COMPLETED",
        homestay: {
          ownerId: user.id,
        },
      },
    },
    select: {
      amount: true,
    },
  });

  const totalEarnedRaw = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalEarned = totalEarnedRaw * (1 - HOST_COMMISSION_RATE);

  const paidOutAgg = await prisma.hostPayout.aggregate({
    where: {
      userId: user.id,
      status: "PROCESSED",
    },
    _sum: {
      amount: true,
    },
  });

  const totalPaidOut = Number(paidOutAgg._sum.amount ?? 0);

  const pendingAgg = await prisma.hostPayout.aggregate({
    where: {
      userId: user.id,
      status: "PENDING",
    },
    _sum: {
      amount: true,
    },
  });

  const pendingPayouts = Number(pendingAgg._sum.amount ?? 0);
  const availableToWithdraw = Math.max(0, totalEarned - totalPaidOut - pendingPayouts);

  const lastPayout = await prisma.hostPayout.findFirst({
    where: {
      userId: user.id,
      status: "PROCESSED",
    },
    orderBy: {
      processedAt: "desc",
    },
    select: {
      amount: true,
      processedAt: true,
    },
  });

  return {
    totalEarned,
    totalPaidOut,
    pendingPayouts,
    availableToWithdraw,
    lastPayout: lastPayout
      ? {
          amount: Number(lastPayout.amount),
          processedAt: (lastPayout.processedAt ?? new Date()).toISOString(),
        }
      : undefined,
  };
}
