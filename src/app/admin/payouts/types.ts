export type PayoutUser = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;

  hostProfile?: {
    verificationStatus?: "PENDING" | "VERIFIED" | "REJECTED" | null;
  } | null;

  payoutAccount?: {
    method: "UPI" | "BANK";
    accountHolderName: string;
    upiId?: string | null;
    bankName?: string | null;
    accountNo?: string | null;
    ifsc?: string | null;
  } | null;

  lastPayout?: {
    amount: number;
    processedAt: string;
  } | null;
};

export type AdminPayout = {
  id: string;
  amount: number;
  status: "PENDING" | "PROCESSED" | "FAILED";
  createdAt: string;
  processedAt?: string | null;
  user: PayoutUser;
};
