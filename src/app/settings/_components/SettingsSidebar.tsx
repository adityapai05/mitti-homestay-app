"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/prebuilt-components/sidebar";

import { User, Shield, BadgeCheck, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const accountItems = [
  { href: "/settings/profile", label: "Profile", icon: User },
  { href: "/settings/account", label: "Account", icon: Shield },
];

const hostItems = [
  { href: "/settings/verification", label: "Verification", icon: BadgeCheck },
  { href: "/settings/payouts", label: "Payouts", icon: Wallet },
];

export default function SettingsSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const renderItem = (item: {
    href: string;
    label: string;
    icon: LucideIcon;
  }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;

    return (
      <SidebarMenuItem key={item.href}>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          onClick={() => isMobile && setOpenMobile(false)}
          className={`
            rounded-xl px-4 py-2.5 transition
            hover:bg-mitti-beige
            ${
              isActive
                ? "bg-mitti-beige text-mitti-dark-brown font-medium"
                : "text-mitti-dark-brown/70"
            }
          `}
        >
          <Link href={item.href} className="flex items-center gap-3">
            <Icon size={18} className="shrink-0" />
            <span className="text-sm">{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar
      variant="sidebar"
      collapsible="offcanvas"
      className="bg-mitti-cream border-r border-mitti-khaki px-3 pt-20"
    >
      <SidebarContent className="flex flex-col gap-10">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs tracking-wide text-mitti-dark-brown/50">
            ACCOUNT
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2">
              {accountItems.map(renderItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs tracking-wide text-mitti-dark-brown/50">
            HOST
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2">
              {hostItems.map(renderItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
