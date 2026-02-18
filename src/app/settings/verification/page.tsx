import { redirect } from "next/navigation";

import VerificationHeader from "./_components/VerificationHeader";
import VerificationStatusCard from "./_components/VerificationStatusCard";
import VerificationFooter from "./_components/VerificationFooter";
import { getHostVerificationStatus } from "@/lib/server/host/getHostVerificationStatus";

export const dynamic = "force-dynamic";

export default async function VerificationPage() {
  const status = await getHostVerificationStatus();
  if (!status) redirect("/login");

  return (
    <div className="space-y-6">
      <VerificationHeader />
      <VerificationStatusCard status={status} />
      <VerificationFooter />
    </div>
  );
}
