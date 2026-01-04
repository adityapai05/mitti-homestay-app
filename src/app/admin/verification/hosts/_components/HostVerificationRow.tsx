import { ChevronRight } from "lucide-react";
import VerificationStatusPill from "./VerificationStatusPill";
import type { HostVerificationStatus } from "@/types";

/**
 * This is the single source of truth type
 * used across table, client, and drawer
 */
export type HostVerificationRowItem = {
  userId: string;
  verificationStatus: HostVerificationStatus;
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    createdAt: string;
    homestays: unknown[]; // count only, no deep usage
    payoutAccount: unknown | null;
  };
};

export default function HostVerificationRow({
  host,
  onClick,
}: {
  host: HostVerificationRowItem;
  onClick: () => void;
}) {
  const { user, verificationStatus } = host;

  return (
    <tr
      onClick={onClick}
      className="border-b border-mitti-khaki hover:bg-mitti-beige cursor-pointer transition"
    >
      <td className="px-4 py-4">
        <div>
          <p className="font-medium text-mitti-dark-brown">{user.name}</p>
          <p className="text-xs text-mitti-dark-brown/70">
            {user.email || user.phone || "—"}
          </p>
        </div>
      </td>

      <td className="px-4 py-4 text-mitti-dark-brown/80">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>

      <td className="px-4 py-4 text-mitti-dark-brown/80">
        {user.homestays.length}
      </td>

      <td className="px-4 py-4 text-mitti-dark-brown/80">
        {user.payoutAccount ? "Completed" : "Not set"}
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center justify-between">
          <VerificationStatusPill status={verificationStatus} />
          <ChevronRight size={16} className="text-mitti-dark-brown/60" />
        </div>
      </td>
    </tr>
  );
}
