"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { revalidatePath } from "next/cache";
import { logAdminAction } from "@/lib/admin/logAdminAction";

export async function processRefund(bookingId: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
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
    where: { id: bookingId },
    data: {
      refundStatus: "PROCESSED",
      refundProcessedAt: new Date(),
    },
  });

  await logAdminAction({
    adminId: admin.id,
    action: "REFUND_PROCESSED",
    entity: "BOOKING",
    entityId: bookingId,
    meta: {
      refundAmount: booking.refundAmount,
    },
  });

  revalidatePath("/admin/refunds");
}
