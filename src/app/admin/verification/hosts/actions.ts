"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { revalidatePath } from "next/cache";
import { logAdminAction } from "@/lib/admin/logAdminAction";
import { sendVerificationEmail } from "@/lib/notifications/email/sendVerificationEmail";
import { routeParamSchema } from "@/lib/validation/adminSchemas";
import { sanitizedString } from "@/lib/validation/commonSchemas";

const rejectionReasonSchema = sanitizedString(10, 500, "Rejection reason");

export async function approveHost(userId: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") throw new Error("Unauthorized");

  const parsedId = routeParamSchema.safeParse({ id: userId });
  if (!parsedId.success) throw new Error("Invalid user id");

  await prisma.hostProfile.update({
    where: { userId: parsedId.data.id },
    data: {
      verificationStatus: "VERIFIED",
      rejectionReason: null,
    },
  });

  await sendVerificationEmail("HOST_VERIFIED", { userId: parsedId.data.id });

  await logAdminAction({
    adminId: admin.id,
    action: "HOST_APPROVED",
    entity: "HOST",
    entityId: parsedId.data.id,
  });

  revalidatePath("/admin/verification/hosts");
}

export async function rejectHost(userId: string, reason: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") throw new Error("Unauthorized");

  const parsedId = routeParamSchema.safeParse({ id: userId });
  if (!parsedId.success) throw new Error("Invalid user id");

  const parsedReason = rejectionReasonSchema.safeParse(reason);
  if (!parsedReason.success) throw new Error(parsedReason.error.issues[0]?.message ?? "Rejection reason required");

  await prisma.hostProfile.update({
    where: { userId: parsedId.data.id },
    data: {
      verificationStatus: "REJECTED",
      rejectionReason: parsedReason.data,
    },
  });

  await sendVerificationEmail("HOST_REJECTED", {
    userId: parsedId.data.id,
    reason: parsedReason.data,
  });

  await logAdminAction({
    adminId: admin.id,
    action: "HOST_REJECTED",
    entity: "HOST",
    entityId: parsedId.data.id,
    meta: { reason: parsedReason.data },
  });

  revalidatePath("/admin/verification/hosts");
}