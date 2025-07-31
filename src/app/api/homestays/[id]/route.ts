import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    //TODO: add caching headers for revalidation
    const homestayId = params.id;

    if (!homestayId) {
      return NextResponse.json(
        { error: "Homestay ID is required." },
        { status: 400 }
      );
    }

    const homestay = await prisma.homestay.findUnique({
      where: { id: homestayId },
      include: {
        // TODO: Include reviews here in future scope
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!homestay) {
      return NextResponse.json(
        { error: "Homestay Not Found." },
        { status: 404 }
      );
    }

    return NextResponse.json(homestay);
  } catch (error) {
    console.error("[HOMESTAY_GET_BY_ID]", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
