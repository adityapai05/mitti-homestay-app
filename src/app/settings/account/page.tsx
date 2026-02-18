import { redirect } from "next/navigation";

import AccountHeader from "./_components/AccountHeader";
import EmailSection from "./_components/EmailSection";
import PhoneSection from "./_components/PhoneSection";
import DeactivateAccountSection from "./_components/DeactivateAccountSection";
import AccountFooter from "./_components/AccountFooter";
import { getAccountData } from "@/lib/server/account/getAccountData";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const data = await getAccountData();
  if (!data) redirect("/login");

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
