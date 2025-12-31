"use client";

import { startTransition, useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "./theme-provider";

import { Button } from "@/components/buttons/button";
import { HeroSection } from "@/components/page-specific/home/sections/HeroSection";
import { FeaturesSection } from "@/components/page-specific/home/sections/FeaturesSection";
import { PreviewSection } from "@/components/page-specific/home/sections/PreviewSection";
import { SocialProofSection } from "@/components/page-specific/home/sections/SocialProofSection";

export default function HomePage() {
  const { theme, setTheme } = useTheme();
  const [navSolid, setNavSolid] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);

  useEffect(() => {
    const listener = () => {
      const solid = window.scrollY > 20;
      setNavSolid((prev) => (prev !== solid ? solid : prev));
    };
    listener();
    window.addEventListener("scroll", listener);
    return () => window.removeEventListener("scroll", listener);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-(--canvas)" />;
  }

  return (
    <div className="min-h-screen bg-(--canvas) text-(--text-primary) overflow-x-hidden">
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
            <Link href="/inventory" className="hover:text-(--brand) transition">
              Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-lg hover:bg-(--surface-elevated) transition cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            <Button asChild href="/sign-in" className="hidden sm:inline-flex">
              Login
            </Button>
          </div>
        </div>
      </nav>

      <HeroSection />
      <FeaturesSection />
      <PreviewSection />
      <SocialProofSection />
    </div>
  );
}
