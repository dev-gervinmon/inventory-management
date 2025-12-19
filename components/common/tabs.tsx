"use client";

import { useState, ReactNode, createContext, useContext } from "react";

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  onTabChange?: (tabId: string) => void;
  children: ReactNode;
}

const TabContext = createContext<string>("");

export default function Tabs({
  tabs,
  defaultTabId,
  onTabChange,
  children,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0]?.id || "");

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b-2 border-transparent"
              }`}
            >
              <div className="flex items-center gap-2">
                {tab.icon && <span>{tab.icon}</span>}
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content - Pass activeTab via context */}
      <TabContext.Provider value={activeTab}>{children}</TabContext.Provider>
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
