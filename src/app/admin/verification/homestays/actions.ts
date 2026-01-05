"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { revalidatePath } from "next/cache";
import { logAdminAction } from "@/lib/admin/logAdminAction";

export async function approveHomestay(homestayId: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.homestay.update({
    where: { id: homestayId },
    data: {
      isVerified: true,
      rejectionReason: null,
    },
  });

  await logAdminAction({
    adminId: admin.id,
    action: "HOMESTAY_APPROVED",
    entity: "HOMESTAY",
    entityId: homestayId,
  });

  revalidatePath("/admin/verification/homestays");
}

export async function rejectHomestay(homestayId: string, reason: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") throw new Error("Unauthorized");
  if (!reason.trim()) throw new Error("Rejection reason required");

  await prisma.homestay.update({
    where: { id: homestayId },
    data: {
      isVerified: false,
      rejectionReason: reason,
    },
  });

  await logAdminAction({
    adminId: admin.id,
    action: "HOMESTAY_REJECTED",
    entity: "HOMESTAY",
    entityId: homestayId,
    meta: { reason },
  });

  revalidatePath("/admin/verification/homestays");
}
