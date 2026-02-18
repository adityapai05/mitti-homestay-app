"use client";

import { useState } from "react";
import { toast } from "sonner";
import PayoutsHeader from "./PayoutsHeader";
import PayoutMethodCard from "./PayoutMethodCard";
import PayoutDetailsSummary from "./PayoutDetailsSummary";
import PayoutDetailsForm from "./PayoutDetailsForm";
import EarningsSummary from "./EarningsSummary";
import TrustFooter from "./TrustFooter";
import type {
  HostPayoutAccountData,
  PayoutMethodType,
} from "@/lib/server/host/getHostPayoutAccount";
import type { HostPayoutSummaryData } from "@/lib/server/host/getHostPayoutSummary";

interface Props {
  initialAccount: HostPayoutAccountData | null;
  initialSummary: HostPayoutSummaryData;
}

export default function PayoutsPageClient({ initialAccount, initialSummary }: Props) {
  const [account, setAccount] = useState<HostPayoutAccountData | null>(initialAccount);
  const [summary, setSummary] = useState<HostPayoutSummaryData>(initialSummary);
  const [selectedMethod, setSelectedMethod] = useState<PayoutMethodType | null>(
    initialAccount?.method ?? null
  );
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isRequestingPayout, setIsRequestingPayout] = useState(false);

  async function handleRequestPayout() {
    if (summary.availableToWithdraw <= 0) return;

    try {
      setIsRequestingPayout(true);

      const res = await fetch("/api/host/payouts/request", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error();
      }

      toast.success("Payout request submitted");

      const refreshed = await fetch("/api/host/payouts/summary").then((r) => r.json());
      setSummary(refreshed);
    } catch {
      toast.error("Unable to request payout");
    } finally {
      setIsRequestingPayout(false);
    }
  }

  return (
    <div className="space-y-6">
      <PayoutsHeader />

      <PayoutMethodCard
        selectedMethod={selectedMethod}
        onSelect={setSelectedMethod}
        disabled={!!account && !isEditingDetails}
      />

      {account && !isEditingDetails ? (
        <PayoutDetailsSummary account={account} onEdit={() => setIsEditingDetails(true)} />
      ) : selectedMethod ? (
        <PayoutDetailsForm
          method={selectedMethod}
          initialValues={account}
          onCancel={() => {
            setIsEditingDetails(false);
            setSelectedMethod(account?.method ?? null);
          }}
          onSuccess={(updated) => {
            setAccount(updated);
            setIsEditingDetails(false);
            toast.success("Payout details saved");
          }}
        />
      ) : null}

      <EarningsSummary
        summary={summary}
        onRequestPayout={handleRequestPayout}
        isRequesting={isRequestingPayout}
        hasPayoutMethod={!!account}
      />

      <TrustFooter />
    </div>
  );
}
