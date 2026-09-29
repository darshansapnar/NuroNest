"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Play } from "lucide-react";

import type {
  MindfulResetActivity,
  MindfulResetBodyRegion,
  MindfulResetGroundingCue,
  MindfulResetSense,
} from "@/data/mindful-reset";
import { mindfulResetTips } from "@/data/mindful-reset";
import { Button } from "@/components/ui/button";
import { MindfulResetActivityPlayer } from "@/components/relaxation/mindful-reset/mindful-reset-activity-player";
import { MindfulResetComplete } from "@/components/relaxation/mindful-reset/mindful-reset-complete";
import { cn } from "@/lib/utils";

type Mode = "detail" | "session" | "complete";

const REGION_LABELS: Record<MindfulResetBodyRegion, string> = {
  head: "Head",
  face: "Face",
  jaw: "Jaw",
  neck: "Neck",
  shoulders: "Shoulders",
  chest: "Chest",
  abdomen: "Abdomen",
  arms: "Arms",
  hands: "Hands",
  legs: "Legs",
  feet: "Feet",
  "whole-body": "Whole body",
};

const CUE_LABELS: Record<MindfulResetGroundingCue, string> = {
  feet: "Feet",
  hands: "Hands",
  breathing: "Breathing",
  surroundings: "Surroundings",
};

const SENSE_LABELS: Record<MindfulResetSense, string> = {
  see: "See",
  feel: "Feel",
  hear: "Hear",
  smell: "Smell",
  taste: "Taste",
};

/** Condensed, deduplicated preview of the step flow — e.g. "Hands → Arms → Shoulders". */
function stepFlowPreview(activity: Omit<MindfulResetActivity, "icon">): string[] {
  const labels: string[] = [];
  for (const step of activity.steps) {
    const label = step.region
      ? REGION_LABELS[step.region]
      : step.cue
        ? CUE_LABELS[step.cue]
        : step.sense
          ? SENSE_LABELS[step.sense]
          : undefined;
    if (label && labels[labels.length - 1] !== label) {
      labels.push(label);
    }
  }
  return labels;
}

/**
 * `icon` is rendered separately (rather than read off `activity.icon`)
 * because Lucide icon components are functions, and functions can't cross
 * the server → client boundary as props — this component is "use client",
 * so the server page renders the icon element itself and hands it down.
 */
function MindfulResetActivityDetail({
  activity,
  icon,
}: {
  activity: Omit<MindfulResetActivity, "icon">;
  icon: ReactNode;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("detail");
  const flow = stepFlowPreview(activity);

  if (mode === "session") {
    return (
      <MindfulResetActivityPlayer
        activity={activity}
        onComplete={() => setMode("complete")}
        onEnd={() => setMode("detail")}
      />
    );
  }

  if (mode === "complete") {
    return (
      <MindfulResetComplete
        activityTitle={activity.title}
        durationMinutes={activity.durationMinutes}
        onDone={() => router.push("/relaxation")}
        onTryAnother={() => router.push("/relaxation/mindful-reset")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-4">
      <Link
        href="/relaxation/mindful-reset"
        className="inline-flex w-fit items-center gap-1 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        Mindful Reset
      </Link>

      <div
        className={cn(
          "relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-gradient-to-br p-6 sm:p-8",
          activity.gradientClassName,
        )}
      >
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-background/70 text-primary ring-1 ring-foreground/10 backdrop-blur-sm">
          {icon}
        </span>
        <div className="flex flex-col gap-2">
          <span className="w-fit rounded-full bg-foreground/80 px-2.5 py-1 text-xs font-medium text-background">
            {activity.durationMinutes} min
          </span>
          <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            {activity.title}
          </h1>
          <p className="max-w-lg text-sm leading-relaxed text-foreground/80 sm:text-base">
            {activity.description}
          </p>
        </div>
      </div>

      {flow.length > 0 ? (
        <div>
          <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            What you&apos;ll move through
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {flow.map((label, index) => (
              <span key={`${label}-${index}`} className="flex items-center gap-2">
                <span className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground">
                  {label}
                </span>
                {index < flow.length - 1 ? (
                  <span aria-hidden="true" className="text-muted-foreground/50">
                    &rarr;
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <Button
        size="lg"
        className="h-12 w-fit rounded-full px-8 text-base"
        onClick={() => setMode("session")}
      >
        <Play data-icon="inline-start" aria-hidden="true" />
        Start
      </Button>

      <div className="flex flex-col gap-3 rounded-2xl bg-muted/50 p-5">
        <h2 className="text-sm font-semibold text-foreground">
          Tips for a comfortable session
        </h2>
        <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          {mindfulResetTips.map((tip) => (
            <li key={tip.id} className="flex gap-2">
              <span aria-hidden="true">&middot;</span>
              {tip.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export { MindfulResetActivityDetail };
