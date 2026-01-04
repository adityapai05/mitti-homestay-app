"use client";

import { useState } from "react";
import HomestayVerificationTable from "./HomestayVerificationTable";
import HomestayReviewModal from "./HomestayReviewModal";
import type { AdminHomestayDetails } from "@/types";

export default function HomestayVerificationClient({
  homestays,
}: {
  homestays: AdminHomestayDetails[];
}) {
  const [selected, setSelected] =
    useState<AdminHomestayDetails | null>(null);

  return (
    <>
      <HomestayVerificationTable
        homestays={homestays}
        onSelect={setSelected}
      />

      {selected && (
        <HomestayReviewModal
          homestay={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
