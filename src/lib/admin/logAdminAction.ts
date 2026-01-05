import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type LogAdminActionInput = {
  adminId: string;
  action: string;
  entity: string;
  entityId: string;
  meta?: Prisma.InputJsonValue;
};

export async function logAdminAction({
  adminId,
  action,
  entity,
  entityId,
  meta,
}: LogAdminActionInput) {
  await prisma.adminActionLog.create({
    data: {
      adminId,
      action,
      entity,
      entityId,
      meta: meta === undefined ? undefined : meta,
    },
  });
}
