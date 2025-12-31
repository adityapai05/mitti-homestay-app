import { useState } from "react";

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

interface Props {
  summary: PayoutSummary;
  onRequestPayout: () => void;
  isRequesting: boolean;
  hasPayoutMethod: boolean;
}

export default function EarningsSummary({
  summary,
  onRequestPayout,
  isRequesting,
  hasPayoutMethod,
}: Props) {
  const [showFeeInfo, setShowFeeInfo] = useState(false);

  const canWithdraw =
    hasPayoutMethod && summary.availableToWithdraw > 0 && !isRequesting;

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium text-mitti-dark-brown">
        Earnings summary
      </h2>

      <div className="rounded-xl border border-mitti-khaki bg-mitti-cream px-5 py-5 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Stat
            label="Total earned"
            value={formatCurrency(summary.totalEarned)}
          />

          <Stat label="Paid out" value={formatCurrency(summary.totalPaidOut)} />

          <Stat
            label="Pending payouts"
            value={formatCurrency(summary.pendingPayouts)}
          />

          <Stat
            label="Available to withdraw"
            value={formatCurrency(summary.availableToWithdraw)}
            highlight
          />
        </div>

        {/* Last payout */}
        {summary.lastPayout && (
          <div className="text-xs text-mitti-dark-brown/60">
            Last payout of{" "}
            <span className="font-medium text-mitti-dark-brown">
              {formatCurrency(summary.lastPayout.amount)}
            </span>{" "}
            processed on{" "}
            {new Date(summary.lastPayout.processedAt).toLocaleDateString()}
          </div>
        )}

        {/* Action + guidance */}
        <div className="space-y-3 pt-2">
          {!hasPayoutMethod && summary.availableToWithdraw > 0 && (
            <div className="rounded-lg bg-mitti-beige px-3 py-2 text-xs text-mitti-dark-brown/80">
              <span className="font-medium">
                Add payout details to withdraw your earnings.
              </span>{" "}
              Set up your UPI ID or bank account above.
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs text-mitti-dark-brown/60 max-w-sm">
              Payouts are processed manually during testing. Once requested, the
              amount will move to pending payouts.
            </p>

            <button
              type="button"
              disabled={!canWithdraw}
              onClick={onRequestPayout}
              className={`
                rounded-lg px-5 py-2 text-sm font-medium transition
                ${
                  canWithdraw
                    ? "bg-mitti-brown text-white hover:bg-mitti-dark-brown cursor-pointer"
                    : "bg-mitti-khaki/40 text-mitti-dark-brown/60 cursor-not-allowed"
                }
              `}
            >
              {isRequesting ? "Requesting…" : "Request payout"}
            </button>
          </div>
          {/* Service fee explainer */}
          <div className="text-xs text-mitti-dark-brown/60">
            Includes MITTI service fee.{" "}
            <button
              type="button"
              onClick={() => setShowFeeInfo((v) => !v)}
              className="text-mitti-brown hover:underline"
            >
              Learn how earnings are calculated
            </button>
          </div>

          {showFeeInfo && (
            <div className="rounded-lg bg-mitti-beige px-3 py-2 text-xs text-mitti-dark-brown/80">
              <span className="font-medium">MITTI service fee:</span> MITTI
              deducts a 10% service fee from each completed booking to support
              platform operations and customer support. The remaining amount is
              credited to your earnings after the stay is completed.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Helpers ----------------------------- */

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-mitti-dark-brown/60">{label}</span>
      <span
        className={`text-sm ${
          highlight
            ? "font-semibold text-mitti-dark-brown"
            : "text-mitti-dark-brown"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
