"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface RetroTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export function RetroTabs({ tabs, defaultTab, className }: RetroTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id);

  const active = tabs.find(t => t.id === activeTab);

  return (
    <div className={cn("w-full", className)}>
      {/* Tab headers */}
      <div className="flex items-end border-b-0" style={{ borderBottom: '1px solid #808080' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "tab-retro border border-[#808080]",
              tab.id === activeTab && "active",
              tab.id !== activeTab && "border-b-0"
            )}
          >
            {tab.label}
          </button>
        ))}
        {/* Fill remaining space */}
        <div className="flex-1 border-b border-[#808080]" style={{ height: '1px', alignSelf: 'flex-end' }} />
      </div>

      {/* Tab content panel */}
      <div className="win-panel border-t-0 p-4">
        {active?.content}
      </div>
    </div>
  );
}
