"use client";

import { useState } from "react";
import SettingsSidebar from "./_components/SettingsSidebar";
import SettingsHeader from "./_components/SettingsHeader";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <SettingsSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col">
        <SettingsHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
