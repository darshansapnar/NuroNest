import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { BreathingPhaseStep } from "@/data/breathing-exercises";

export type BreathingEngineStatus = "idle" | "running" | "paused" | "completed";

/**
 * Single-timer breathing phase engine. Drives a repeating sequence of
 * phases (inhale/hold/exhale/hold) against a total session duration using
 * one requestAnimationFrame loop, so animation and countdown never drift
 * apart or run on competing timers. Pausing cancels the frame outright —
 * nothing recomputes until resume, so the phase/countdown/animation state
 * freezes exactly where it was.
 */
function useBreathingEngine(
  phases: BreathingPhaseStep[],
  totalSeconds: number,
  onComplete?: () => void,
) {
  const [status, setStatus] = useState<BreathingEngineStatus>("idle");
  const [elapsedMs, setElapsedMs] = useState(0);

  const rafRef = useRef<number | null>(null);
  const originRef = useRef(0);
  const elapsedMsRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const tickRef = useRef<(now: number) => void>(() => {});

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const totalMs = totalSeconds * 1000;
  const cycleMs = useMemo(
    () => phases.reduce((sum, phase) => sum + phase.seconds * 1000, 0),
    [phases],
  );

  const stopFrame = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  // Stable identity across renders — always delegates to the latest tick
  // implementation stored in tickRef, so requestAnimationFrame never needs
  // to reference a value that changes on every render.
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

  const end = useCallback(() => {
    stopFrame();
    elapsedMsRef.current = 0;
    setStatus("idle");
    setElapsedMs(0);
  }, [stopFrame]);

  useEffect(() => stopFrame, [stopFrame]);

  const posInCycle = cycleMs > 0 ? elapsedMs % cycleMs : 0;
  let acc = 0;
  let phaseIndex = 0;
  let phaseElapsedMs = 0;

  for (let i = 0; i < phases.length; i += 1) {
    const phaseMs = phases[i].seconds * 1000;
    if (posInCycle < acc + phaseMs || i === phases.length - 1) {
      phaseIndex = i;
      phaseElapsedMs = posInCycle - acc;
      break;
    }
    acc += phaseMs;
  }

  const currentPhase = phases[phaseIndex];
  const phaseMs = currentPhase.seconds * 1000;
  const phaseProgress = phaseMs > 0 ? Math.min(phaseElapsedMs / phaseMs, 1) : 0;
  const phaseRemainingSeconds = Math.max(
    0,
    Math.ceil(currentPhase.seconds - phaseElapsedMs / 1000),
  );
  const totalRemainingSeconds = Math.max(0, Math.ceil((totalMs - elapsedMs) / 1000));
  const totalElapsedSeconds = Math.floor(elapsedMs / 1000);
  const cyclesCompleted = cycleMs > 0 ? Math.floor(elapsedMs / cycleMs) : 0;

  return {
    status,
    currentPhase,
    phaseIndex,
    phaseProgress,
    phaseRemainingSeconds,
    totalRemainingSeconds,
    totalElapsedSeconds,
    cyclesCompleted,
    start,
    pause,
    end,
  };
}

export { useBreathingEngine };
