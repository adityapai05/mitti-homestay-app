"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { logAdminAction } from "@/lib/admin/logAdminAction";
import { routeParamSchema } from "@/lib/validation/adminSchemas";

export async function processPayout(payoutId: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") throw new Error("Unauthorized");

  const parsedId = routeParamSchema.safeParse({ id: payoutId });
  if (!parsedId.success) throw new Error("Invalid payout id");

  await prisma.hostPayout.update({
    where: { id: parsedId.data.id },
    data: {
      status: "PROCESSED",
      processedAt: new Date(),
    },
  });

  await logAdminAction({
    adminId: admin.id,
    action: "PAYOUT_PROCESSED",
    entity: "HOST_PAYOUT",
    entityId: parsedId.data.id,
  });
}

export async function failPayout(payoutId: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") throw new Error("Unauthorized");

  const parsedId = routeParamSchema.safeParse({ id: payoutId });
  if (!parsedId.success) throw new Error("Invalid payout id");

  await prisma.hostPayout.update({
    where: { id: parsedId.data.id },
    data: {
      status: "FAILED",
    },
  });

  await logAdminAction({
    adminId: admin.id,
    action: "PAYOUT_FAILED",
    entity: "HOST_PAYOUT",
    entityId: parsedId.data.id,
  });
}