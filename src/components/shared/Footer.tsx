import Image from "next/image";
import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

const Footer = () => {
  return (
    <footer className="bg-mitti-brown text-mitti-beige px-6 py-8">
      <NewsletterForm />

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm px-4 mt-10">
        {/* About */}
        <div>
          <h4 className="font-semibold text-lg mb-3">About</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="hover:underline">
                About MITTI
              </Link>
            </li>
            <li>
              <Link href="/about/who-we-are" className="hover:underline">
                Who We Are
              </Link>
            </li>
            <li>
              <Link href="/about/mission" className="hover:underline">
                Mission
              </Link>
            </li>
            <li>
              <Link href="/about/vision" className="hover:underline">
                Vision
              </Link>
            </li>
            <li>
              <Link href="/about/objectives" className="hover:underline">
                Objectives
              </Link>
            </li>
          </ul>
        </div>

        {/* Explore */}
        <div>
          <h4 className="font-semibold text-lg mb-3">Explore</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/explore" className="hover:underline">
                Homestays
              </Link>
            </li>
            <li>
              <Link href="/host/start" className="hover:underline">
                Become a Host
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold text-lg mb-3">Support</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/cancellation" className="hover:underline">
                Cancellation Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Connect */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-mitti-beige rounded-xl px-3 py-2 mb-4 flex items-center justify-center">
            <Image
              src="/mitti-logo-icon.png"
              alt="MITTI logo"
              width={40}
              height={15}
              className="object-contain"
              priority
            />
          </div>

          <p className="text-xs text-mitti-beige/90 leading-relaxed">
            MITTI is an academic project developed as part of the B. Sc. I.T.
            program. It focuses on promoting rural tourism through a simple,
            ethical, and community oriented platform.
          </p>
        </div>
      </div>

      <div className="text-center mt-10 text-mitti-beige/90">
        © 2025 <strong>MITTI</strong>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
