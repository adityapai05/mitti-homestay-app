"use client";

import { ServerUser } from "@/types";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/firebase/authActions";
import { toast } from "sonner";

export default function AdminHeader({ admin }: { admin: ServerUser }) {
  return (
    <header className="h-14 border-b border-mitti-khaki bg-mitti-cream px-6 flex items-center justify-end">
      <div className="flex items-center gap-4">
        <div className="text-right leading-tight">
          <p className="text-sm font-medium text-mitti-dark-brown">
            {admin.name}
          </p>
          <p className="text-xs text-mitti-dark-brown/70">Administrator</p>
        </div>

        <div className="h-9 w-9 rounded-full bg-mitti-khaki flex items-center justify-center text-sm font-semibold text-mitti-dark-brown">
          {admin.name.charAt(0)}
        </div>

        <button
          onClick={async () => {
            await logout();
            toast.success("Logged out successfully");
          }}
          className="text-mitti-dark-brown/70 hover:text-mitti-error transition"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
