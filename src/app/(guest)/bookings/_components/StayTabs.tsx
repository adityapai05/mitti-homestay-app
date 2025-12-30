"use client";

import { useState } from "react";
import StayList from "./StayList";

type TabType = "upcoming" | "past";

export default function StayTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");

  const tabs: TabType[] = ["upcoming", "past"];

  return (
    <section className="space-y-6">
      <div className="flex gap-6 border-b border-mitti-khaki">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium cursor-pointer ${
              activeTab === tab
                ? "text-mitti-brown border-b-2 border-mitti-brown"
                : "text-mitti-dark-brown/60 hover:text-mitti-dark-brown"
            }`}
          >
            {tab === "upcoming" ? "Upcoming stays" : "Past stays"}
          </button>
        ))}
      </div>

      <StayList type={activeTab} />
    </section>
  );
}
