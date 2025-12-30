"use client";

import { useSearchParams, useRouter } from "next/navigation";

const tabs = [
  { label: "Pending", value: "pending" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Past", value: "past" },
];

export default function HostBookingsTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const active = searchParams.get("tab") ?? "pending";

  function setTab(tab: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`/host/bookings?${params.toString()}`);
  }

  return (
    <div className="mt-6">
      {/* Label */}
      <p className="mb-2 text-sm font-medium text-mitti-dark-brown/70">
        Filter by status
      </p>

      {/* Segmented control */}
      <div className="inline-flex rounded-xl bg-mitti-cream p-1">
        {tabs.map((tab) => {
          const isActive = tab.value === active;

          return (
            <button
              key={tab.value}
              onClick={() => setTab(tab.value)}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-all cursor-pointer
                ${
                  isActive
                    ? "bg-white text-mitti-dark-brown shadow-sm"
                    : "text-mitti-dark-brown/60 hover:text-mitti-dark-brown"
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
