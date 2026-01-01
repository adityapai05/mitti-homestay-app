import HostDashboardShell from "../_components/HostDashboardShell";

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-mitti-beige">
      <HostDashboardShell>{children}</HostDashboardShell>
    </div>
  );
}
