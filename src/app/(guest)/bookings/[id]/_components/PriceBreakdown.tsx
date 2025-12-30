import { Decimal } from "@prisma/client/runtime/library";

interface PriceBreakdownProps {
  totalPrice: Decimal;
  guideFee: Decimal | null;
}

function formatINR(amount: Decimal) {
  return `INR ${amount.toNumber().toLocaleString("en-IN")}`;
}

export default function PriceBreakdown({
  totalPrice,
  guideFee,
}: PriceBreakdownProps) {
  const hasGuideFee = guideFee && guideFee.greaterThan(0);

  const stayCost = hasGuideFee
    ? totalPrice.minus(guideFee as Decimal)
    : totalPrice;

  return (
    <section className="rounded-xl border border-mitti-khaki bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-mitti-dark-brown mb-4">
        Price breakdown
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-mitti-dark-brown/80">
          <span>Stay cost</span>
          <span>{formatINR(stayCost)}</span>
        </div>

        {hasGuideFee ? (
          <div className="flex justify-between text-mitti-dark-brown/80">
            <span>Guide fee</span>
            <span>{formatINR(guideFee as Decimal)}</span>
          </div>
        ) : null}

        <div className="border-t border-mitti-khaki/60 pt-3 flex justify-between font-semibold text-mitti-dark-brown">
          <span>Total amount</span>
          <span>{formatINR(totalPrice)}</span>
        </div>
      </div>
    </section>
  );
}
