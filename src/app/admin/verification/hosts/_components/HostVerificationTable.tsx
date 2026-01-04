import HostVerificationRow, { HostVerificationRowItem } from "./HostVerificationRow";

export type HostVerificationItem = {
  userId: string;

  name: string;
  email?: string | null;
  phone?: string | null;
  image?: string | null;

  createdAt: string;

  homestaysCount: number;
  hasPayoutAccount: boolean;

  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
};

export default function HostVerificationTable({
  hosts,
  onSelectHost,
}: {
hosts: HostVerificationRowItem[];
onSelectHost: (host: HostVerificationRowItem) => void;
}) {
  return (
    <div className="rounded-lg border border-mitti-khaki bg-mitti-cream overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-mitti-beige border-b border-mitti-khaki">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-mitti-dark-brown">
              Host
            </th>
            <th className="px-4 py-3 text-left font-medium text-mitti-dark-brown">
              Joined
            </th>
            <th className="px-4 py-3 text-left font-medium text-mitti-dark-brown">
              Homestays
            </th>
            <th className="px-4 py-3 text-left font-medium text-mitti-dark-brown">
              Payout Setup
            </th>
            <th className="px-4 py-3 text-left font-medium text-mitti-dark-brown">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {hosts.map((host) => (
            <HostVerificationRow
              key={host.userId}
              host={host}
              onClick={() => onSelectHost(host)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
