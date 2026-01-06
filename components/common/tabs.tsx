"use client";

import { useState, ReactNode, createContext, useContext } from "react";

export interface Tab {
  id: string;
  label: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string; // controlled
  defaultTabId?: string; // uncontrolled
  onTabChange?: (tabId: string) => void;
  children: ReactNode;
}

const TabContext = createContext<string>("");

export default function Tabs({
  tabs,
  activeTab: controlledActiveTab,
  defaultTabId,
  onTabChange,
  children,
}: TabsProps) {
  const [uncontrolledActiveTab, setUncontrolledActiveTab] = useState(
    defaultTabId || tabs[0]?.id || ""
  );
  const isControlled = controlledActiveTab !== undefined;
  const activeTab = isControlled ? controlledActiveTab : uncontrolledActiveTab;

  const handleTabChange = (tabId: string) => {
    if (!isControlled) setUncontrolledActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation - always on its own row */}
      <div className="w-full border-b border-(--border-subtle) bg-transparent sticky top-0 z-10">
        <div className="flex gap-0 min-w-full overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 px-2 py-2 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40 ${
                activeTab === tab.id
                  ? "bg-(--surface-elevated)/30 text-(--text-primary) border-b-2 border-(--brand)"
                  : "text-(--text-muted) hover:text-(--text-primary) hover:bg-(--surface-elevated)/20 border-b-2 border-transparent"
              }`}
              style={{ minWidth: 80, touchAction: "manipulation" }}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content - Pass activeTab via context */}
      <div className="w-full">
        <TabContext.Provider value={activeTab}>{children}</TabContext.Provider>
      </div>
    </div>
  );
}

export function TabPanel({
  tabId,
  children,
}: {
  tabId: string;
  children: ReactNode;
}) {
  const activeTab = useContext(TabContext);
  return (
    <div style={{ display: tabId === activeTab ? "block" : "none" }}>
      {children}
    </div>
  );
}
