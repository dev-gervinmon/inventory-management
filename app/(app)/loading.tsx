"use client";

import { usePathname } from "next/navigation";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";

import { TopNavBarSkeleton } from "@/components/skeletons";
import Sidebar from "@/components/layout/sidebar-unified";
import { useState } from "react";

export default function Loading() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const showSidebar = !["/", "/sign-in", "/sign-up"].includes(pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavBarSkeleton />
      {showSidebar && (
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
      )}
      <main
        className={
          "px-4 sm:px-6 md:px-8 py-2 sm:py-4 md:py-8 mt-16 sm:mt-16 lg:mt-12"
        }
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
        <DashboardSkeleton />
      </main>
    </div>
  );
}
