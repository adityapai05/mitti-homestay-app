import HostNavbar from "@/components/host/HostNavbar";
import HostDashboardShell from "./_components/HostDashboardShell";

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-mitti-beige">
      <HostNavbar />
      <HostDashboardShell>{children}</HostDashboardShell>
    </div>
  );
}
