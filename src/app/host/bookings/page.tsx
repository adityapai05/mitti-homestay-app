import { Suspense } from "react";
import HostBookingsTabs from "../_components/HostBookingsTabs";
import HostBookingsList from "../_components/HostBookingsList";
import HostBookingsLoading from "../_components/HostBookingsLoading";

export default function HostBookingsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-mitti-beige px-4 sm:px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-mitti-dark-brown">
              Your bookings
            </h1>
            <p className="mt-1 text-sm text-mitti-dark-brown/80">
              Review guest requests and manage upcoming and past stays.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <Suspense fallback={null}>
            <HostBookingsTabs />
          </Suspense>
        </div>

        {/* List */}
        <Suspense fallback={<HostBookingsLoading />}>
          <HostBookingsList />
        </Suspense>
      </div>
    </div>
  );
}
