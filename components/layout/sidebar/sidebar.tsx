"use client";

import {
  BarChart3,
  Package,
  Plus,
  Settings,
  Tag,
  Activity,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { useSidebar } from "./sidebar-context";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Add Product", href: "/add-product", icon: Plus },
  { name: "Categories", href: "/categories", icon: Tag },
  { name: "Activities", href: "/activities", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const {
    isSidebarOpen: mobileOpen,
    closeSidebar,
    isDesktopCollapsed: collapsed,
    expandDesktop,
    collapseDesktop,
  } = useSidebar();
  const desktopSidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mobileOpen) closeSidebar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (collapsed) return;
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(min-width: 1024px)");
    if (!media.matches) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      const root = desktopSidebarRef.current;
      if (!root) return;
      if (root.contains(target)) return;
      collapseDesktop();
    }

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [collapsed, collapseDesktop]);

  const navItems = useMemo(
    () =>
      navigation.map((item) => ({
        ...item,
        isActive: pathname === item.href,
      })),
    [pathname]
  );

  // Desktop Sidebar
  const sidebarContent = (
    <aside
      className={`hidden lg:flex fixed left-0 top-(--top-nav-height) z-30 flex-col text-white ${
        collapsed
          ? "w-(--sidebar-width-collapsed)"
          : "w-(--sidebar-width-expanded)"
      }`}
      style={{
        transition: "width 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
      aria-label="Primary"
    >
      <div
        className={`relative h-full min-h-screen bg-gray-950/90 backdrop-blur supports-backdrop-filter:bg-gray-950/75 border-r border-white/10 shadow-xl ${
          collapsed ? "cursor-pointer" : "cursor-default"
        }`}
        ref={desktopSidebarRef}
        onClick={(e) => {
          if (!collapsed) return;
          if (!(e.target instanceof HTMLElement)) return;
          const isInteractive = e.target.closest("a,button");
          if (isInteractive) return;
          expandDesktop();
        }}
        onKeyDown={(e) => {
          if (!collapsed) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            expandDesktop();
          }
        }}
        tabIndex={collapsed ? 0 : -1}
        role={collapsed ? "button" : undefined}
        aria-label={collapsed ? "Expand sidebar" : undefined}
      >
        <div className="absolute right-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-purple-500/30 to-transparent" />

        {collapsed ? (
          <div className="px-2 pt-4">
            <button
              type="button"
              onClick={expandDesktop}
              className="cursor-pointer hidden lg:flex w-full items-center justify-center rounded-2xl py-2.5 text-gray-300 hover:text-white hover:bg-white/6 ring-1 ring-white/12 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-3 pt-4 justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="grid place-items-center w-10 h-10 rounded-xl bg-white/5 ring-1 ring-white/10">
                <BarChart3 className="w-6 h-6 text-purple-300" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold tracking-wide text-white truncate">
                  Inventory App
                </div>
                <div className="text-xs text-gray-400 truncate">Workspace</div>
              </div>
            </div>

            <button
              type="button"
              onClick={collapseDesktop}
              className="cursor-pointer hidden lg:inline-flex items-center justify-center w-10 h-10 rounded-xl text-gray-300 hover:text-white hover:bg-white/6 ring-1 ring-white/12 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className={`${collapsed ? "px-2 mt-3" : "px-3 mt-4"}`}>
          <div
            className={`h-px bg-linear-to-r from-transparent via-white/10 to-transparent ${
              collapsed ? "opacity-60" : "opacity-100"
            }`}
          />
        </div>

        <nav
          className={`${collapsed ? "px-2 pt-3 pb-4" : "px-2 py-4"}`}
          aria-label="Navigation"
        >
          <ul className="space-y-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={item.isActive ? "page" : undefined}
                    title={collapsed ? item.name : undefined}
                    className={`group relative flex items-center rounded-2xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      collapsed
                        ? "w-full justify-around px-2.75 py-4"
                        : "px-3 py-2.5"
                    } ${
                      item.isActive
                        ? "bg-white/9 text-white ring-white/14"
                        : "text-gray-300 hover:text-white hover:bg-white/6"
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-purple-500 transition-opacity ${
                        collapsed
                          ? "opacity-0"
                          : item.isActive
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-40"
                      }`}
                      aria-hidden
                    />

                    <IconComponent
                      aria-hidden
                      className={`shrink-0 transition-colors ${
                        item.isActive
                          ? "text-purple-300"
                          : "text-gray-300 group-hover:text-white"
                      } ${collapsed ? "w-5 h-5" : "w-5 h-5"}`}
                    />

                    <span
                      className={`ml-3 text-sm font-medium tracking-wide whitespace-nowrap overflow-hidden transition-[max-width,opacity,transform] duration-200 ${
                        collapsed
                          ? "max-w-0 opacity-0 -translate-x-1"
                          : "max-w-[180px] opacity-100 translate-x-0"
                      }`}
                      aria-hidden={collapsed}
                    >
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );

  // Mobile Sidebar (Drawer)
  const mobileSidebar = (
    <>
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={mobileOpen ? closeSidebar : undefined}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 max-w-[85vw] bg-gray-950/90 backdrop-blur supports-backdrop-filter:bg-gray-950/75 text-white shadow-2xl border-r border-white/10 transform transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute right-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-purple-500/30 to-transparent" />

        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-10 h-10 rounded-xl bg-white/4 ring-1 ring-white/12">
              <BarChart3 className="w-6 h-6 text-purple-300" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold tracking-wide text-white truncate">
                Inventory App
              </div>
              <div className="text-xs text-gray-400 truncate">Navigation</div>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl p-2.5 text-gray-200 hover:text-white hover:bg-white/6 ring-1 ring-white/12 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 mt-4">
          <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="px-3 py-4">
          <nav aria-label="Navigation">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={item.isActive ? "page" : undefined}
                      className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        item.isActive
                          ? "bg-white/9 text-white ring-1 ring-white/14"
                          : "text-gray-300 hover:text-white hover:bg-white/6"
                      }`}
                      onClick={closeSidebar}
                    >
                      <span
                        className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-purple-500 transition-opacity ${
                          item.isActive
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-40"
                        }`}
                        aria-hidden
                      />

                      <IconComponent
                        aria-hidden
                        className={`w-5 h-5 shrink-0 transition-colors ${
                          item.isActive
                            ? "text-purple-300"
                            : "text-gray-300 group-hover:text-white"
                        }`}
                      />

                      <span className="text-sm font-medium tracking-wide">
                        {item.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );

  return (
    <>
      {sidebarContent}
      {mobileSidebar}
    </>
  );
}
