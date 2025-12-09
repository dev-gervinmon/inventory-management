"use client";

import { useTheme } from "./theme-provider";
import Link from "next/link";
import { startTransition, useEffect, useState } from "react";

export default function HomePage() {
  const { theme, setTheme } = useTheme();
  const [navSolid, setNavSolid] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    // mark as client, but does not cause cascaded render warnings
    startTransition(() => setMounted(true));
  }, []);

  useEffect(() => {
    const listener = () => {
      const solid = window.scrollY > 20;
      setNavSolid((prev) => (prev !== solid ? solid : prev));
    };

    listener(); // initialize only once
    window.addEventListener("scroll", listener);
    return () => window.removeEventListener("scroll", listener);
  }, []);

  if (!mounted) {
    // Prevent ANY client-only UI from rendering during SSR
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-950" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 border-b 
          ${
            navSolid
              ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-gray-800"
              : "bg-transparent border-transparent"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-purple-600 dark:text-purple-400"
          >
            InventoryApp
          </Link>

          <div className="hidden sm:flex gap-8">
            <a
              href="#features"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition"
            >
              Features
            </a>
            <a
              href="#preview"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition"
            >
              Preview
            </a>
            <Link
              href="/inventory"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition"
            >
              Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme toggle (safe after mount) */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            <Link
              href="/sign-in"
              className="hidden sm:inline-block px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition shadow-md shadow-purple-400/20"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-32 pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-[180px] opacity-40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight">
            Smarter Inventory
            <span className="block text-purple-600 dark:text-purple-400 mt-2">
              For Growing Teams
            </span>
          </h1>

          <p className="mt-6 text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            Track stock, manage products, and stay ahead with real-time alerts —
            all in one beautiful dashboard.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/inventory"
              className="px-8 py-3 rounded-xl bg-purple-600 text-white text-lg font-semibold hover:bg-purple-700 transition shadow-md shadow-purple-500/30"
            >
              Open Dashboard
            </Link>
            <a
              href="#features"
              className="px-8 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-28 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">
            Powerful Tools, Simple Experience
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Everything you need to manage inventory with speed and clarity.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-14">
            {[
              {
                icon: "📦",
                title: "Smart Tracking",
                desc: "Stay updated with accurate stock levels.",
              },
              {
                icon: "⚡",
                title: "Fast Management",
                desc: "Edit, organize, and sort effortlessly.",
              },
              {
                icon: "🔔",
                title: "Real Alerts",
                desc: "Instant notifications for low stock.",
              },
            ].map((c, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 hover:shadow-lg hover:-translate-y-1 transition"
              >
                <div className="text-4xl">{c.icon}</div>
                <h3 className="mt-4 text-xl font-semibold">{c.title}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREVIEW */}
      <section id="preview" className="py-28 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Dashboard Preview</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Clean, fast, and intuitive — built for real workflows.
          </p>

          <div className="relative mt-14">
            <div className="rounded-2xl border bg-white dark:bg-gray-900 h-80 flex items-center justify-center text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-800 shadow-xl">
              Dashboard preview coming soon
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-purple-600 dark:bg-purple-700 text-white text-center">
        <h2 className="text-3xl font-bold">Start Managing Smarter</h2>
        <p className="mt-3 max-w-lg mx-auto text-white/90">
          Take control of your products with powerful, simple tools.
        </p>

        <Link
          href="/inventory"
          className="mt-8 inline-block px-10 py-3 bg-white text-purple-700 rounded-xl shadow-lg hover:bg-gray-100 transition text-lg font-semibold"
        >
          Open Dashboard
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-10 bg-white dark:bg-gray-900 text-center text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} Inventory App — All rights reserved.
      </footer>
    </div>
  );
}
