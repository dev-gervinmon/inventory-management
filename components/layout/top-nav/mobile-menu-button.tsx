"use client";
import { Menu } from "lucide-react";
import { useSidebar } from "../sidebar/sidebar-context";

export default function MobileMenuButton() {
  const { openSidebar } = useSidebar();
  return (
    <button
      type="button"
      onClick={openSidebar}
      aria-label="Open menu"
      className="lg:hidden inline-flex items-center justify-center rounded-2xl p-2.5 text-gray-200 hover:text-white hover:bg-white/6 ring-1 ring-white/12 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}
