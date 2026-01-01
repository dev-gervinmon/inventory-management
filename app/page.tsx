"use client";

import { startTransition, useEffect, useState } from "react";
import { HeroSection } from "@/components/page-specific/home/sections/HeroSection";
import { FeaturesSection } from "@/components/page-specific/home/sections/FeaturesSection";
import { PreviewSection } from "@/components/page-specific/home/sections/PreviewSection";
import { SocialProofSection } from "@/components/page-specific/home/sections/SocialProofSection";
import { Footer } from "@/components/page-specific/home/sections/Footer";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => setMounted(true));
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
