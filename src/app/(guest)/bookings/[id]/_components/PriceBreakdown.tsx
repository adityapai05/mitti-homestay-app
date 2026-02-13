interface Pricing {
  nights: number;
  stayBase: number;
  guideFee: number;
  platformFee: number;
  gst: number;
  subtotal: number;
  total: number;
}

export default function PriceBreakdown({
  pricing,
}: {
  pricing: Pricing | null | undefined;
}) {
  if (!pricing) {
    return (
      <section className="rounded-xl border border-mitti-khaki bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-mitti-dark-brown mb-4">
          Price breakdown
        </h2>
        <p className="text-sm text-mitti-dark-brown/60">Loading pricing…</p>
      </section>
    );
  }

  const format = (v: number) => `₹${v.toLocaleString("en-IN")}`;

  return (
    <section className="rounded-xl border border-mitti-khaki bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-mitti-dark-brown mb-4">
        Price breakdown
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Stay ({pricing.nights} nights)</span>
          <span>{format(pricing.stayBase)}</span>
        </div>

        {pricing.guideFee > 0 && (
          <div className="flex justify-between">
            <span>Guide fee</span>
            <span>{format(pricing.guideFee)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Platform fee</span>
          <span>{format(pricing.platformFee)}</span>
        </div>

        <div className="flex justify-between">
          <span>GST</span>
          <span>{format(pricing.gst)}</span>
        </div>

        <div className="flex justify-between font-semibold border-t pt-3">
          <span>Total</span>
          <span>{format(pricing.total)}</span>
        </div>
      </div>
    </section>
  );
}
