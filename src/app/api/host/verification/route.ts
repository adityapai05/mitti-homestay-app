import { NextResponse } from "next/server";
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

    const hostProfile = await prisma.hostProfile.findUnique({
      where: { userId: user.id },
      select: { verificationStatus: true },
    });

    return NextResponse.json({
      verificationStatus: hostProfile?.verificationStatus ?? "PENDING",
    });
  } catch (error) {
    console.error("[GET /api/host/verification]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
