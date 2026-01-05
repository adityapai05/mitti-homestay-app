"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { logAdminAction } from "@/lib/admin/logAdminAction";

export async function processPayout(payoutId: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.hostPayout.update({
    where: { id: payoutId },
    data: {
      status: "PROCESSED",
      processedAt: new Date(),
    },
  });

  await logAdminAction({
    adminId: admin.id,
    action: "PAYOUT_PROCESSED",
    entity: "HOST_PAYOUT",
    entityId: payoutId,
  });
}

export async function failPayout(payoutId: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.hostPayout.update({
    where: { id: payoutId },
    data: {
      status: "FAILED",
    },
  });

  await logAdminAction({
    adminId: admin.id,
    action: "PAYOUT_FAILED",
    entity: "HOST_PAYOUT",
    entityId: payoutId,
  });
}
