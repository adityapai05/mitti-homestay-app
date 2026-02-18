import { NextResponse } from "next/server";
import { getHostPayoutSummary } from "@/lib/server/host/getHostPayoutSummary";

export async function GET() {
  try {
    const summary = await getHostPayoutSummary();
    if (!summary) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }
    return NextResponse.json(summary);
  } catch (error) {
    console.error("[GET /api/host/payouts/summary]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
