"use client";

import { useState } from "react";
import HostVerificationTable from "./HostVerificationTable";
import HostReviewDrawer from "./HostReviewDrawer";

export default function HostVerificationClient({ hosts }: { hosts: any[] }) {
  const [selectedHost, setSelectedHost] = useState<any | null>(null);

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
