import { requireRole } from "@/lib/auth/requireRole";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hostHomestayWhere } from "@/lib/visibility/homestayVisibility";

export async function GET() {
  try {
    const host = await requireRole("HOST");

    const homestays = await prisma.homestay.findMany({
      where: hostHomestayWhere({
        userId: host.id,
        role: host.role,
      }),
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        pricePerNight: true,
        isVerified: true,
        category: true,
        type: true,
        village: true,
        state: true,
        createdAt: true,
      },
    });

    const formattedHomestays = homestays.map((stay) => ({
      ...stay,
      pricePerNight: stay.pricePerNight.toString(),
    }));

    return NextResponse.json({
      homestays: formattedHomestays,
    });
  } catch (error: unknown) {
    console.error("[GET /api/host/homestays]", error);

    return NextResponse.json(
      {
        error: (error as Error).message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
