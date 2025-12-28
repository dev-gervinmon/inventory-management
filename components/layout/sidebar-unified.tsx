"use client";

import { useState } from "react";
import { UserButton } from "@stackframe/stack";
import {
  BarChart3,
  Package,
  Plus,
  Settings,
  Tag,
  Activity,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Add Product", href: "/add-product", icon: Plus },
  { name: "Categories", href: "/categories", icon: Tag },
  { name: "Activities", href: "/activities", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({
  currentPath = "/dashboard",
}: {
  currentPath: string;
}) {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Desktop Sidebar
  const sidebarContent = (
    <div
      className={`bg-gray-900 cursor-pointer text-white min-h-screen p-3 z-30 hidden lg:flex flex-col fixed left-0 top-0 group ${
        collapsed ? "sidebar-collapsed" : "sidebar-expanded"
      }`}
      onClick={(e) => {
        // Only expand/collapse if not clicking a link or its children
        if (!(e.target instanceof HTMLElement)) return;
        const isLink = e.target.closest("a");
        if (!isLink) setCollapsed((c) => !c);
      }}
      style={{
        transition:
          "width 0.6s cubic-bezier(0.4,0,0.2,1), padding 0.6s cubic-bezier(0.4,0,0.2,1)",
      }}
      tabIndex={0}
      role="button"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      <div
        className={`mb-10 flex items-center ${
          collapsed ? "justify-center" : "space-x-3"
        }`}
        style={{ minWidth: 0 }}
      >
        <BarChart3 className="w-8 h-8 flex-shrink-0" />
        <span
          className={`text-xl font-bold tracking-wide transition-all duration-600 ease-in-out flex-shrink-0 overflow-hidden whitespace-nowrap ${
            collapsed ? "max-w-0 opacity-0" : "max-w-[180px] opacity-100 ml-2"
          }`}
          style={{ minWidth: 0 }}
        >
          Inventory App
        </span>
      </div>
      <nav className="space-y-3">
        <div
          className={`text-xs font-semibold text-gray-400 uppercase tracking-wider ${
            collapsed ? "text-center" : "mb-4"
          } transition-all duration-500 ease-in-out`}
        >
          {!collapsed && "Inventory"}
        </div>
        {navigation.map((item, key) => {
          const IconComponent = item.icon;
          const isActive = currentPath === item.href;
          return (
            <Link
              href={item.href}
              key={key}
              className={`flex items-center ${
                collapsed ? "justify-center" : "space-x-4"
              } py-3 px-4 rounded-lg transition-all duration-150 text-base font-medium ${
                isActive
                  ? "bg-purple-100 text-gray-800"
                  : "text-gray-300 hover:bg-gray-800"
              } mb-2`}
              title={collapsed ? item.name : undefined}
            >
              <IconComponent className="w-6 h-6" />
              <span
                className={`transition-all duration-600 ease-in-out flex-shrink-0 overflow-hidden whitespace-nowrap align-middle
                  ${
                    collapsed
                      ? "max-w-0 opacity-0"
                      : "max-w-[120px] opacity-100 ml-2"
                  }`}
                style={{ minWidth: 0, verticalAlign: "middle" }}
                aria-hidden={collapsed}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
      <div
        className={`absolute bottom-0 left-0 right-0 border-t border-gray-700 ${
          collapsed ? "p-3" : "p-8"
        } mt-6`}
      >
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          <UserButton showUserInfo />
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar (Drawer)
  const mobileSidebar = (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white z-40 p-4 flex items-center justify-between">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-6 h-6" />
          <span className="text-lg font-semibold">Inventory</span>
        </div>
      </div>
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/20 z-20"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed left-0 top-0 bottom-0 bg-gray-900 text-white w-64 z-30 transform transition-transform duration-300 ease-in-out">
            <div className="p-6 pt-20">
              <nav className="space-y-1">
                <div className="text-sm font-semibold text-gray-400 uppercase mb-2">
                  Inventory
                </div>
                {navigation.map((item, key) => {
                  const IconComponent = item.icon;
                  const isActive = currentPath === item.href;
                  return (
                    <Link
                      href={item.href}
                      key={key}
                      className={`flex items-center space-x-3 py-3 px-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-purple-100 text-gray-800"
                          : "text-gray-300 hover:bg-gray-800"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <IconComponent className="w-5 h-5 shrink-0" />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <UserButton showUserInfo />
              </div>
            </div>
            <button
              className="absolute top-4 right-4 p-2 rounded hover:bg-gray-800"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </>
      )}
    </>
  );

  return (
    <>
      {sidebarContent}
      {mobileSidebar}
    </>
  );
}
