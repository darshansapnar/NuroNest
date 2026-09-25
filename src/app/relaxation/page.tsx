import type { Metadata } from "next";

import { RelaxationHero } from "@/components/relaxation/relaxation-hero";
import { RelaxationNeeds } from "@/components/relaxation/relaxation-needs";
import { ContinueRelaxing } from "@/components/relaxation/continue-relaxing";
import { FavoriteRelaxation } from "@/components/relaxation/favorite-relaxation";
import { RelaxationCategories } from "@/components/relaxation/relaxation-categories";
import { QuickResets } from "@/components/relaxation/quick-resets";
import { RecommendedRelaxation } from "@/components/relaxation/recommended-relaxation";

export const metadata: Metadata = {
  title: "Relaxation Hub — NuroNest",
  description:
    "Slow down, breathe, and find a little space to reset with guided breathing, meditation, sleep support, sounds and music.",
};

export default function RelaxationPage() {
  return (
    <div className="flex flex-col gap-8 sm:gap-9">
      <RelaxationHero />
      <RelaxationNeeds />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[7fr_6fr] lg:gap-6">
        <ContinueRelaxing />
        <FavoriteRelaxation />
      </div>

      <RelaxationCategories />
      <QuickResets />
      <RecommendedRelaxation />
    </div>
  );
}
