import Link from "next/link";
import {
  Shield,
  CheckCircle,
  Wallet,
  Users,
  Home,
  BarChart3,
} from "lucide-react";

const navItems = [
  {
    label: "Overview",
    href: "/admin",
    icon: Shield,
  },
  {
    label: "Host Verification",
    href: "/admin/verification/hosts",
    icon: CheckCircle,
  },
  {
    label: "Homestay Verification",
    href: "/admin/verification/homestays",
    icon: Home,
  },
  {
    label: "Payouts",
    href: "/admin/payouts",
    icon: Wallet,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Listings",
    href: "/admin/homestays",
    icon: Home,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 border-r border-mitti-khaki bg-mitti-cream px-4 py-6">
      <div className="mb-8">
        <p className="text-lg font-semibold text-mitti-dark-brown">
          MITTI Admin
        </p>
        <p className="text-xs text-mitti-dark-brown/70">
          Platform Control Panel
        </p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-mitti-dark-brown hover:bg-mitti-beige transition"
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
