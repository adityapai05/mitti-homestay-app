import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        hostProfile: true,
        homestays: {
          select: {
            rating: true,
          },
        },
        bookings: {
          where: {
            status: "COMPLETED",
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isHost = user.role === "HOST";

    let hostData:
      | {
          verificationStatus: string;
          hostingSince: number;
          homestaysCount: number;
          guestsHosted: number;
          averageRating: number | null;
        }
      | undefined;

    if (isHost) {
      const homestaysCount = user.homestays.length;

      const totalRating = user.homestays.reduce<number>(
        (sum, h) => sum + (h.rating || 0),
        0
      );

      const averageRating =
        homestaysCount > 0
          ? Number((totalRating / homestaysCount).toFixed(2))
          : null;

      hostData = {
        verificationStatus: user.hostProfile?.verificationStatus ?? "PENDING",
        hostingSince: user.createdAt.getFullYear(),
        homestaysCount,
        guestsHosted: user.bookings.length,
        averageRating,
      };
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      image: user.image,
      about: user.about,
      languages: user.languages,
      role: user.role,
      host: hostData,
    });
  } catch (error) {
    console.error("[GET /api/users/[id]]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
