"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import VerificationHeader from "./_components/VerificationHeader";
import VerificationStatusCard from "./_components/VerificationStatusCard";
import VerificationFooter from "./_components/VerificationFooter";

type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export default function VerificationPage() {
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await fetch("/api/host/verification");

        if (!res.ok) {
          throw new Error();
        }

        const data = await res.json();
        setStatus(data.verificationStatus);
      } catch {
        toast.error("Failed to load verification status");
      } finally {
        setLoading(false);
      }
    }

    loadStatus();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-48 bg-mitti-khaki/30 rounded" />
        <div className="h-32 bg-mitti-khaki/20 rounded-xl" />
      </div>
    );
  }

  if (!status) return null;

  return (
    <div className="space-y-6">
      <VerificationHeader />
      <VerificationStatusCard status={status} />
      <VerificationFooter />
    </div>
  );
}
