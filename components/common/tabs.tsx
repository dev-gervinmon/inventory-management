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
      <div className="w-full border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex gap-0 min-w-full overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                activeTab === tab.id
                  ? "border-b-2 border-purple-600 text-purple-600 bg-gray-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b-2 border-transparent"
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
