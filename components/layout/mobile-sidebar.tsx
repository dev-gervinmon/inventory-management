"use client";

import { useState } from "react";
import { UserButton } from "@stackframe/stack";
import { BarChart3, Package, Plus, Settings, Tag, X, Menu } from "lucide-react";
import Link from "next/link";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Add Product", href: "/add-product", icon: Plus },
  { name: "Categories", href: "/categories", icon: Tag },
  { name: "Settings", href: "/settings", icon: Settings },
];

function SidebarContent({ currentPath }: { currentPath: string }) {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-7 h-7" />
          <span className="text-lg font-semibold">Inventory App</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        <div className="text-sm font-semibold text-gray-400 uppercase">
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
            >
              <IconComponent className="w-5 h-5 shrink-0" />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default function MobileSidebar({
  currentPath = "/dashboard",
}: {
  currentPath: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar - Always Visible */}
      <div className="hidden md:fixed md:left-0 md:top-0 md:block bg-gray-900 text-white w-64 min-h-screen p-6 z-30">
        <SidebarContent currentPath={currentPath} />
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <UserButton showUserInfo />
          </div>
        </div>
      </div>

      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white z-40 p-4 flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-6 h-6" />
          <span className="text-lg font-semibold">Inventory</span>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={`md:hidden fixed left-0 top-0 bottom-0 bg-gray-900 text-white w-64 z-30 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 pt-20">
          <SidebarContent currentPath={currentPath} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <UserButton showUserInfo />
          </div>
        </div>
      </div>
    </>
  );
}
