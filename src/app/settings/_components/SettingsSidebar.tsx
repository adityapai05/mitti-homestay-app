"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Shield, BadgeCheck, Wallet, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const accountItems = [
  { href: "/settings/profile", label: "Profile", icon: User },
  { href: "/settings/account", label: "Account", icon: Shield },
];

const hostItems = [
  { href: "/settings/verification", label: "Verification", icon: BadgeCheck },
  { href: "/settings/payouts", label: "Payouts", icon: Wallet },
];

export default function SettingsSidebar({ open, onClose }: Props) {
  const pathname = usePathname();

  const renderItem = (item: {
    href: string;
    label: string;
    icon: React.ElementType;
  }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClose}
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
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 w-64
        bg-mitti-cream border-r border-mitti-khaki
        transform transition-transform duration-200
        md:static md:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex h-full flex-col px-4 py-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/mitti-logo-icon.png"
              alt="MITTI"
              width={40}
              height={40}
            />
            <div>
              <p className="text-sm font-semibold text-mitti-dark-brown">
                MITTI
              </p>
              <p className="text-xs text-mitti-dark-brown/70">
                Account Settings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden rounded-md p-2 hover:bg-mitti-beige"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <div className="space-y-6 overflow-y-auto">
          <div>
            <p className="px-3 pb-2 text-xs tracking-wide text-mitti-dark-brown/50">
              ACCOUNT
            </p>
            <nav className="space-y-1">{accountItems.map(renderItem)}</nav>
          </div>

          <div>
            <p className="px-3 pb-2 text-xs tracking-wide text-mitti-dark-brown/50">
              HOST
            </p>
            <nav className="space-y-1">{hostItems.map(renderItem)}</nav>
          </div>
        </div>
      </div>
    </aside>
  );
}
