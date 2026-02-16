"use client";

import {
  ChevronDownIcon,
  BookOpenIcon,
  UserPenIcon,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/prebuilt-components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/prebuilt-components/dropdown-menu";

import Image from "next/image";
import Link from "next/link";
import { useUserStore } from "@/stores/useUserStore";
import { toast } from "sonner";
import { logout } from "@/lib/firebase/authActions";
import { useRouter } from "next/navigation";

export default function UserDropdown() {
  const router = useRouter();
  async function handleLogout() {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.refresh();
      router.replace("/");
    } catch {
      toast.error("Failed to logout");
    }
  }

  const user = useUserStore((state) => state.user);

  const displayName = user?.name || user?.email || user?.phone || "User";
  const avatarUrl = user?.image || "/default-avatar.png";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer"
        >
          <Image
            src={avatarUrl}
            alt="User Avatar"
            width={28}
            height={28}
            className="rounded-full object-cover"
          />
          <span className="hidden sm:block font-medium text-sm max-w-[100px] truncate">
            {displayName}
          </span>
          <ChevronDownIcon size={18} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 bg-mitti-cream text-mitti-dark-brown border border-mitti-dark-brown shadow-xl"
      >
        <DropdownMenuLabel className="flex items-center gap-3 px-3 py-2">
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={30}
            height={30}
            className="rounded-full object-cover"
          />
          <div className="flex flex-col ">
            <span className="text-sm font-medium truncate text-mitti-dark-brown">
              {displayName}
            </span>
            {user && (
              <span className="text-xs truncate text-mitti-dark-brown">
                {user.email ? user.email : user.phone}
              </span>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-mitti-dark-brown/70" />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="/bookings"
              className="flex items-center gap-2 cursor-pointer"
            >
              <BookOpenIcon size={16} className="opacity-60" />
              <span>My Bookings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/settings"
              className="flex items-center gap-2 cursor-pointer"
            >
              <UserPenIcon size={16} className="opacity-60" />
              <span>Account Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-mitti-dark-brown/70" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 hover:!bg-red-100 cursor-pointer"
        >
          <LogOut size={16} className="opacity-60" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
