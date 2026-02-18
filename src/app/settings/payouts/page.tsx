import { redirect } from "next/navigation";
import PayoutsPageClient from "./_components/PayoutsPageClient";
import { getHostPayoutAccount } from "@/lib/server/host/getHostPayoutAccount";
import { getHostPayoutSummary } from "@/lib/server/host/getHostPayoutSummary";

export const dynamic = "force-dynamic";

export default async function PayoutsPage() {
  const [account, summary] = await Promise.all([
    getHostPayoutAccount(),
    getHostPayoutSummary(),
  ]);

  if (account === null || !summary) {
    redirect("/login");
  }

  return <PayoutsPageClient initialAccount={account ?? null} initialSummary={summary} />;
}
