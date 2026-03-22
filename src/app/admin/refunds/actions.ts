"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { revalidatePath } from "next/cache";
import { logAdminAction } from "@/lib/admin/logAdminAction";
import { routeParamSchema } from "@/lib/validation/adminSchemas";

export async function processRefund(bookingId: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const parsedId = routeParamSchema.safeParse({ id: bookingId });
  if (!parsedId.success) throw new Error("Invalid booking id");

  const booking = await prisma.booking.findUnique({
    where: { id: parsedId.data.id },
    select: {
      refundStatus: true,
      refundAmount: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.refundStatus !== "PENDING") {
    throw new Error("Refund already processed or invalid state");
  }

  await prisma.booking.update({
    where: { id: parsedId.data.id },
    data: {
      refundStatus: "PROCESSED",
      refundProcessedAt: new Date(),
    },
  });

  await logAdminAction({
    adminId: admin.id,
    action: "REFUND_PROCESSED",
    entity: "BOOKING",
    entityId: parsedId.data.id,
    meta: {
      refundAmount: booking.refundAmount,
    },
  });

  revalidatePath("/admin/refunds");
}