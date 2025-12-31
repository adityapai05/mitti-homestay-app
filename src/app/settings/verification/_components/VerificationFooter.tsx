import { Info } from "lucide-react";

export default function VerificationFooter() {
  return (
    <div className="flex items-start gap-3 pt-4">
      <Info size={16} className="text-mitti-dark-brown/60 mt-0.5" />

      <p className="text-xs text-mitti-dark-brown/60 max-w-xl">
        Verification helps ensure trust and safety across the MITTI community.
        Document submission and advanced verification will be available soon.
      </p>
    </div>
  );
}
