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
      className="lg:hidden inline-flex items-center justify-center rounded-2xl p-2.5 text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-elevated)/70 ring-1 ring-(--border-subtle) focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}
