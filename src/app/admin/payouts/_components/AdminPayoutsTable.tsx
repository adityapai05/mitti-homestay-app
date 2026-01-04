import PayoutStatusPill from "./PayoutStatusPill";

/* ---------- Types ---------- */

type PayoutStatus = "PENDING" | "PROCESSED" | "FAILED";
type PayoutMethod = "UPI" | "BANK";

type PayoutUser = {
  name: string;
  email?: string | null;
  phone?: string | null;
  payoutAccount?: {
    method: PayoutMethod;
  } | null;
};

export type AdminPayout = {
  id: string;
  amount: string;
  status: PayoutStatus;
  createdAt: string;
  user: PayoutUser;
};

/* ---------- Component ---------- */

export default function AdminPayoutsTable({
  payouts,
  onSelect,
}: {
  payouts: AdminPayout[];
  onSelect: (payout: AdminPayout) => void;
}) {
  return (
    <div className="rounded-lg border border-mitti-khaki bg-mitti-cream overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-mitti-beige border-b border-mitti-khaki">
          <tr>
            <th className="px-4 py-3 text-left">Host</th>
            <th className="px-4 py-3 text-left">Amount</th>
            <th className="px-4 py-3 text-left">Method</th>
            <th className="px-4 py-3 text-left">Requested</th>
            <th className="px-4 py-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {payouts.map((p) => (
            <tr
              key={p.id}
              onClick={() => onSelect(p)}
              className="border-b border-mitti-khaki hover:bg-mitti-beige cursor-pointer"
            >
              <td className="px-4 py-4">
                <div>
                  <p className="font-medium">{p.user.name}</p>
                  <p className="text-xs text-mitti-dark-brown/60">
                    {p.user.email || p.user.phone}
                  </p>
                </div>
              </td>

              <td className="px-4 py-4 font-medium">₹ {p.amount}</td>

              <td className="px-4 py-4">
                {p.user.payoutAccount?.method ?? "—"}
              </td>

              <td className="px-4 py-4">
                {new Date(p.createdAt).toLocaleDateString()}
              </td>

              <td className="px-4 py-4">
                <PayoutStatusPill status={p.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
