"use client";

import { useState } from "react";
import AdminPayoutsTable from "./AdminPayoutsTable";
import PayoutReviewModal from "./PayoutReviewModal";

/**
 * Canonical payout type inferred from PayoutReviewModal
 */
type AdminPayout = React.ComponentProps<
  typeof PayoutReviewModal
>["payout"];

type PayoutTab = "PENDING" | "PROCESSED" | "FAILED";

export default function AdminPayoutsClient({
  payouts,
}: {
  payouts: AdminPayout[];
}) {
  const [selected, setSelected] = useState<AdminPayout | null>(null);
  const [tab, setTab] = useState<PayoutTab>("PENDING");

  const filtered = payouts.filter((p) => p.status === tab);

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-6 mb-6 text-sm">
        {(["PENDING", "PROCESSED", "FAILED"] as PayoutTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 border-b-2 ${
              tab === t
                ? "border-mitti-olive text-mitti-dark-brown font-medium"
                : "border-transparent text-mitti-dark-brown/60"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <AdminPayoutsTable
        payouts={filtered}
        onSelect={(payout) => {
          // Explicit boundary normalization
          setSelected(payout as AdminPayout);
        }}
      />

      {selected && (
        <PayoutReviewModal
          payout={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
