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
  ChevronLeft,
  ChevronRight,
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
      className={`bg-gray-900 text-white min-h-screen z-30 transition-all duration-200 ${
        collapsed ? "w-20 p-2" : "w-64 p-6"
      } hidden lg:flex flex-col fixed left-0 top-0`}
    >
      <div
        className={`mb-8 flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "space-x-2 mb-4"
          }`}
        >
          <BarChart3 className="w-7 h-7" />
          {!collapsed && (
            <span className="text-lg font-semibold">Inventory App</span>
          )}
        </div>
        <button
          className={`ml-2 p-1 rounded hover:bg-gray-800 transition ${
            collapsed ? "" : "self-start"
          }`}
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
      <nav className="space-y-1">
        <div
          className={`text-sm font-semibold text-gray-400 uppercase ${
            collapsed ? "text-center" : "mb-2"
          }`}
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
                collapsed ? "justify-center" : "space-x-3"
              } py-2 px-3 rounded-lg transition-all duration-150 ${
                isActive
                  ? "bg-purple-100 text-gray-800"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
              title={collapsed ? item.name : undefined}
            >
              <IconComponent className="w-5 h-5" />
              {!collapsed && <span className="text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
      <div
        className={`absolute bottom-0 left-0 right-0 border-t border-gray-700 ${
          collapsed ? "p-2" : "p-6"
        }`}
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
