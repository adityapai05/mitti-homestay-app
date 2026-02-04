import { ShieldCheck } from "lucide-react";

export default function LocationNotice() {
  return (
    <div className="flex items-start gap-2 text-xs text-mitti-dark-brown/70">
      <ShieldCheck className="h-4 w-4 text-mitti-olive mt-0.5 shrink-0" />
      <p>
        Exact location details are shared after booking to protect host privacy
        and ensure a safe experience.
      </p>
    </div>
  );
}
