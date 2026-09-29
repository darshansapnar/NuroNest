"use client";

import type { MindfulResetBodyRegion } from "@/data/mindful-reset";
import {
  MindfulBodyFigure,
  REGION_ANCHORS,
  WHOLE_BODY_ANCHOR,
} from "@/components/relaxation/mindful-reset/animations/mindful-body";
import { usePrefersReducedMotion } from "@/components/relaxation/mindful-reset/animations/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * A single soft highlight that glides between region anchors as the
 * current step changes, rather than mindful-body's per-region glows —
 * this is what makes the scan read as one light travelling through the
 * body instead of a region simply switching on.
 */
function BodyScanAnimation({
  activeRegion,
  className,
}: {
  activeRegion: MindfulResetBodyRegion | undefined;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const isWholeBody = !activeRegion || activeRegion === "whole-body";
  const anchor = isWholeBody ? WHOLE_BODY_ANCHOR : REGION_ANCHORS[activeRegion];

  const transition = reducedMotion
    ? "none"
    : "transform 650ms cubic-bezier(0.4, 0, 0.2, 1)";

  return (
    <svg
      viewBox="0 0 200 236"
      className={cn("h-full w-full", className)}
      role="img"
      aria-hidden="true"
    >
      <path
        d="M100,18 L100,224"
        stroke="var(--foreground)"
        strokeOpacity={0.06}
        strokeWidth={10}
        strokeLinecap="round"
      />

      <g
        style={{
          transform: `translate(${anchor.cx}px, ${anchor.cy}px)`,
          transition,
        }}
        className={!reducedMotion ? "animate-pulse" : undefined}
      >
        <ellipse
          rx={isWholeBody ? anchor.rx : anchor.rx * 1.15}
          ry={isWholeBody ? anchor.ry : anchor.ry * 1.15}
          fill="var(--primary)"
          opacity={isWholeBody ? 0.16 : 0.5}
        />
        <ellipse
          rx={isWholeBody ? anchor.rx * 0.6 : anchor.rx * 0.55}
          ry={isWholeBody ? anchor.ry * 0.6 : anchor.ry * 0.55}
          fill="var(--chart-2)"
          opacity={isWholeBody ? 0.12 : 0.4}
        />
      </g>

      <MindfulBodyFigure />
    </svg>
  );
}

export { BodyScanAnimation };
