import RefundRow, { RefundRowItem } from "./RefundRow";

export default function RefundsTable({
  refunds,
  onSelectRefund,
}: {
  refunds: RefundRowItem[];
  onSelectRefund: (refund: RefundRowItem) => void;
}) {
  return (
    <div className="rounded-lg border border-mitti-khaki bg-mitti-cream overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-mitti-beige border-b border-mitti-khaki">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-mitti-dark-brown">
              Guest
            </th>
            <th className="px-4 py-3 text-left font-medium text-mitti-dark-brown">
              Homestay
            </th>
            <th className="px-4 py-3 text-left font-medium text-mitti-dark-brown">
              Refund Amount
            </th>
            <th className="px-4 py-3 text-left font-medium text-mitti-dark-brown">
              Policy
            </th>
            <th className="px-4 py-3 text-left font-medium text-mitti-dark-brown">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {refunds.map((refund) => (
            <RefundRow
              key={refund.bookingId}
              refund={refund}
              onClick={() => onSelectRefund(refund)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
