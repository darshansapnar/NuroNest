"use client";

import type { MindfulResetGroundingCue } from "@/data/mindful-reset";
import { MindfulBodyFigure } from "@/components/relaxation/mindful-reset/animations/mindful-body";
import { usePrefersReducedMotion } from "@/components/relaxation/mindful-reset/animations/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

const FEET = [
  { cx: 78, cy: 213 },
  { cx: 122, cy: 213 },
];
const HANDS = [
  { cx: 42, cy: 176 },
  { cx: 158, cy: 176 },
];
const CHEST = { cx: 100, cy: 104 };
const AMBIENT_DOTS = [
  { cx: 22, cy: 58 },
  { cx: 178, cy: 48 },
  { cx: 16, cy: 150 },
  { cx: 184, cy: 138 },
  { cx: 28, cy: 202 },
  { cx: 172, cy: 196 },
];

/** A single gentle outward ripple, anchored at (cx, cy) via a translated <g> so the scale animates around that point rather than the SVG origin. */
function Ripple({
  cx,
  cy,
  delayMs = 0,
  reducedMotion,
}: {
  cx: number;
  cy: number;
  delayMs?: number;
  reducedMotion: boolean;
}) {
  if (reducedMotion) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={13}
        fill="none"
        stroke="var(--primary)"
        strokeOpacity={0.35}
        strokeWidth={2}
      />
    );
  }

  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle
        r={9}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={2}
        strokeOpacity={0.5}
        className="animate-ping"
        style={{ animationDuration: "2600ms", animationDelay: `${delayMs}ms` }}
      />
    </g>
  );
}

/**
 * Somatic Grounding's own calm seated figure with cue-specific overlays —
 * gentle ripples at feet/hands, a slow expanding ring for breathing, and
 * soft ambient dots for "surroundings". Reuses the shared silhouette from
 * mindful-body.tsx rather than redrawing the figure.
 */
function GroundingAnimation({
  cue,
  className,
}: {
  cue: MindfulResetGroundingCue | undefined;
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
      {cue === "surroundings"
        ? AMBIENT_DOTS.map((dot, index) => (
            <circle
              key={index}
              cx={dot.cx}
              cy={dot.cy}
              r={3}
              fill="var(--chart-2)"
              opacity={reducedMotion ? 0.35 : 0.5}
              className={!reducedMotion ? "animate-pulse" : undefined}
              style={
                !reducedMotion
                  ? { animationDuration: "3200ms", animationDelay: `${index * 260}ms` }
                  : undefined
              }
            />
          ))
        : null}

      {cue === "feet"
        ? FEET.map((foot, index) => (
            <Ripple
              key={index}
              cx={foot.cx}
              cy={foot.cy}
              delayMs={index * 500}
              reducedMotion={reducedMotion}
            />
          ))
        : null}

      {cue === "hands"
        ? HANDS.map((hand, index) => (
            <Ripple
              key={index}
              cx={hand.cx}
              cy={hand.cy}
              delayMs={index * 500}
              reducedMotion={reducedMotion}
            />
          ))
        : null}

      {cue === "breathing" ? (
        <g>
          <circle cx={CHEST.cx} cy={CHEST.cy} r={28} fill="var(--primary)" opacity={0.1} />
          {reducedMotion ? (
            <circle
              cx={CHEST.cx}
              cy={CHEST.cy}
              r={28}
              fill="none"
              stroke="var(--primary)"
              strokeOpacity={0.4}
              strokeWidth={2}
            />
          ) : (
            <g transform={`translate(${CHEST.cx} ${CHEST.cy})`}>
              <circle
                r={20}
                fill="none"
                stroke="var(--primary)"
                strokeWidth={2}
                strokeOpacity={0.45}
                className="animate-ping"
                style={{ animationDuration: "3600ms" }}
              />
            </g>
          )}
        </g>
      ) : null}

      <MindfulBodyFigure />
    </svg>
  );
}

export { GroundingAnimation };
