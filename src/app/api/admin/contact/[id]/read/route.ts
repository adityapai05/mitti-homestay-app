import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/requireRole";
import {
  parseParams,
  validationErrorResponse,
} from "@/lib/validation/commonSchemas";
import { routeParamSchema } from "@/lib/validation/adminSchemas";
import { z } from "zod";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("ADMIN");
    const parsedParams = parseParams(await params, routeParamSchema);
    if (!parsedParams.success) {
      return parsedParams.response;
    }

    await prisma.contactMessage.update({
      where: { id: parsedParams.data.id },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return validationErrorResponse(error);
    }

    if ((error as Error).message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.error("[PATCH /api/admin/contact/[id]/read]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
