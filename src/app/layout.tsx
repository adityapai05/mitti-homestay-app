import "./globals.css";
import "leaflet/dist/leaflet.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/prebuilt-components/sonner";
import AuthProvider from "@/components/shared/AuthProvider";
import GlobalModals from "@/components/auth/GlobalModals";
import ClientBoot from "@/components/system/ClientBoot";

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
      <body className={poppins.className} suppressHydrationWarning>
        <ClientBoot />
        <Providers>
          <AuthProvider />
          <Toaster />
          {children}
          <GlobalModals />
        </Providers>
      </body>
    </html>
  );
}
