import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import AuthProvider from "@/components/shared/AuthProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MITTI | Book Authentic Rural Homestays in India",
  description: "Rural Homestay Booking Platform",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Providers>
          <Navbar />
          <AuthProvider />
          <Toaster
            richColors
            position="top-center"
            theme="light"
            toastOptions={{
              className:
                "bg-mitti-beige border border-mitti-olive text-mitti-dark-brown shadow-xl rounded-xl px-4 py-3",
              descriptionClassName: "text-sm text-mitti-olive",
              duration: 3000,
            }}
          />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
