"use client";

import { useState } from "react";
import AdminPayoutsTable from "./AdminPayoutsTable";
import PayoutReviewModal from "./PayoutReviewModal";

export default function AdminPayoutsClient({ payouts }: { payouts: any[] }) {
  const [selected, setSelected] = useState<any | null>(null);
  const [tab, setTab] = useState<"PENDING" | "PROCESSED" | "FAILED">("PENDING");

  const filtered = payouts.filter((p) => p.status === tab);
  return (
    <>
      {/* Tabs */}
      <div className="flex gap-6 mb-6 text-sm">
        {["PENDING", "PROCESSED", "FAILED"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
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

      <AdminPayoutsTable payouts={filtered} onSelect={setSelected} />

      {selected && (
        <PayoutReviewModal
          payout={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
