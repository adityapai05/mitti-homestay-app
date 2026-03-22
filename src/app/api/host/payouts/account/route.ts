import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getHostPayoutAccount } from "@/lib/server/host/getHostPayoutAccount";
import {
  parseJsonBody,
  validationErrorResponse,
} from "@/lib/validation/commonSchemas";
import { createSchema as payoutCreateSchema } from "@/lib/validation/payoutSchemas";
import { z } from "zod";

export async function GET() {
  try {
    const account = await getHostPayoutAccount();
    if (account === null) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    return NextResponse.json(account ?? null);
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

    const parsedBody = await parseJsonBody(req, payoutCreateSchema);
    if (!parsedBody.success) {
      return parsedBody.response;
    }
    const body = parsedBody.data;

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
    if (error instanceof z.ZodError) {
      return validationErrorResponse(error);
    }
    console.error("[POST /api/host/payouts/account]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
