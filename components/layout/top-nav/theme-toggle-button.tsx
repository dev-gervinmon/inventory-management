"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/theme-provider";

export default function ThemeToggleButton() {
  const { setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => {
        // Use the DOM as the source of truth to avoid hydration timing issues.
        const root = document.documentElement;
        const next = root.classList.contains("dark") ? "light" : "dark";
        setTheme(next);
      }}
      className="cursor-pointer inline-flex items-center justify-center rounded-2xl p-2 text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-elevated)/70 ring-1 ring-(--border-subtle) focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {/* Render both icons to keep SSR + hydration markup stable. */}
      <Sun className="h-5 w-5 hidden dark:block" />
      <Moon className="h-5 w-5 block dark:hidden" />
    </button>
  );
}
