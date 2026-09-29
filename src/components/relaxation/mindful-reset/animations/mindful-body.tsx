"use client";

import type { MindfulResetBodyRegion, MindfulResetPhase } from "@/data/mindful-reset";
import { usePrefersReducedMotion } from "@/components/relaxation/mindful-reset/animations/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type Anchor = { cx: number; cy: number; rx: number; ry: number };

/**
 * Glow position + size for every highlightable region, in the shared
 * figure's 200×236 viewBox. Exported so `body-scan.tsx` (a travelling dot
 * between anchors) and `tension-release.tsx` (a restricted subset of
 * anchors) can position themselves against the same coordinate system
 * instead of duplicating it.
 */
const REGION_ANCHORS: Record<Exclude<MindfulResetBodyRegion, "whole-body">, Anchor> = {
  head: { cx: 100, cy: 42, rx: 30, ry: 30 },
  face: { cx: 100, cy: 44, rx: 16, ry: 12 },
  jaw: { cx: 100, cy: 57, rx: 13, ry: 7 },
  neck: { cx: 100, cy: 70, rx: 14, ry: 11 },
  shoulders: { cx: 100, cy: 90, rx: 48, ry: 14 },
  chest: { cx: 100, cy: 108, rx: 34, ry: 22 },
  abdomen: { cx: 100, cy: 150, rx: 30, ry: 22 },
  arms: { cx: 100, cy: 132, rx: 64, ry: 36 },
  hands: { cx: 100, cy: 176, rx: 68, ry: 16 },
  legs: { cx: 100, cy: 205, rx: 66, ry: 20 },
  feet: { cx: 100, cy: 213, rx: 52, ry: 10 },
};

const WHOLE_BODY_ANCHOR: Anchor = { cx: 100, cy: 130, rx: 98, ry: 118 };

/**
 * Continuous visual state for a glow at a given phase + within-step
 * progress (0–1). Two weights — warm (tension) and calm (ease) — are
 * cross-faded rather than interpolating a single color, so the shift from
 * "tense" to "released" reads as a genuine warm→sage transition using only
 * opacity, which is cheap and transition-friendly.
 */
function phaseVisualState(
  phase: MindfulResetPhase | undefined,
  progress: number,
  reducedMotion: boolean,
) {
  const p = reducedMotion ? 1 : progress;

  switch (phase) {
    case "tension":
      return { scale: 1 + 0.12 * p, warm: 0.2 + 0.55 * p, calm: 0.12 };
    case "hold":
      return { scale: 1.12, warm: 0.75, calm: 0.15 };
    case "release":
      return { scale: 1.12 - 0.17 * p, warm: 0.75 - 0.55 * p, calm: 0.15 + 0.4 * p };
    case "relax":
      return { scale: 0.95 + 0.05 * p, warm: 0.08, calm: 0.55 };
    case "notice":
      return { scale: 1.05, warm: 0.05, calm: 0.6 };
    default:
      return { scale: 1, warm: 0, calm: 0.15 };
  }
}

/** Bare calm seated silhouette, no highlighting — reused by other animations. */
function MindfulBodyFigure({ className }: { className?: string }) {
  return (
    <g className={className} fill="none" stroke="var(--foreground)" strokeOpacity={0.38}>
      <circle cx={100} cy={42} r={26} strokeWidth={2.5} />
      <path d="M90,40 q4,-4 8,0" strokeWidth={1.6} strokeLinecap="round" opacity={0.6} />
      <path d="M102,40 q4,-4 8,0" strokeWidth={1.6} strokeLinecap="round" opacity={0.6} />
      <path d="M92,50 q8,6 16,0" strokeWidth={1.6} strokeLinecap="round" opacity={0.6} />
      <rect x={90} y={64} width={20} height={14} rx={7} strokeWidth={2.25} />
      <path
        d="M58,92 C58,76 76,68 100,68 C124,68 142,76 142,92 L146,148 C146,176 126,192 100,192 C74,192 54,176 54,148 Z"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path
        d="M62,94 C44,108 36,138 42,172"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <path
        d="M138,94 C156,108 164,138 158,172"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <circle cx={42} cy={176} r={10} strokeWidth={2.25} />
      <circle cx={158} cy={176} r={10} strokeWidth={2.25} />
      <path
        d="M40,188 C40,208 68,222 100,222 C132,222 160,208 160,188 C160,204 130,214 100,214 C70,214 40,204 40,188 Z"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <ellipse cx={78} cy={213} rx={11} ry={6} strokeWidth={2.25} />
      <ellipse cx={122} cy={213} rx={11} ry={6} strokeWidth={2.25} />
    </g>
  );
}

/** Exported so `tension-release.tsx` can highlight a restricted subset of anchors with the same glow visuals. */
function RegionGlow({
  anchor,
  active,
  phase,
  progress,
  reducedMotion,
}: {
  anchor: Anchor;
  active: boolean;
  phase: MindfulResetPhase | undefined;
  progress: number;
  reducedMotion: boolean;
}) {
  const state = active
    ? phaseVisualState(phase, progress, reducedMotion)
    : { scale: 1, warm: 0, calm: 0.05 };

  const transition = reducedMotion
    ? "none"
    : "transform 200ms ease, opacity 300ms ease";

  return (
    <g
      style={{
        transform: `translate(${anchor.cx}px, ${anchor.cy}px) scale(${state.scale})`,
        transformOrigin: `${anchor.cx}px ${anchor.cy}px`,
        transition,
      }}
      className={active && !reducedMotion && (phase === "relax" || phase === "notice") ? "animate-pulse" : undefined}
    >
      <ellipse
        rx={anchor.rx}
        ry={anchor.ry}
        fill="var(--chart-4)"
        opacity={state.warm}
        style={{ transition }}
      />
      <ellipse
        rx={anchor.rx * 0.9}
        ry={anchor.ry * 0.9}
        fill="var(--primary)"
        opacity={state.calm}
        style={{ transition }}
      />
    </g>
  );
}

function MindfulBodyAnimation({
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
  const isWholeBody = activeRegion === "whole-body";

  return (
    <svg
      viewBox="0 0 200 236"
      className={cn("h-full w-full", className)}
      role="img"
      aria-hidden="true"
    >
      {isWholeBody ? (
        <RegionGlow
          anchor={WHOLE_BODY_ANCHOR}
          active
          phase={phase}
          progress={progress}
          reducedMotion={reducedMotion}
        />
      ) : null}

      {(Object.keys(REGION_ANCHORS) as (keyof typeof REGION_ANCHORS)[]).map((region) => (
        <RegionGlow
          key={region}
          anchor={REGION_ANCHORS[region]}
          active={isWholeBody || activeRegion === region}
          phase={phase}
          progress={progress}
          reducedMotion={reducedMotion}
        />
      ))}

      <MindfulBodyFigure />
    </svg>
  );
}

export {
  MindfulBodyAnimation,
  MindfulBodyFigure,
  REGION_ANCHORS,
  RegionGlow,
  WHOLE_BODY_ANCHOR,
  phaseVisualState,
};
