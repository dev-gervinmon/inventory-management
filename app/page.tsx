"use client";

import { startTransition, useEffect, useState } from "react";
import { HeroSection } from "@/components/page-specific/home/sections/HeroSection";
import { FeaturesSection } from "@/components/page-specific/home/sections/FeaturesSection";
import { PreviewSection } from "@/components/page-specific/home/sections/PreviewSection";
import { SocialProofSection } from "@/components/page-specific/home/sections/SocialProofSection";
import { Footer } from "@/components/footer/Footer";

export default function HomePage() {
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
      <HeroSection />
      <FeaturesSection />
      <PreviewSection />
      <SocialProofSection />
      <Footer />
    </div>
  );
}
