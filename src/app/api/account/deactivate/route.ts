export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isActive: false,
      },
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set("__session", "", {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("[POST /api/account/deactivate]", error);
    return NextResponse.json(
      {
        error: (error as Error).message || "Internal Server Error",
        code: "DEACTIVATE_FAILED",
      },
      { status: 500 }
    );
  }
}
