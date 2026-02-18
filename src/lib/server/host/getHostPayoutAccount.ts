import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";

export type PayoutMethodType = "UPI" | "BANK";

export interface HostPayoutAccountData {
  method: PayoutMethodType;
  upiId?: string;
  bankName?: string;
  accountNo?: string;
  ifsc?: string;
  accountHolderName: string;
}

export async function getHostPayoutAccount(): Promise<HostPayoutAccountData | null | undefined> {
  const user = await getCurrentUser();

  if (!user || user.role !== "HOST") {
    return null;
  }

  const account = await prisma.hostPayoutAccount.findUnique({
    where: { userId: user.id },
  });

  if (!account) {
    return undefined;
  }

  return {
    method: account.method as PayoutMethodType,
    accountHolderName: account.accountHolderName,
    upiId: account.upiId ?? undefined,
    bankName: account.bankName ?? undefined,
    accountNo: account.accountNo ?? undefined,
    ifsc: account.ifsc ?? undefined,
  };
}
