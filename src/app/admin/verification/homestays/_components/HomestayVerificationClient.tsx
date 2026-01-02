"use client";

import { useState } from "react";
import HomestayVerificationTable from "./HomestayVerificationTable";
import HomestayReviewModal from "./HomestayReviewModal";

export default function HomestayVerificationClient({
  homestays,
}: {
  homestays: any[];
}) {
  const [selectedHomestay, setSelectedHomestay] = useState<any | null>(null);

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
