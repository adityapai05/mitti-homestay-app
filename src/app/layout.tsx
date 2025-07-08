import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MITTI",
  description: "Rural Homestay Booking Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
