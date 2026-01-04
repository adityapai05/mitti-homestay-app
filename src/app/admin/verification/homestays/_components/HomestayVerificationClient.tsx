"use client";

import { useState } from "react";
import HomestayVerificationTable, {
  AdminHomestayRow,
} from "./HomestayVerificationTable";
import HomestayReviewModal from "./HomestayReviewModal";

/* ---------- component ---------- */

export default function HomestayVerificationClient({
  homestays,
}: {
  homestays: AdminHomestayRow[];
}) {
  
  const [selectedHomestayId, setSelectedHomestayId] = useState<string | null>(
    null
  );

  return (
    <>
      <HomestayVerificationTable
        homestays={homestays}
        onSelect={(row) => setSelectedHomestayId(row.id)}
      />

      {selectedHomestayId && (
        <HomestayReviewModal
          homestayId={selectedHomestayId}
          onClose={() => setSelectedHomestayId(null)}
        />
      )}
    </>
  );
}
