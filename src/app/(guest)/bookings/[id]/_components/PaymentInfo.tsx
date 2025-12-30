import { Decimal } from "@prisma/client/runtime/library";
import { format } from "date-fns";

interface PaymentInfoProps {
  payment: {
    amount: Decimal;
    currency: string;
    razorpayPaymentId: string;
    createdAt: Date;
  };
}

export default function PaymentInfo({ payment }: PaymentInfoProps) {
  return (
    <section className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-2">
      <h2 className="text-base font-semibold text-mitti-dark-brown mb-3">
        Payment details
      </h2>

      <div className="space-y-2 text-sm text-mitti-dark-brown/80">
        <p>
          <span className="font-medium">Amount paid:</span> ₹
          {payment.amount.toString()}
        </p>

        <p>
          <span className="font-medium">Payment ID:</span> ****
          {payment.razorpayPaymentId.slice(-6)}
        </p>

        <p>
          <span className="font-medium">Paid on:</span>{" "}
          {format(
            new Date(payment.createdAt.toISOString()),
            "dd MMM yyyy, hh:mm a"
          )}
        </p>
      </div>
    </section>
  );
}
