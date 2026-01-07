"use client";

import { useState } from "react";
import RefundsTable from "./RefundsTable";
import RefundReviewDrawer from "./RefundReviewDrawer";
import type { RefundRowItem } from "./RefundRow";

export default function RefundsClient({
  refunds,
}: {
  refunds: RefundRowItem[];
}) {
  const [selectedRefund, setSelectedRefund] = useState<RefundRowItem | null>(
    null
  );

  return (
    <>
      <RefundsTable refunds={refunds} onSelectRefund={setSelectedRefund} />

      {selectedRefund && (
        <RefundReviewDrawer
          refund={selectedRefund}
          onClose={() => setSelectedRefund(null)}
        />
      )}
    </>
  );
}
