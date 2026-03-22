"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { revalidatePath } from "next/cache";
import { logAdminAction } from "@/lib/admin/logAdminAction";
import { sendVerificationEmail } from "@/lib/notifications/email/sendVerificationEmail";
import { routeParamSchema } from "@/lib/validation/adminSchemas";
import { sanitizedString } from "@/lib/validation/commonSchemas";

const rejectionReasonSchema = sanitizedString(10, 500, "Rejection reason");

export async function approveHomestay(homestayId: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") throw new Error("Unauthorized");

  const parsedId = routeParamSchema.safeParse({ id: homestayId });
  if (!parsedId.success) throw new Error("Invalid homestay id");

  await prisma.homestay.update({
    where: { id: parsedId.data.id },
    data: {
      isVerified: true,
      rejectionReason: null,
    },
  });

  await sendVerificationEmail("HOMESTAY_VERIFIED", { homestayId: parsedId.data.id });

  await logAdminAction({
    adminId: admin.id,
    action: "HOMESTAY_APPROVED",
    entity: "HOMESTAY",
    entityId: parsedId.data.id,
  });

  revalidatePath("/admin/verification/homestays");
}

export async function rejectHomestay(homestayId: string, reason: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") throw new Error("Unauthorized");

  const parsedId = routeParamSchema.safeParse({ id: homestayId });
  if (!parsedId.success) throw new Error("Invalid homestay id");

  const parsedReason = rejectionReasonSchema.safeParse(reason);
  if (!parsedReason.success) throw new Error(parsedReason.error.issues[0]?.message ?? "Rejection reason required");

  await prisma.homestay.update({
    where: { id: parsedId.data.id },
    data: {
      isVerified: false,
      rejectionReason: parsedReason.data,
    },
  });

  await sendVerificationEmail("HOMESTAY_REJECTED", {
    homestayId: parsedId.data.id,
    reason: parsedReason.data,
  });

  await logAdminAction({
    adminId: admin.id,
    action: "HOMESTAY_REJECTED",
    entity: "HOMESTAY",
    entityId: parsedId.data.id,
    meta: { reason: parsedReason.data },
  });

  revalidatePath("/admin/verification/homestays");
}