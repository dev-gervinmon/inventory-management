import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",

  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        /* ---------- BRAND ---------- */
        brand: "var(--brand)",

        /* ---------- SURFACES ---------- */
        canvas: "var(--canvas)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",

        /* ---------- BORDERS ---------- */
        "border-subtle": "var(--border-subtle)",
        "border-strong": "var(--border-strong)",

        /* ---------- TEXT ---------- */
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "text-inverted": "var(--text-inverted)",

        /* ---------- STATUS ---------- */
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },

  plugins: [],
};

export default config;
