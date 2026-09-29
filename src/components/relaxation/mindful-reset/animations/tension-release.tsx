"use client";

import type { MindfulResetBodyRegion, MindfulResetPhase } from "@/data/mindful-reset";
import {
  MindfulBodyFigure,
  REGION_ANCHORS,
  RegionGlow,
} from "@/components/relaxation/mindful-reset/animations/mindful-body";
import { usePrefersReducedMotion } from "@/components/relaxation/mindful-reset/animations/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

const FOCUS_REGIONS = ["hands", "shoulders", "jaw"] as const;

/**
 * Tension & Release narrows the shared figure to three anchors — hands,
 * shoulders, jaw — reusing mindful-body's RegionGlow so the warm
 * (tense) → sage (released) cross-fade matches Progressive Muscle
 * Relaxation exactly, just scoped to fewer regions.
 */
function TensionReleaseAnimation({
  activeRegion,
  phase,
  progress,
  className,
}: {
  activeRegion: MindfulResetBodyRegion | undefined;
  phase: MindfulResetPhase | undefined;
  progress: number;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <svg
      viewBox="0 0 200 236"
      className={cn("h-full w-full", className)}
      role="img"
      aria-hidden="true"
    >
      {FOCUS_REGIONS.map((region) => (
        <RegionGlow
          key={region}
          anchor={REGION_ANCHORS[region]}
          active={activeRegion === region}
          phase={phase}
          progress={progress}
          reducedMotion={reducedMotion}
        />
      ))}

      <MindfulBodyFigure />
    </svg>
  );
}

export { TensionReleaseAnimation };
