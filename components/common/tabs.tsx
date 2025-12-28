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
      <div className="w-full border-b border-gray-100 dark:border-gray-800 bg-transparent sticky top-0 z-10">
        <div className="flex gap-0 min-w-full overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 px-2 py-2 text-xs font-semibold rounded-t-lg transition-all whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                activeTab === tab.id
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-b-2 border-purple-500"
                  : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 border-b-2 border-transparent"
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
