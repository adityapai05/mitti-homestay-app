import { ChevronRight } from "lucide-react";
import RefundStatusPill from "./RefundStatusPill";
import type { CancellationPolicy, RefundStatus } from "@prisma/client";

export type RefundRowItem = {
  bookingId: string;

  refundAmount: string;
  refundStatus: RefundStatus;

  cancelledAt: string;
  checkIn: string;

  guest: {
    id: string;
    name: string;
    email: string | null;
  };

  homestay: {
    id: string;
    name: string;
    village: string | null;
    district: string | null;
    state: string | null;
    cancellationPolicy: CancellationPolicy;
  };
};

export default function RefundRow({
  refund,
  onClick,
}: {
  refund: RefundRowItem;
  onClick: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className="border-b border-mitti-khaki hover:bg-mitti-beige cursor-pointer transition"
    >
      <td className="px-4 py-4">
        <div>
          <p className="font-medium text-mitti-dark-brown">
            {refund.guest.name}
          </p>
          <p className="text-xs text-mitti-dark-brown/70">
            {refund.guest.email || "—"}
          </p>
        </div>
      </td>

      <td className="px-4 py-4 text-mitti-dark-brown/80">
        {refund.homestay.name}
      </td>

      <td className="px-4 py-4 text-mitti-dark-brown/80">
        ₹{Number(refund.refundAmount).toLocaleString()}
      </td>

      <td className="px-4 py-4 text-mitti-dark-brown/80">
        {refund.homestay.cancellationPolicy}
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center justify-between">
          <RefundStatusPill status={refund.refundStatus} />
          <ChevronRight size={16} className="text-mitti-dark-brown/60" />
        </div>
      </td>
    </tr>
  );
}
