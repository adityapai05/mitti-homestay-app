import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { HOST_COMMISSION_RATE } from "@/lib/payouts/constants";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "HOST") {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    // 1. Total earned (completed bookings + successful payments)
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

    const totalEarnedRaw = payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0
    );

    const totalEarned = totalEarnedRaw * (1 - HOST_COMMISSION_RATE);

    // 2. Total paid out
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

    // 3. Pending payouts
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

    // 4. Available to withdraw
    const availableToWithdraw = Math.max(
      0,
      totalEarned - totalPaidOut - pendingPayouts
    );

    // 5. Last processed payout
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

    return NextResponse.json({
      totalEarned,
      totalPaidOut,
      pendingPayouts,
      availableToWithdraw,
      lastPayout,
    });
  } catch (error) {
    console.error("[GET /api/host/payouts/summary]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
