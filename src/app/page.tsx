import { HeroSection } from "@/components/landing/hero-section";
import { ExploreToolsSection } from "@/components/landing/explore-tools-section";
import { SafePrivateSection } from "@/components/landing/safe-private-section";
import { CtaBannerSection } from "@/components/landing/cta-banner-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ExploreToolsSection />
      <SafePrivateSection />
      <CtaBannerSection />
    </>
  );
}
