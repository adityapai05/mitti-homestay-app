import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.contactMessage.update({
    where: { id },
    data: { isRead: true },
  });

  return NextResponse.json({ success: true });
}
