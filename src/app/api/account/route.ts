export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAccountData } from "@/lib/server/account/getAccountData";

export async function GET() {
  try {
    const accountData = await getAccountData();

    if (!accountData) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    return NextResponse.json(accountData);
  } catch (error) {
    console.error("[GET /api/account]", error);
    return NextResponse.json(
      {
        error: (error as Error).message || "Internal Server Error",
        code: "ACCOUNT_FETCH_FAILED",
      },
      { status: 500 }
    );
  }
}
