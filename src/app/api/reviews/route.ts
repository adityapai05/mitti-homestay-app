import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const testimonials = await prisma.review.findMany({
      where: {
        rating: { gte: 4 },
        comment: { not: null },
        homestay: { isVerified: true },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        homestay: {
          select: {
            name: true,
            village: true,
            state: true,
          },
        },
      },
    });

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error("[GET /api/reviews]", error);
    return NextResponse.json(
      { error: "Failed to load testimonials" },
      { status: 500 },
    );
  }
}
