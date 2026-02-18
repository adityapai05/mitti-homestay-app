import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export interface AccountData {
  email: string | null;
  emailVerified: boolean;
  phone: string | null;
  isActive: boolean;
}

export async function getAccountData(): Promise<AccountData | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return {
    email: user.email ?? null,
    emailVerified: user.isVerified,
    phone: user.phone ?? null,
    isActive: user.isActive,
  };
}
