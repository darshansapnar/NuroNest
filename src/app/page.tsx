import { HeroSection } from "@/components/landing/hero-section";
import { ValuePropsSection } from "@/components/landing/value-props-section";
import { SecondaryExploreSection } from "@/components/landing/secondary-explore-section";
import { DisclaimerSection } from "@/components/landing/disclaimer-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ValuePropsSection />
      <SecondaryExploreSection />
      <DisclaimerSection />
    </>
  );
}
