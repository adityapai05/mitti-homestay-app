import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-mitti-beige w-full">
      <section className="px-4 sm:px-6 py-12 flex justify-center">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-widest text-mitti-brown mb-4">
              Privacy Policy
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-mitti-dark-brown">
              Your privacy matters to us
            </h1>
          </div>

          {/* Content */}
          <div className="space-y-6 px-4 sm:px-0 text-mitti-dark-brown/80 leading-relaxed text-base">
            <p>
              MITTI is committed to respecting and protecting the privacy of its
              users. This Privacy Policy explains how information is collected,
              used, and handled when you interact with the platform.
            </p>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              Information we collect
            </h2>
            <p>
              We may collect personal information such as your name, email
              address, and other details you voluntarily provide while using the
              platform, including when submitting forms or creating an account.
            </p>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              How information is used
            </h2>
            <p>
              Information collected is used solely for platform-related
              purposes, including communication, account management, improving
              user experience, and supporting platform functionality.
            </p>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              Data storage and security
            </h2>
            <p>
              Reasonable technical and organizational measures are implemented
              to protect stored data. While every effort is made to ensure data
              security, no system can guarantee absolute protection.
            </p>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              Data sharing
            </h2>
            <p>
              MITTI does not sell or share personal data with third parties for
              marketing purposes. Information may only be shared when required
              for platform functionality or legal compliance.
            </p>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              Academic nature of the platform
            </h2>
            <p>
              MITTI is an academic project developed as part of a Bachelor of
              Science in Information Technology program. Data collected is used
              strictly for educational and platform demonstration purposes.
            </p>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              Changes to this policy
            </h2>
            <p>
              This Privacy Policy may be updated periodically to reflect changes
              in platform functionality or requirements. Continued use of the
              platform indicates acceptance of the updated policy.
            </p>

            <h2 className="text-lg font-semibold text-mitti-dark-brown">
              Contact
            </h2>
            <p>
              If you have questions regarding this Privacy Policy, you may reach
              out via the{" "}
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
