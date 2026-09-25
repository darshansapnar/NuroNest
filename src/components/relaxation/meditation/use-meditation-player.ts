import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

export type MeditationPlayerStatus = "idle" | "playing" | "paused" | "completed";

/**
 * Drives a meditation session's primary guided track. When `audioUrl` is
 * set, playback is delegated to the real HTML5 `<audio>` element behind
 * `audioRef` (created and attached by the caller). When it's null — true
 * for every practice today, since no licensed audio files exist yet — the
 * exact same controls (play, pause, seek, skip) instead drive a single
 * requestAnimationFrame timer, so the session is fully functional either
 * way and swapping in a real file later requires no changes to the UI.
 *
 * `audioRef` is taken as a parameter (not returned) so this hook's return
 * value is plain state — mixing a ref into the returned object confuses
 * the strict react-hooks/refs lint rule into flagging unrelated state
 * reads as "accessing a ref during render".
 */
function useMeditationPlayer({
  audioRef,
  audioUrl,
  totalSeconds,
  onComplete,
}: {
  audioRef: RefObject<HTMLAudioElement | null>;
  audioUrl: string | null;
  totalSeconds: number;
  onComplete?: () => void;
}) {
  const hasAudio = Boolean(audioUrl);

  const [status, setStatus] = useState<MeditationPlayerStatus>("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(totalSeconds);

  const rafRef = useRef<number | null>(null);
  const originRef = useRef(0);
  const elapsedRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const tickRef = useRef<(now: number) => void>(() => {});

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

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
      const next = (now - originRef.current) / 1000;

      if (next >= totalSeconds) {
        elapsedRef.current = totalSeconds;
        setCurrentTime(totalSeconds);
        setStatus("completed");
        rafRef.current = null;
        onCompleteRef.current?.();
        return;
      }

      elapsedRef.current = next;
      // The frame loop still runs at full rate for accurate timing (skip,
      // seek and completion all read elapsedRef directly), but syncing
      // that into React state on every single frame (~60/sec) forces the
      // whole session tree — including the control buttons — to
      // re-render continuously for the entire session. That made the
      // controls feel unresponsive and occasionally drop clicks. The UI
      // only ever displays whole seconds, so only re-render when the
      // displayed second actually changes; returning the same value from
      // a functional update makes React bail out of the render entirely.
      setCurrentTime((prev) => (Math.floor(prev) !== Math.floor(next) ? next : prev));
      rafRef.current = requestAnimationFrame(stableTick);
    };
  }, [totalSeconds, stableTick]);

  const play = useCallback(() => {
    if (hasAudio) {
      audioRef.current?.play().catch(() => {});
      setStatus("playing");
      return;
    }

    originRef.current = performance.now() - elapsedRef.current * 1000;
    setStatus("playing");
    stopFrame();
    rafRef.current = requestAnimationFrame(stableTick);
  }, [hasAudio, stopFrame, stableTick]);

  const pause = useCallback(() => {
    if (hasAudio) {
      audioRef.current?.pause();
    } else {
      stopFrame();
    }
    setStatus((current) => (current === "playing" ? "paused" : current));
  }, [hasAudio, stopFrame]);

  const seekTo = useCallback(
    (seconds: number) => {
      const clamped = Math.min(Math.max(seconds, 0), duration);

      if (hasAudio) {
        if (audioRef.current) {
          audioRef.current.currentTime = clamped;
        }
        setCurrentTime(clamped);
        return;
      }

      elapsedRef.current = clamped;
      setCurrentTime(clamped);
      if (status === "playing") {
        originRef.current = performance.now() - clamped * 1000;
      }
    },
    [hasAudio, duration, status],
  );

  const skip = useCallback(
    (deltaSeconds: number) => {
      const base = hasAudio ? (audioRef.current?.currentTime ?? 0) : elapsedRef.current;
      seekTo(base + deltaSeconds);
    },
    [hasAudio, seekTo],
  );

  const end = useCallback(() => {
    if (hasAudio && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    stopFrame();
    elapsedRef.current = 0;
    setCurrentTime(0);
    setStatus("idle");
  }, [hasAudio, stopFrame]);

  useEffect(() => {
    if (!hasAudio) return;
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const next = audio.currentTime;
      setCurrentTime((prev) => (Math.floor(prev) !== Math.floor(next) ? next : prev));
    };
    const handleLoadedMetadata = () => setDuration(audio.duration || totalSeconds);
    const handleEnded = () => {
      setStatus("completed");
      onCompleteRef.current?.();
    };
    // If the file 404s or fails to decode, don't leave the UI stuck showing
    // "playing" — fall back to paused so the user can still use the (timer
    // driven) controls rather than seeing a frozen, unresponsive session.
    const handleError = () => setStatus("paused");

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [hasAudio, totalSeconds]);

  useEffect(() => stopFrame, [stopFrame]);

  return {
    status,
    currentTime,
    duration,
    hasAudio,
    play,
    pause,
    seekTo,
    skip,
    end,
  };
}

export { useMeditationPlayer };
