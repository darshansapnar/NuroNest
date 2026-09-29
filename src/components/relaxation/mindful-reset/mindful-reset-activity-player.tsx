"use client";

import { useEffect, useRef } from "react";

import type { MindfulResetActivity } from "@/data/mindful-reset";
import { useMindfulResetEngine } from "@/components/relaxation/mindful-reset/use-mindful-reset-engine";
import { MindfulResetControls } from "@/components/relaxation/mindful-reset/mindful-reset-controls";
import { MindfulBodyAnimation } from "@/components/relaxation/mindful-reset/animations/mindful-body";
import { BodyScanAnimation } from "@/components/relaxation/mindful-reset/animations/body-scan";
import { GroundingAnimation } from "@/components/relaxation/mindful-reset/animations/grounding-animation";
import { TensionReleaseAnimation } from "@/components/relaxation/mindful-reset/animations/tension-release";
import { SensesGroundingAnimation } from "@/components/relaxation/mindful-reset/animations/senses-grounding";

function formatMinutesSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function MindfulResetActivityPlayer({
  activity,
  onComplete,
  onEnd,
}: {
  activity: Omit<MindfulResetActivity, "icon">;
  onComplete: () => void;
  onEnd: () => void;
}) {
  const engine = useMindfulResetEngine(activity.steps);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    // engine.start() is idempotent (it reschedules from the current
    // elapsed time), so it's safe to call on every effect run — including
    // the extra mount+cleanup+remount cycle React Strict Mode does in
    // development, which would otherwise cancel the frame loop via the
    // engine's own unmount cleanup and leave it stuck if this only ran once.
    engine.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (engine.status === "completed" && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      onComplete();
    }
  }, [engine.status, onComplete]);

  const isPaused = engine.status === "paused";
  const step = engine.currentStep;

  function handleTogglePause() {
    if (engine.status === "running") {
      engine.pause();
    } else {
      engine.start();
    }
  }

  function handleRestart() {
    hasCompletedRef.current = false;
    engine.restart();
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-7 py-8 text-center">
      <div className="flex flex-col items-center gap-1.5">
        <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
          {activity.title}
        </h1>
        <p className="text-sm text-muted-foreground tabular-nums">
          Step {engine.stepIndex + 1} of {engine.totalSteps} &middot;{" "}
          {formatMinutesSeconds(engine.totalRemainingSeconds)} remaining
        </p>
      </div>

      <div className="flex size-64 shrink-0 items-center justify-center sm:size-72 lg:size-80">
        {activity.animation === "mindful-body" ? (
          <MindfulBodyAnimation
            activeRegion={step.region}
            phase={step.phase}
            progress={engine.stepProgress}
          />
        ) : null}
        {activity.animation === "body-scan" ? (
          <BodyScanAnimation activeRegion={step.region} />
        ) : null}
        {activity.animation === "grounding" ? (
          <GroundingAnimation cue={step.cue} />
        ) : null}
        {activity.animation === "tension-release" ? (
          <TensionReleaseAnimation
            activeRegion={step.region}
            phase={step.phase}
            progress={engine.stepProgress}
          />
        ) : null}
        {activity.animation === "senses" ? (
          <SensesGroundingAnimation sense={step.sense} count={step.senseCount} />
        ) : null}
      </div>

      <div className="flex flex-col items-center gap-2">
        <p
          aria-live="polite"
          aria-atomic="true"
          className="max-w-sm text-base font-medium text-foreground sm:text-lg"
        >
          {step.instruction}
        </p>
        {step.detail ? (
          <p className="max-w-xs text-sm text-muted-foreground">{step.detail}</p>
        ) : null}
      </div>

      <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-200 ease-linear"
          style={{
            width: `${((engine.stepIndex + engine.stepProgress) / engine.totalSteps) * 100}%`,
          }}
        />
      </div>

      <MindfulResetControls
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
        onRestart={handleRestart}
        onEnd={onEnd}
      />
    </div>
  );
}

export { MindfulResetActivityPlayer };
