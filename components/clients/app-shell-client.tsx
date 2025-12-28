"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar-unified";

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
        className="flex-1 px-4 sm:px-6 md:px-8 py-4 mt-16"
        style={{
          transition: "margin-left 0.45s cubic-bezier(0.4,0,0.2,1)",
          marginLeft:
            typeof window !== "undefined" && window.innerWidth < 1024
              ? 0
              : collapsed
              ? "5rem"
              : "10rem",
        }}
      >
        {children}
      </main>
    </div>
  );
}
