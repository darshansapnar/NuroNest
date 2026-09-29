import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { MindfulResetStep } from "@/data/mindful-reset";

export type MindfulResetEngineStatus = "idle" | "running" | "paused" | "completed";

/**
 * Single-timer engine driving a linear (non-repeating) sequence of steps
 * against their individual durations, using one requestAnimationFrame loop
 * so the on-screen animation and the countdown never drift apart. Mirrors
 * `useBreathingEngine`'s rAF-driven approach, but walks a flat step list
 * once instead of a repeating phase cycle.
 */
function useMindfulResetEngine(steps: MindfulResetStep[], onComplete?: () => void) {
  const [status, setStatus] = useState<MindfulResetEngineStatus>("idle");
  const [elapsedMs, setElapsedMs] = useState(0);

  const rafRef = useRef<number | null>(null);
  const originRef = useRef(0);
  const elapsedMsRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const tickRef = useRef<(now: number) => void>(() => {});

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const totalMs = useMemo(
    () => steps.reduce((sum, step) => sum + step.seconds * 1000, 0),
    [steps],
  );

  const stopFrame = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const stableTick = useCallback((now: number) => {
    tickRef.current(now);
  }, []);

  useEffect(() => {
    tickRef.current = (now: number) => {
      const next = now - originRef.current;

      if (next >= totalMs) {
        elapsedMsRef.current = totalMs;
        setElapsedMs(totalMs);
        setStatus("completed");
        rafRef.current = null;
        onCompleteRef.current?.();
        return;
      }

      elapsedMsRef.current = next;
      setElapsedMs(next);
      rafRef.current = requestAnimationFrame(stableTick);
    };
  }, [totalMs, stableTick]);

  const start = useCallback(() => {
    originRef.current = performance.now() - elapsedMsRef.current;
    setStatus("running");
    stopFrame();
    rafRef.current = requestAnimationFrame(stableTick);
  }, [stopFrame, stableTick]);

  const pause = useCallback(() => {
    stopFrame();
    setStatus((current) => (current === "running" ? "paused" : current));
  }, [stopFrame]);

  const restart = useCallback(() => {
    stopFrame();
    elapsedMsRef.current = 0;
    setElapsedMs(0);
    originRef.current = performance.now();
    setStatus("running");
    rafRef.current = requestAnimationFrame(stableTick);
  }, [stopFrame, stableTick]);

  useEffect(() => stopFrame, [stopFrame]);

  let acc = 0;
  let stepIndex = 0;
  let stepElapsedMs = 0;

  for (let i = 0; i < steps.length; i += 1) {
    const stepMs = steps[i].seconds * 1000;
    if (elapsedMs < acc + stepMs || i === steps.length - 1) {
      stepIndex = i;
      stepElapsedMs = Math.min(elapsedMs - acc, stepMs);
      break;
    }
    acc += stepMs;
  }

  const currentStep = steps[stepIndex];
  const stepMs = currentStep.seconds * 1000;
  const stepProgress = stepMs > 0 ? Math.min(stepElapsedMs / stepMs, 1) : 0;
  const stepRemainingSeconds = Math.max(
    0,
    Math.ceil(currentStep.seconds - stepElapsedMs / 1000),
  );
  const totalRemainingSeconds = Math.max(0, Math.ceil((totalMs - elapsedMs) / 1000));

  return {
    status,
    currentStep,
    stepIndex,
    stepProgress,
    stepRemainingSeconds,
    totalRemainingSeconds,
    totalSteps: steps.length,
    start,
    pause,
    restart,
  };
}

export { useMindfulResetEngine };
