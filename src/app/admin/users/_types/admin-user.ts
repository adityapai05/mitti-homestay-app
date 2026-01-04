import { Role, HostVerificationStatus } from "@prisma/client";

export interface AdminUser {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;

  role: Role;
  isActive: boolean;

  createdAt: string;

  languages: string[];
  about?: string | null;

  hostProfile?: {
    verificationStatus: HostVerificationStatus;
  } | null;

  payoutAccount?: unknown | null;

  homestays?: { id: string }[];
  bookingsMadeCount?: number;
  bookingsHostedCount?: number;
}
