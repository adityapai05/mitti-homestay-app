"use client";
import AuthModal from "@/components/auth/AuthModal";
import CategoriesSection from "@/components/ui/homepage/CategoriesSection";
import { CurrentUser } from "@/components/ui/homepage/CurrentUser";
import HeroSection from "@/components/ui/homepage/HeroSection";
import RecommendedSection from "@/components/ui/homepage/RecommendedSection";
import TestimonialsSection from "@/components/ui/homepage/TestimonialsSection";
import TokenLogger from "@/components/ui/homepage/TokenLogger";
import WhyMittiSection from "@/components/ui/homepage/WhyMittiSection";

export default function Home() {
  return (
    <div className="bg-mitti-beige text-mitti-dark-brown suppressHydrationWarning">
      <CurrentUser />
      <TokenLogger/>
      <HeroSection />
      <CategoriesSection />
      <RecommendedSection />
      <WhyMittiSection />
      <TestimonialsSection />
      <AuthModal />
    </div>
  );
}
