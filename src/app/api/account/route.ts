export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      email: user.email,
      emailVerified: user.isVerified,
      phone: user.phone,
      isActive: user.isActive,
    });
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
