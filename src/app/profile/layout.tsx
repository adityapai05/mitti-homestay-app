import { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import HostNavbar from "@/components/host/HostNavbar";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

interface ProfileLayoutProps {
  children: ReactNode;
}

export default async function ProfileLayout({ children }: ProfileLayoutProps) {
  const currentUser = await getCurrentUser();

  return (
    <div className="min-h-screen bg-mitti-beige">
      {/* Navbar */}
      {currentUser?.role === "HOST" ? <HostNavbar /> : <Navbar />}

      {/* Page container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="rounded-2xl border border-mitti-khaki bg-mitti-cream p-6 sm:p-10 shadow-sm">
          {children}
        </div>
      </main>

      {/* Footer */}
      {currentUser?.role === "USER" ? <Footer /> : null}
    </div>
  );
}
