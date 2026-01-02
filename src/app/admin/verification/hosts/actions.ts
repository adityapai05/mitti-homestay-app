"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { revalidatePath } from "next/cache";

export async function approveHost(userId: string) {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.$transaction([
    prisma.hostProfile.update({
      where: { userId },
      data: {
        verificationStatus: "VERIFIED",
        rejectionReason: null,
      },
    }),
    prisma.adminActionLog.create({
      data: {
        adminId: admin.id,
        action: "HOST_APPROVED",
        entity: "HOST",
        entityId: userId,
      },
    }),
  ]);

  revalidatePath("/admin/verification/hosts");
}

export async function rejectHost(userId: string, reason: string) {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (!reason.trim()) {
    throw new Error("Rejection reason required");
  }

  await prisma.$transaction([
    prisma.hostProfile.update({
      where: { userId },
      data: {
        verificationStatus: "REJECTED",
        rejectionReason: reason,
      },
    }),
    prisma.adminActionLog.create({
      data: {
        adminId: admin.id,
        action: "HOST_REJECTED",
        entity: "HOST",
        entityId: userId,
        meta: { reason },
      },
    }),
  ]);

  revalidatePath("/admin/verification/hosts");
}
