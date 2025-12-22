"use client";

import { UserButton } from "@stackframe/stack";
import { BarChart3, Package, Plus, Settings, Tag, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/skeletons/skeleton";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";

function LoadingSideBar() {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Add Product", href: "/add-product", icon: Plus },
    { name: "Categories", href: "/categories", icon: Tag },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Hamburger Header - only on mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white z-40 p-4 flex items-center justify-between">
        <button
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-6 h-6" />
          <span className="text-lg font-semibold">Inventory</span>
        </div>
      </div>

      {/* Desktop Sidebar - only on md+ */}
      <div className="hidden md:fixed md:left-0 md:top-0 md:block bg-gray-900 text-white w-64 min-h-screen p-6 z-10">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-7 h-7" />
            <span className="text-lg font-semibold">Inventory App</span>
          </div>
        </div>

        <nav className="space-y-1">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Inventory
          </div>

          {navigation.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors hover:bg-gray-800 text-gray-300"
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="ml-3">
              <UserButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MainContentSkeleton({
  showSidebar = true,
}: {
  showSidebar?: boolean;
}) {
  return (
    <main
      className={
        showSidebar
          ? "md:ml-64 px-4 sm:px-6 md:px-8 py-2 sm:py-4 md:py-8 pt-20 sm:pt-24 md:pt-8"
          : "px-4 sm:px-6 md:px-8 py-2 sm:py-4 md:py-8"
      }
    >
      <DashboardSkeleton />
    </main>
  );
}

export default function Loading() {
  const pathname = usePathname();

  const showSidebar = !["/", "/sign-in", "/sign-up"].includes(pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {showSidebar && <LoadingSideBar />}
      <MainContentSkeleton showSidebar={showSidebar} />
    </div>
  );
}
