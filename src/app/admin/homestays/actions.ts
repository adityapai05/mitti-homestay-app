"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { routeParamSchema } from "@/lib/validation/adminSchemas";
import { sanitizedString } from "@/lib/validation/commonSchemas";

const rejectionReasonSchema = sanitizedString(10, 500, "Rejection reason");

export async function approveListing(listingId: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") throw new Error("Unauthorized");

  const parsedId = routeParamSchema.safeParse({ id: listingId });
  if (!parsedId.success) throw new Error("Invalid listing id");

  await prisma.homestay.update({
    where: { id: parsedId.data.id },
    data: {
      isVerified: true,
      rejectionReason: null,
    },
  });
}

export async function rejectListing(listingId: string, reason: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") throw new Error("Unauthorized");

  const parsedId = routeParamSchema.safeParse({ id: listingId });
  if (!parsedId.success) throw new Error("Invalid listing id");

  const parsedReason = rejectionReasonSchema.safeParse(reason);
  if (!parsedReason.success) throw new Error(parsedReason.error.issues[0]?.message ?? "Rejection reason required");

  await prisma.homestay.update({
    where: { id: parsedId.data.id },
    data: {
      isVerified: false,
      rejectionReason: parsedReason.data,
    },
  });
}