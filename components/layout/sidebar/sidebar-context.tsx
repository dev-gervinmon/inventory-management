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
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(() => {
    try {
      if (typeof window === "undefined") return true;
      const stored = window.localStorage.getItem("sidebar:collapsed");
      if (stored === "true") return true;
      if (stored === "false") return false;
      return true;
    } catch {
      return true;
    }
  });

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
