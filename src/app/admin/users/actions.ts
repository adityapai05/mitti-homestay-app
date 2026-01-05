"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { logAdminAction } from "@/lib/admin/logAdminAction";

export async function disableUser(userId: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") throw new Error("Unauthorized");
  if (admin.id === userId) throw new Error("You cannot disable yourself");

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });

  await logAdminAction({
    adminId: admin.id,
    action: "USER_DISABLED",
    entity: "USER",
    entityId: userId,
  });
}

export async function enableUser(userId: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: true },
  });

  await logAdminAction({
    adminId: admin.id,
    action: "USER_ENABLED",
    entity: "USER",
    entityId: userId,
  });
}
