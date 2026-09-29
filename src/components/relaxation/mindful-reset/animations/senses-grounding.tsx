"use client";

import { Ear, Eye, Hand, Leaf, Wind, type LucideIcon } from "lucide-react";

import type { MindfulResetSense } from "@/data/mindful-reset";
import { usePrefersReducedMotion } from "@/components/relaxation/mindful-reset/animations/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

const SENSE_ICONS: Record<MindfulResetSense, LucideIcon> = {
  see: Eye,
  feel: Hand,
  hear: Ear,
  smell: Wind,
  taste: Leaf,
};

/**
 * No human figure, per the 5-4-3-2-1 brief — a single icon cross-fades
 * per sense and a ring of dots (one per item to notice) lights up in
 * sequence, giving a tactile "counting" cue without a body.
 */
function SensesGroundingAnimation({
  sense,
  count,
  className,
}: {
  sense: MindfulResetSense | undefined;
  count: number | undefined;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const Icon = sense ? SENSE_ICONS[sense] : Leaf;

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-7",
        className,
      )}
    >
      <div
        key={sense ?? "settle"}
        className={cn(
          "flex size-24 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20 sm:size-28",
          !reducedMotion && "animate-in fade-in zoom-in-95 duration-500",
        )}
      >
        <Icon className="size-10 sm:size-12" aria-hidden="true" strokeWidth={1.75} />
      </div>

      {sense && count ? (
        <div className="flex items-center gap-3" aria-hidden="true">
          {Array.from({ length: count }).map((_, index) => (
            <span
              key={`${sense}-${index}`}
              className={cn(
                "size-2.5 rounded-full bg-[var(--chart-2)]",
                !reducedMotion && "animate-in fade-in zoom-in-50",
              )}
              style={
                !reducedMotion
                  ? {
                      animationDelay: `${index * 180 + 150}ms`,
                      animationDuration: "500ms",
                      animationFillMode: "backwards",
                    }
                  : undefined
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export { SensesGroundingAnimation };
