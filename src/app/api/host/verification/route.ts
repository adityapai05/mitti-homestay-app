import { NextResponse } from "next/server";
import { getHostVerificationStatus } from "@/lib/server/host/getHostVerificationStatus";

export async function GET() {
  try {
    const verificationStatus = await getHostVerificationStatus();
    if (!verificationStatus) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    return NextResponse.json({ verificationStatus });
  } catch (error) {
    console.error("[GET /api/host/verification]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
