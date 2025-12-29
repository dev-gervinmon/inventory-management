"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar-unified";
import clsx from "clsx";

export default function AppShellClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main
        className={clsx(
          "flex-1 px-4 sm:px-6 md:px-8 py-4 mt-16",
          "transition-[margin-left] duration-300 ease-in-out",
          // Desktop sidebar spacing only
          collapsed ? "lg:ml-20" : "lg:ml-40",
          // Mobile: no margin
          "ml-0"
        )}
      >
        {children}
      </main>
    </div>
  );
}
