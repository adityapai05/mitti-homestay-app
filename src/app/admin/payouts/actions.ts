"use server";

import { prisma } from "@/lib/prisma";

export async function processPayout(payoutId: string) {
  await prisma.hostPayout.update({
    where: { id: payoutId },
    data: {
      status: "PROCESSED",
      processedAt: new Date(),
    },
  });
}

export async function failPayout(payoutId: string, reason: string) {
  await prisma.hostPayout.update({
    where: { id: payoutId },
    data: {
      status: "FAILED",
    },
  });
}
