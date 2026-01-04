"use client";

import { useState } from "react";
import HomestayVerificationTable, {
  AdminHomestay,
} from "./HomestayVerificationTable";
import HomestayReviewModal from "./HomestayReviewModal";

/* ---------- component ---------- */

export default function HomestayVerificationClient({
  homestays,
}: {
  homestays: AdminHomestay[];
}) {
  const [selectedHomestay, setSelectedHomestay] =
    useState<AdminHomestay | null>(null);

  return (
    <>
      <HomestayVerificationTable
        homestays={homestays}
        onSelect={setSelectedHomestay}
      />

      {selectedHomestay && (
        <HomestayReviewModal
          homestay={selectedHomestay}
          onClose={() => setSelectedHomestay(null)}
        />
      )}
    </>
  );
}
