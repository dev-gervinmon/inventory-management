"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Important: keep initial render deterministic for SSR/hydration.
  const [theme, setThemeState] = useState<Theme>("light");

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(t);
  };

  const setTheme = (t: Theme) => {
    try {
      localStorage.setItem("theme", t);
    } catch {
      // ignore
    }
    setThemeState(t);
  };

  useEffect(() => {
    // Sync from the DOM / localStorage after mount.
    try {
      const root = document.documentElement;
      const stored = localStorage.getItem("theme") as Theme | null;

      let next: Theme | null = null;

      if (stored === "light" || stored === "dark") {
        next = stored;
      } else if (root.classList.contains("dark")) {
        next = "dark";
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        next = "dark";
      }

      if (next && next !== theme) {
        setTimeout(() => setThemeState(next as Theme), 0);
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    applyTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
