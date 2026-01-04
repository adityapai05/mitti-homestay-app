"use client";

import { useState } from "react";
import HostVerificationTable from "./HostVerificationTable";
import HostReviewDrawer from "./HostReviewDrawer";
import type { HostVerificationRowItem } from "./HostVerificationRow";

export default function HostVerificationClient({
  hosts,
}: {
  hosts: HostVerificationRowItem[];
}) {
  const [selectedHost, setSelectedHost] =
    useState<HostVerificationRowItem | null>(null);

  return (
    <>
      <HostVerificationTable hosts={hosts} onSelectHost={setSelectedHost} />

      {selectedHost && (
        <HostReviewDrawer
          host={selectedHost}
          onClose={() => setSelectedHost(null)}
        />
      )}
    </>
  );
}
