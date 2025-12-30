import HostDashboardTabs from "./HostDashboardTabs";

export default function HostDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-mitti-dark-brown">
            Hosting dashboard
          </h1>
          <p className="mt-1 text-sm text-mitti-dark-brown/70">
            Manage your homestays and guest bookings.
          </p>
        </div>

        {/* Tabs */}
        <HostDashboardTabs />

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
