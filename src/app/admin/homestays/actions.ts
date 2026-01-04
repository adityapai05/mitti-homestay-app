"use server";

import { prisma } from "@/lib/prisma";

export async function approveListing(listingId: string) {
  await prisma.homestay.update({
    where: { id: listingId },
    data: {
      isVerified: true,
      rejectionReason: null,
    },
  });
}

export async function rejectListing(listingId: string, reason: string) {
  await prisma.homestay.update({
    where: { id: listingId },
    data: {
      isVerified: false,
      rejectionReason: reason,
    },
  });
}
