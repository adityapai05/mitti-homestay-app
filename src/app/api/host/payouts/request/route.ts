import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { HOST_COMMISSION_RATE } from "@/lib/payouts/constants";

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "HOST") {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    // Recalculate total earned
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

    const payoutAgg = await prisma.hostPayout.aggregate({
      where: {
        userId: user.id,
        status: {
          in: ["PENDING", "PROCESSED"],
        },
      },
      _sum: {
        amount: true,
      },
    });

    const alreadyRequested = Number(payoutAgg._sum.amount ?? 0);
    const available = totalEarned - alreadyRequested;

    if (available <= 0) {
      return NextResponse.json(
        { error: "No funds available for payout." },
        { status: 400 }
      );
    }

    await prisma.hostPayout.create({
      data: {
        userId: user.id,
        amount: available,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/host/payouts/request]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
