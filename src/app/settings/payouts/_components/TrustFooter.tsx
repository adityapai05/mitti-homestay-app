import { ShieldCheck } from "lucide-react";

export default function TrustFooter() {
  return (
    <div className="flex items-start gap-3 pt-4">
      <ShieldCheck size={18} className="text-mitti-dark-brown/70 mt-0.5" />

      <p className="text-xs text-mitti-dark-brown/60 max-w-xl">
        Your payout details are encrypted and only used to process your
        earnings. MITTI never shares your financial information with guests or
        third parties.
      </p>
    </div>
  );
}
