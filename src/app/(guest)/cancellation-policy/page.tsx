import Link from "next/link";

export default function CancellationPolicyPage() {
  return (
    <main className="bg-mitti-beige w-full">
      <section className="px-4 sm:px-6 py-12 flex justify-center">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-widest text-mitti-brown mb-4">
              Cancellation Policy
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-mitti-dark-brown">
              Transparent and time-based cancellation rules
            </h1>
          </div>

          {/* Content */}
          <div className="space-y-6 px-4 sm:px-0 text-mitti-dark-brown/80 leading-relaxed text-base">
            <p>
              This Cancellation Policy explains how booking cancellations and
              refunds are handled on the MITTI platform. The policy is designed
              to be clear, fair, and consistent for both travellers and hosts.
            </p>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              Platform-managed cancellations
            </h2>
            <p>
              MITTI manages booking payments and releases host payouts only
              after a stay is successfully completed. As a result, cancellation
              rules and refund calculations are enforced at the platform level.
            </p>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              Cancellation policy types
            </h2>
            <p>
              Each homestay listed on MITTI selects one of the following
              cancellation policy types. The applicable policy is displayed
              clearly before a booking is confirmed.
            </p>

            <h3 className="font-medium text-mitti-dark-brown">
              Flexible
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Cancel 7 days or more before check-in: Full refund</li>
              <li>Cancel less than 7 days before check-in: No refund</li>
            </ul>

            <h3 className="font-medium text-mitti-dark-brown">
              Moderate
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Cancel 14 days or more before check-in: Full refund</li>
              <li>Cancel 7 to 13 days before check-in: 50% refund</li>
              <li>Cancel less than 7 days before check-in: No refund</li>
            </ul>

            <h3 className="font-medium text-mitti-dark-brown">
              Strict
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Cancel 30 days or more before check-in: 50% refund</li>
              <li>Cancel less than 30 days before check-in: No refund</li>
            </ul>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              Refund processing
            </h2>
            <p>
              Refund amounts, where applicable, are calculated based on the
              selected cancellation policy and the time remaining before the
              scheduled check-in date. Refunds are processed through the
              original payment method.
            </p>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              Cancellations by hosts
            </h2>
            <p>
              If a host cancels a confirmed booking, travellers will be notified
              promptly and guided on the next steps based on the specific
              circumstances.
            </p>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              Academic context
            </h2>
            <p>
              MITTI is an academic project developed as part of a Bachelor of
              Science in Information Technology program. This policy represents
              intended platform behavior for demonstration and learning
              purposes.
            </p>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              Questions
            </h2>
            <p>
              For questions related to cancellations or refunds, users may reach
              out through the{" "}
              <Link
                href="/contact"
                className="text-mitti-brown font-medium hover:text-mitti-dark-brown"
              >
                contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
