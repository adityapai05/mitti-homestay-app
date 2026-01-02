"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export async function disableUser(userId: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") throw new Error("Unauthorized");

  // Prevent admin self-disable
  if (admin.id === userId) {
    throw new Error("You cannot disable your own account");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });
}

export async function enableUser(userId: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: true },
  });
}
