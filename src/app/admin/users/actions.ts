"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { logAdminAction } from "@/lib/admin/logAdminAction";
import { routeParamSchema } from "@/lib/validation/adminSchemas";

export async function disableUser(userId: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") throw new Error("Unauthorized");

  const parsedId = routeParamSchema.safeParse({ id: userId });
  if (!parsedId.success) throw new Error("Invalid user id");

  if (admin.id === parsedId.data.id) throw new Error("You cannot disable yourself");

  await prisma.user.update({
    where: { id: parsedId.data.id },
    data: { isActive: false },
  });

  await logAdminAction({
    adminId: admin.id,
    action: "USER_DISABLED",
    entity: "USER",
    entityId: parsedId.data.id,
  });
}

export async function enableUser(userId: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") throw new Error("Unauthorized");

  const parsedId = routeParamSchema.safeParse({ id: userId });
  if (!parsedId.success) throw new Error("Invalid user id");

  await prisma.user.update({
    where: { id: parsedId.data.id },
    data: { isActive: true },
  });

  await logAdminAction({
    adminId: admin.id,
    action: "USER_ENABLED",
    entity: "USER",
    entityId: parsedId.data.id,
  });
}