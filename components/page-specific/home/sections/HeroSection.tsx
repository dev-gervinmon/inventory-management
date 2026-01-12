"use client";
import Link from "next/link";
import { useTheme } from "@/app/theme-provider";
import { Button } from "@/components/buttons/button";
import { Badge } from "@/components/common/badge";
import { Card } from "@/components/common/card";
import UserButtonClientOnly from "@/components/layout/top-nav/user-button-client-only";
import { Skeleton } from "@/components/skeletons/skeleton";
import { stackClientApp } from "@/stack/client";
import { useState, useEffect } from "react";

export function HeroSection() {
  const { theme, setTheme } = useTheme();
  const [navSolid, setNavSolid] = useState(false);
  const [authState, setAuthState] = useState<
    "unknown" | "signed-in" | "signed-out"
  >("unknown");

  useEffect(() => {
    let rafId: number | null = null;

    const update = () => {
      const solid = window.scrollY > 20;
      setNavSolid((prev) => (prev !== solid ? solid : prev));
      rafId = null;
    };

    const onScroll = () => {
      if (rafId != null) return;
      rafId = window.requestAnimationFrame(update);
    };

    // Schedule initial update asynchronously (avoids setState synchronously in effect body)
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId != null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const user = await stackClientApp.getUser();
        if (!cancelled) setAuthState(user ? "signed-in" : "signed-out");
      } catch {
        if (!cancelled) setAuthState("signed-out");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {/* HERO ANIMATIONS */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
      `}</style>
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 border-b ${
          navSolid
            ? "bg-(--surface)/70 backdrop-blur-xl border-border-subtle"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-(--brand)">
            InventoryApp
          </Link>

          <div className="hidden sm:flex gap-8 text-sm font-medium text-(--text-secondary)">
            <a href="#features" className="hover:text-(--brand) transition">
              Features
            </a>
            <a href="#preview" className="hover:text-(--brand) transition">
              Preview
            </a>
            <Link href="/dashboard" className="hover:text-(--brand) transition">
              Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-lg hover:bg-(--surface-elevated) transition cursor-pointer"
              aria-label="Toggle theme"
            >
              <span className="dark:hidden" aria-hidden="true">
                🌙
              </span>
              <span className="hidden dark:inline" aria-hidden="true">
                ☀️
              </span>
            </button>

            {authState === "signed-in" ? (
              <div className="hidden sm:inline-flex">
                <UserButtonClientOnly />
              </div>
            ) : authState === "signed-out" ? (
              <Button asChild href="/sign-in" className="hidden sm:inline-flex">
                Login
              </Button>
            ) : (
              <div className="hidden sm:inline-flex">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-44 pb-44 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-(--brand)/20 blur-[180px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-(--brand)/10 blur-[160px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div className="text-center lg:text-left">
            <Badge className="mb-6">Inventory management, reimagined</Badge>

            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight">
              Smarter Inventory
              <span
                className="block mt-3 bg-clip-text text-transparent bg-size-[200%_200%]"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, var(--brand), #8a63ff, #c084fc, var(--brand))",
                  animation: "shimmer 6s linear infinite",
                }}
              >
                For Growing Teams
              </span>
            </h1>

            <p className="mt-6 text-lg text-(--text-secondary) max-w-xl mx-auto lg:mx-0">
              Track stock, manage products, and stay ahead with real-time
              insights — without clutter or complexity.
            </p>

            <div className="mt-10 flex justify-center lg:justify-start gap-4">
              <Button size="lg" asChild href="/inventory">
                Open Dashboard
              </Button>

              <Button size="lg" variant="outline" asChild href="#features">
                Learn More
              </Button>
            </div>
          </div>

          {/* RIGHT — DASHBOARD MOCK */}
          <div className="relative flex justify-center">
            <Card
              className="w-full max-w-md p-5 backdrop-blur-xl"
              style={{ animation: "floatSlow 6s ease-in-out infinite" }}
            >
              {/* Window controls */}
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-(--danger)" />
                <span className="w-3 h-3 rounded-full bg-(--warning)" />
                <span className="w-3 h-3 rounded-full bg-(--success)" />
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {["Products", "In Stock", "Critical"].map((label) => (
                  <div
                    key={label}
                    className="rounded-xl bg-(--surface-elevated) p-3"
                  >
                    <div className="text-xs text-(--text-muted)">{label}</div>
                    <div className="mt-1 h-4 w-12 rounded bg-(--border-strong)" />
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="rounded-xl bg-(--surface-elevated) p-4 h-32 flex items-end gap-2">
                {[40, 70, 55, 80, 60, 90].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-md bg-(--brand)/70"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
