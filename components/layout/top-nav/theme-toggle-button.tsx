"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/theme-provider";

export default function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="cursor-pointer inline-flex items-center justify-center rounded-2xl p-2 text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-elevated)/70 ring-1 ring-(--border-subtle) focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
