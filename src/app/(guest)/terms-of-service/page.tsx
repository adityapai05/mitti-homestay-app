import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <main className="bg-mitti-beige w-full">
      <section className="px-4 sm:px-6 py-12 flex justify-center">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-widest text-mitti-brown mb-4">
              Terms of Service
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-mitti-dark-brown">
              Terms governing the use of MITTI
            </h1>
          </div>

          {/* Content */}
          <div className="space-y-6 px-4 sm:px-0 text-mitti-dark-brown/80 leading-relaxed text-base">
            <p>
              These Terms of Service outline the rules and conditions governing
              the use of the MITTI platform. By accessing or using the platform,
              users agree to comply with these terms.
            </p>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              Nature of the platform
            </h2>
            <p>
              MITTI is a rural homestay booking platform developed as part of a
              Bachelor of Science in Information Technology academic project. It
              is intended to demonstrate platform design, booking workflows, and
              ethical technology practices.
            </p>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              User responsibilities
            </h2>
            <p>
              Users are responsible for providing accurate information when
              creating accounts, submitting forms, or making bookings. Any
              misuse of the platform or submission of misleading information may
              result in restricted access.
            </p>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              Bookings and payments
            </h2>
            <p>
              MITTI facilitates booking interactions between travellers and
              rural homestay hosts. Payments made through the platform are
              managed according to the booking and cancellation policies
              displayed at the time of confirmation.
            </p>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              Cancellations and refunds
            </h2>
            <p>
              Cancellation and refund rules are governed by the platform’s{" "}
              <Link
                href="/cancellation-policy"
                className="text-mitti-brown font-medium hover:text-mitti-dark-brown"
              >
                Cancellation Policy
              </Link>
              . Users are encouraged to review the applicable policy before
              confirming a booking.
            </p>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              Limitation of liability
            </h2>
            <p>
              MITTI acts as a platform facilitator and does not directly own or
              operate homestay properties. While reasonable care is taken to
              ensure platform reliability, MITTI is not liable for issues
              arising from host services, traveller conduct, or external
              circumstances.
            </p>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              Platform availability
            </h2>
            <p>
              MITTI strives to maintain consistent platform availability.
              However, temporary interruptions may occur due to maintenance,
              updates, or technical limitations.
            </p>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              Modifications to the service
            </h2>
            <p>
              Features, workflows, or policies may be updated over time to
              improve platform functionality or align with academic objectives.
              Continued use of the platform indicates acceptance of such
              changes.
            </p>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              Governing context
            </h2>
            <p>
              These Terms of Service are intended for academic and demonstrative
              purposes and do not constitute a legally binding commercial
              agreement.
            </p>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              Contact
            </h2>
            <p>
              For questions related to these Terms of Service, users may contact
              the MITTI team via the{" "}
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
