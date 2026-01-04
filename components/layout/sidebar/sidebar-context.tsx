"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface SidebarContextType {
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;

  isDesktopCollapsed: boolean;
  expandDesktop: () => void;
  collapseDesktop: () => void;
  toggleDesktop: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Keep initial render deterministic for SSR/hydration.
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(true);

  useEffect(() => {
    // Restore persisted value after mount.
    try {
      const stored = window.localStorage.getItem("sidebar:collapsed");
      let next: boolean | null = null;
      if (stored === "true") next = true;
      if (stored === "false") next = false;

      if (next !== null) {
        setTimeout(() => setIsDesktopCollapsed(next as boolean), 0);
      }
    } catch {
      // ignore
    }
  }, []);

  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setIsSidebarOpen((v) => !v), []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "sidebar:collapsed",
        String(isDesktopCollapsed)
      );
    } catch {
      // ignore
    }
  }, [isDesktopCollapsed]);

  const expandDesktop = useCallback(() => setIsDesktopCollapsed(false), []);
  const collapseDesktop = useCallback(() => setIsDesktopCollapsed(true), []);
  const toggleDesktop = useCallback(() => setIsDesktopCollapsed((v) => !v), []);

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        openSidebar,
        closeSidebar,
        toggleSidebar,
        isDesktopCollapsed,
        expandDesktop,
        collapseDesktop,
        toggleDesktop,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider");
  return ctx;
};
