"use client";

import { useEffect, useState } from "react";
import PayoutsHeader from "./_components/PayoutsHeader";
import PayoutMethodCard from "./_components/PayoutMethodCard";
import PayoutDetailsSummary from "./_components/PayoutDetailsSummary";
import PayoutDetailsForm from "./_components/PayoutDetailsForm";
import EarningsSummary from "./_components/EarningsSummary";
import TrustFooter from "./_components/TrustFooter";

import { toast } from "sonner";

type PayoutMethodType = "UPI" | "BANK";

interface HostPayoutAccount {
  method: PayoutMethodType;
  upiId?: string;
  bankName?: string;
  accountNo?: string;
  ifsc?: string;
  accountHolderName: string;
}

interface PayoutSummary {
  totalEarned: number;
  totalPaidOut: number;
  pendingPayouts: number;
  availableToWithdraw: number;
  lastPayout?: {
    amount: number;
    processedAt: string;
  };
}


export default function PayoutsPage() {
  const [account, setAccount] = useState<HostPayoutAccount | null>(null);
  const [summary, setSummary] = useState<PayoutSummary | null>(null);

  const [selectedMethod, setSelectedMethod] = useState<PayoutMethodType | null>(
    null
  );

  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isRequestingPayout, setIsRequestingPayout] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function loadData() {
      try {
        const [accountRes, summaryRes] = await Promise.all([
          fetch("/api/host/payouts/account"),
          fetch("/api/host/payouts/summary"),
        ]);

        if (!accountRes.ok || !summaryRes.ok) {
          throw new Error("Failed to load payout data");
        }

        const accountData = await accountRes.json();
        const summaryData = await summaryRes.json();

        setAccount(accountData);
        setSummary(summaryData);
        setSelectedMethod(accountData?.method ?? null);
      } catch  {
        toast.error("Failed to load payout information");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);


  async function handleRequestPayout() {
    if (!summary || summary.availableToWithdraw <= 0) return;

    try {
      setIsRequestingPayout(true);

      const res = await fetch("/api/host/payouts/request", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error();
      }

      toast.success("Payout request submitted");

      // Refresh summary after request
      const refreshed = await fetch("/api/host/payouts/summary").then((r) =>
        r.json()
      );
      setSummary(refreshed);
    } catch {
      toast.error("Unable to request payout");
    } finally {
      setIsRequestingPayout(false);
    }
  }


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-40 bg-mitti-khaki/30 rounded" />
        <div className="h-32 bg-mitti-khaki/20 rounded-xl" />
        <div className="h-48 bg-mitti-khaki/20 rounded-xl" />
      </div>
    );
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
        <PayoutDetailsSummary
          account={account}
          onEdit={() => setIsEditingDetails(true)}
        />
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

      {summary && (
        <EarningsSummary
          summary={summary}
          onRequestPayout={handleRequestPayout}
          isRequesting={isRequestingPayout}
          hasPayoutMethod={!!account}
        />
      )}

      <TrustFooter />
    </div>
  );
}
