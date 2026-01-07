"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BadgeCheck,
  Home,
  Wallet,
  Users,
  BarChart3,
  ScrollText,
  Mail,
  RotateCcw,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  {
    label: "Host Verification",
    href: "/admin/verification/hosts",
    icon: BadgeCheck,
  },
  {
    label: "Homestay Verification",
    href: "/admin/verification/homestays",
    icon: Home,
  },
  { label: "Payouts", href: "/admin/payouts", icon: Wallet },
  { label: "Refunds", href: "/admin/refunds", icon: RotateCcw },
  { label: "Contact Messages", href: "/admin/contact", icon: Mail },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Listings", href: "/admin/homestays", icon: Home },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-mitti-khaki bg-mitti-cream px-4 py-6">
      {/* Brand */}
      <div className="mb-8 flex items-center gap-3">
        <Image
          src="/mitti-logo-icon.png"
          alt="MITTI"
          width={40}
          height={40}
          className="object-contain"
        />
        <div>
          <p className="text-sm font-semibold text-mitti-dark-brown">
            MITTI Admin
          </p>
          <p className="text-xs text-mitti-dark-brown/70">
            Platform Control Panel
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition
                ${
                  isActive
                    ? "bg-mitti-beige font-semibold text-mitti-dark-brown"
                    : "text-mitti-dark-brown/80 hover:bg-mitti-beige"
                }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
