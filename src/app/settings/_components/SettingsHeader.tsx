"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

export default function SettingsHeader({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 h-14 border-b border-mitti-khaki bg-mitti-cream px-6 flex items-center justify-between md:justify-end">
      <button
        onClick={onMenuClick}
        className="md:hidden rounded-md p-2 hover:bg-mitti-beige"
      >
        <Menu size={18} />
      </button>

      <Link
        href="/"
        className="rounded-full bg-mitti-beige px-5 py-2 text-sm font-medium text-mitti-dark-brown hover:bg-mitti-khaki transition"
      >
        Done
      </Link>
    </header>
  );
}
