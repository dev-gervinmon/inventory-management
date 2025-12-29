"use client";

import { usePathname } from "next/navigation";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";

import { TopNavBarSkeleton } from "@/components/skeletons";
import Sidebar from "@/components/layout/sidebar-unified";
import { useState } from "react";
import clsx from "clsx";

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
        className={clsx(
          "flex-1 px-4 sm:px-6 md:px-8 py-4 mt-16",
          "transition-[margin-left] duration-300 ease-in-out",
          // Desktop sidebar spacing only
          collapsed ? "lg:ml-15" : "lg:ml-40",
          // Mobile: no margin
          "ml-0"
        )}
      >
        <DashboardSkeleton />
      </main>
    </div>
  );
}
