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
        brand: {
          DEFAULT: "#6b40ff",
          light: "#8a63ff",
          dark: "#4c28cc",
        },

        /* ---------- SEMANTIC SURFACES ---------- */
        canvas: {
          DEFAULT: "#f9fafb", // gray-50
          dark: "#0b0f19", // near-black, not pure
        },
        surface: {
          DEFAULT: "#ffffff",
          dark: "#111827", // gray-900
        },
        "surface-elevated": {
          DEFAULT: "#ffffff",
          dark: "#1f2937", // gray-800
        },

        /* ---------- BORDERS ---------- */
        border: {
          subtle: "#e5e7eb", // gray-200
          strong: "#d1d5db", // gray-300
          dark: "#1f2937",
        },

        /* ---------- TEXT ---------- */
        text: {
          primary: "#111827", // gray-900
          secondary: "#374151", // gray-700
          muted: "#6b7280", // gray-500
          inverted: "#f9fafb",
        },

        /* ---------- STATUS ---------- */
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
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
