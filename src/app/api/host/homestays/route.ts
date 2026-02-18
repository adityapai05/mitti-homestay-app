import { getHostHomestays } from "@/lib/server/host/getHostHomestays";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const formattedHomestays = await getHostHomestays();

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
