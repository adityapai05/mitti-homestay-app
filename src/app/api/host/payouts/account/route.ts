import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "HOST") {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const account = await prisma.hostPayoutAccount.findUnique({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    console.error("[GET /api/host/payouts/account]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "HOST") {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (!body.method || !body.accountHolderName) {
      return NextResponse.json(
        { error: "Invalid payout details." },
        { status: 400 }
      );
    }

    const account = await prisma.hostPayoutAccount.upsert({
      where: {
        userId: user.id,
      },
      update: {
        method: body.method,
        accountHolderName: body.accountHolderName,
        upiId: body.upiId ?? null,
        bankName: body.bankName ?? null,
        accountNo: body.accountNo ?? null,
        ifsc: body.ifsc ?? null,
      },
      create: {
        userId: user.id,
        method: body.method,
        accountHolderName: body.accountHolderName,
        upiId: body.upiId ?? null,
        bankName: body.bankName ?? null,
        accountNo: body.accountNo ?? null,
        ifsc: body.ifsc ?? null,
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    console.error("[POST /api/host/payouts/account]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
