"use client";

import { useEffect, useRef } from "react";

import type { BreathingExercise } from "@/data/breathing-exercises";
import { useBreathingEngine } from "@/components/relaxation/breathing/use-breathing-engine";
import { BreathingCircle, phaseTypeLabels } from "@/components/relaxation/breathing/breathing-circle";
import { FiveFingerGuide } from "@/components/relaxation/breathing/five-finger-guide";
import { BreathingControls } from "@/components/relaxation/breathing/breathing-controls";

function formatMinutesSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function BreathingSession({
  exercise,
  durationMinutes,
  onComplete,
  onEnd,
}: {
  exercise: BreathingExercise;
  durationMinutes: number;
  onComplete: (cyclesCompleted: number) => void;
  onEnd: () => void;
}) {
  const engine = useBreathingEngine(exercise.phases, durationMinutes * 60);
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
      onComplete(engine.cyclesCompleted);
    }
  }, [engine.status, engine.cyclesCompleted, onComplete]);

  const isPaused = engine.status === "paused";

  function handleTogglePause() {
    if (engine.status === "running") {
      engine.pause();
    } else {
      engine.start();
    }
  }

  function handleEnd() {
    engine.end();
    onEnd();
  }

  const showDots = exercise.visualMode === "circle" && exercise.phases.length <= 6;
  const activeFingerIndex =
    exercise.visualMode === "hand" ? Math.floor(engine.phaseIndex / 2) : undefined;

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 py-8 text-center">
      <div className="flex flex-col items-center gap-1.5">
        <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
          {exercise.title}
        </h1>
        <p className="text-sm text-muted-foreground tabular-nums">
          {formatMinutesSeconds(engine.totalRemainingSeconds)} remaining
        </p>
      </div>

      {exercise.visualMode === "hand" ? (
        <FiveFingerGuide
          variant="session"
          activeFingerIndex={activeFingerIndex}
          phaseType={engine.currentPhase.type}
          phaseLabel={engine.currentPhase.label}
          secondsRemaining={engine.phaseRemainingSeconds}
        />
      ) : (
        <div className="flex flex-col items-center gap-3">
          <BreathingCircle
            phaseType={engine.currentPhase.type}
            progress={engine.phaseProgress}
            secondsRemaining={engine.phaseRemainingSeconds}
          />
          {engine.currentPhase.label ? (
            <p className="max-w-xs text-sm text-muted-foreground">
              {engine.currentPhase.label}
            </p>
          ) : null}
        </div>
      )}

      {showDots ? (
        <ul className="flex items-center gap-4" aria-label="Breathing phase progress">
          {exercise.phases.map((phase, index) => (
            <li
              key={`${phase.type}-${index}`}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                aria-hidden="true"
                className={
                  index === engine.phaseIndex
                    ? "size-2.5 rounded-full bg-primary"
                    : "size-2.5 rounded-full border border-muted-foreground/40"
                }
              />
              <span className="text-xs text-muted-foreground">
                {phaseTypeLabels[phase.type]}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <BreathingControls
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
        onEnd={handleEnd}
      />
    </div>
  );
}

export { BreathingSession };
