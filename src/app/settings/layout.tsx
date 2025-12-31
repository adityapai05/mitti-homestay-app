"use client";

import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/prebuilt-components/sidebar";
import SettingsHeader from "./_components/SettingsHeader";
import SettingsSidebar from "./_components/SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <SidebarProvider defaultOpen>
      <div className="flex w-full bg-mitti-beige">
        {/* Sidebar */}
        <SettingsSidebar />

        {/* Content */}
        <SidebarInset className="flex min-h-screen flex-col">
        <SettingsHeader />

          <main className="flex-1 px-6 py-10">
            {/* Wider than before to reduce whitespace */}
            <div className="max-w-4xl mx-auto space-y-12">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
