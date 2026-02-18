import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";

export type HostVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export async function getHostVerificationStatus(): Promise<HostVerificationStatus | null> {
  const user = await getCurrentUser();

  if (!user || user.role !== "HOST") {
    return null;
  }

  const hostProfile = await prisma.hostProfile.findUnique({
    where: { userId: user.id },
    select: { verificationStatus: true },
  });

  return hostProfile?.verificationStatus ?? "PENDING";
}
