"use client";

import { useEffect, useState } from "react";

import type { BreathingPhaseType } from "@/data/breathing-exercises";
import { cn } from "@/lib/utils";

const phaseTypeLabels: Record<BreathingPhaseType, string> = {
  inhale: "Inhale",
  "hold-in": "Hold",
  exhale: "Exhale",
  "hold-out": "Hold",
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return reduced;
}

function expansionFor(phaseType: BreathingPhaseType, progress: number) {
  switch (phaseType) {
    case "inhale":
      return progress;
    case "hold-in":
      return 1;
    case "exhale":
      return 1 - progress;
    case "hold-out":
      return 0;
    default:
      return 0;
  }
}

function BreathingCircle({
  phaseType,
  progress,
  secondsRemaining,
  className,
}: {
  phaseType: BreathingPhaseType;
  progress: number;
  secondsRemaining: number;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const expansion = reducedMotion
    ? phaseType === "inhale" || phaseType === "hold-in"
      ? 1
      : 0
    : expansionFor(phaseType, progress);

  const minScale = 0.62;
  const maxScale = 1;
  const scale = minScale + (maxScale - minScale) * expansion;

  return (
    <div
      className={cn(
        "relative flex size-56 shrink-0 items-center justify-center sm:size-64 lg:size-72",
        className,
      )}
    >
      <div
        className="absolute inset-0 rounded-full bg-primary/10"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 rounded-full bg-primary/20 ring-1 ring-primary/30"
        style={{
          transform: `scale(${scale})`,
          transition: reducedMotion ? "none" : "transform 120ms linear",
        }}
        aria-hidden="true"
      />
      <div className="relative flex flex-col items-center gap-1 text-center">
        <span
          aria-live="polite"
          aria-atomic="true"
          className="font-heading text-lg font-semibold text-foreground sm:text-xl"
        >
          {phaseTypeLabels[phaseType]}
        </span>
        <span className="font-heading text-4xl font-semibold text-primary tabular-nums sm:text-5xl">
          {secondsRemaining}
        </span>
      </div>
    </div>
  );
}

export { BreathingCircle, phaseTypeLabels, usePrefersReducedMotion };
