"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import AccountHeader from "./_components/AccountHeader";
import EmailSection from "./_components/EmailSection";
import PhoneSection from "./_components/PhoneSection";
import DeactivateAccountSection from "./_components/DeactivateAccountSection";
import AccountFooter from "./_components/AccountFooter";

interface AccountData {
  email: string | null;
  emailVerified: boolean;
  phone: string | null;
  isActive: boolean;
}

export default function AccountPage() {
  const [data, setData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccount() {
      try {
        const res = await fetch("/api/account");
        if (!res.ok) throw new Error();

        const json = await res.json();
        setData(json);
      } catch {
        toast.error("Failed to load account details");
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-40 bg-mitti-khaki/30 rounded" />
        <div className="h-32 bg-mitti-khaki/20 rounded-xl" />
        <div className="h-32 bg-mitti-khaki/20 rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <AccountHeader />

      <EmailSection email={data.email} emailVerified={data.emailVerified} />

      <PhoneSection phone={data.phone} />

      <DeactivateAccountSection />

      <AccountFooter />
    </div>
  );
}
