"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Homestays", href: "/host/homestays" },
  { label: "Bookings", href: "/host/bookings" },
];

export default function HostDashboardTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 border-b border-mitti-khaki">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
              ${
                active
                  ? "bg-white text-mitti-dark-brown border border-b-0 border-mitti-khaki"
                  : "text-mitti-dark-brown/60 hover:text-mitti-dark-brown"
              }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
