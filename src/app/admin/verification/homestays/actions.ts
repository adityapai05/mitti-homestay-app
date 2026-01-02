"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { revalidatePath } from "next/cache";

export async function approveHomestay(homestayId: string) {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.$transaction([
    prisma.homestay.update({
      where: { id: homestayId },
      data: {
        isVerified: true,
        rejectionReason: null,
      },
    }),

    prisma.adminActionLog.create({
      data: {
        adminId: admin.id,
        action: "APPROVE_HOMESTAY",
        entity: "HOMESTAY",
        entityId: homestayId,
      },
    }),
  ]);

  revalidatePath("/admin/verification/homestays");
}

export async function rejectHomestay(homestayId: string, reason: string) {
  if (!reason.trim()) {
    throw new Error("Rejection reason required");
  }

  const admin = await getCurrentUser();

  if (!admin || admin.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.$transaction([
    prisma.homestay.update({
      where: { id: homestayId },
      data: {
        isVerified: false,
        rejectionReason: reason,
      },
    }),

    prisma.adminActionLog.create({
      data: {
        adminId: admin.id,
        action: "REJECT_HOMESTAY",
        entity: "HOMESTAY",
        entityId: homestayId,
        meta: { reason },
      },
    }),
  ]);

  revalidatePath("/admin/verification/homestays");
}
