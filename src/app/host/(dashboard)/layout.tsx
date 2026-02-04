import HostNavbar from "@/components/host/HostNavbar";
import HostDashboardShell from "../_components/HostDashboardShell";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { Role } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== Role.HOST) {
    notFound();
  }
  return (
    <div className="min-h-screen bg-mitti-beige">
      <HostNavbar />
      <HostDashboardShell>{children}</HostDashboardShell>
    </div>
  );
}
