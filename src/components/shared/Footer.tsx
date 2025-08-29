import Image from "next/image";
import NewsletterForm from "./NewsletterForm";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-mitti-brown text-mitti-beige px-6 py-5">
      <NewsletterForm />
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm px-4 mt-8 text-center">
        <div>
          <h4 className="font-semibold text-lg mb-3">About Us</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/who-we-are">Who We Are</Link>
            </li>
            <li>
              <Link href="/mission">Our Mission</Link>
            </li>
            <li>
              <Link href="/vision">Our Vision</Link>
            </li>
            <li>
              <Link href="/objectives">Our Objectives</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-3">Explore</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/explore">Homestays</Link>
            </li>
            <li>
              <Link href="/list-your-home">Become a Host</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-3">Support</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
            <li>
              <Link href="/terms">Terms of Service</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/cancellation">Cancellation Policy</Link>
            </li>
          </ul>
        </div>
<div className="flex flex-col items-center text-center">
  <h4 className="font-semibold text-lg mb-2">Connect</h4>

  <div className="bg-mitti-beige rounded-xl px-3 py-2 mb-4 h-10 w-25 flex items-center justify-center">
    <Image
      src="/mitti-logo.png"
      alt="Mitti Logo"
      width={65}
      height={25}
      className="h-auto w-auto object-contain"
      priority
    />
  </div>

  <ul className="space-y-2">
    <li>
      <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
        Instagram
      </Link>
    </li>
    <li>
      <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
        LinkedIn
      </Link>
    </li>
  </ul>
</div>

      </div>

      <div className="text-center mt-10">
        © 2025 <strong>MITTI</strong>. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
