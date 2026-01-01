export default function PriceBreakdown({
  price,
  payment,
}: {
  price: { total: number };
  payment: {
    amount: number;
    currency: string;
    razorpayPaymentId: string;
    createdAt: string;
  } | null;
}) {
  return (
    <section className="rounded-xl border border-mitti-khaki bg-white p-5">
      <h3 className="text-base font-semibold text-mitti-dark-brown mb-4">
        Payment
      </h3>

      <p className="text-lg font-semibold text-mitti-dark-brown">
        ₹{price.total.toLocaleString()}
      </p>

      {payment ? (
        <p className="mt-1 text-sm text-mitti-olive">
          Paid on {new Date(payment.createdAt).toDateString()}
        </p>
      ) : (
        <p className="mt-1 text-sm text-mitti-dark-brown/60">
          Awaiting payment from guest
        </p>
      )}
    </section>
  );
}
