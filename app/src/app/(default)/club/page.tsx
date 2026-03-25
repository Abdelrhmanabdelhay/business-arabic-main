"use client";

import HeroSection from "./components/HeroSection";
import PricingSection from "./components/PricingSection";

export default function ClubPage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <PricingSection />
    </main>
  );
}