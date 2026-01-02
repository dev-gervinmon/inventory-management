"use client";

import { HeroSection } from "@/components/page-specific/home/sections/HeroSection";
import { FeaturesSection } from "@/components/page-specific/home/sections/FeaturesSection";
import { PreviewSection } from "@/components/page-specific/home/sections/PreviewSection";
import { SocialProofSection } from "@/components/page-specific/home/sections/SocialProofSection";
import { Footer } from "@/components/page-specific/home/sections/Footer";

export default function HomePage() {
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
