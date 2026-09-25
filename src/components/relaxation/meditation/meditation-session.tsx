"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";

import type { Meditation } from "@/data/meditations";
import { useMeditationPlayer } from "@/components/relaxation/meditation/use-meditation-player";
import { MeditationControls } from "@/components/relaxation/meditation/meditation-controls";

function formatMinutesSeconds(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function MeditationSession({
  meditation,
  onComplete,
  onEnd,
}: {
  meditation: Meditation;
  onComplete: (elapsedMinutes: number) => void;
  onEnd: () => void;
}) {
  const totalSeconds = meditation.durationMinutes * 60;
  const hasCompletedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const player = useMeditationPlayer({
    audioRef,
    audioUrl: meditation.audioUrl,
    totalSeconds,
    onComplete: () => {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onComplete(meditation.durationMinutes);
      }
    },
  });

  const [backgroundOn, setBackgroundOn] = useState(false);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const hasBackgroundAudio = Boolean(meditation.backgroundAudioUrl);
  const isPlaying = player.status === "playing";

  useEffect(() => {
    // player.play() is idempotent (it reschedules from the current
    // elapsed time), so it's safe to call on every effect run — including
    // the extra mount+cleanup+remount cycle React Strict Mode does in
    // development, which would otherwise cancel the frame loop via the
    // player's own unmount cleanup and leave it stuck if this only ran once.
    player.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasBackgroundAudio) return;
    const audio = backgroundAudioRef.current;
    if (!audio) return;
    // Background ambience should only actually be sounding while the user
    // both wants it on AND the meditation timer itself is playing — so
    // pausing the session pauses ambience too (without touching its
    // currentTime, so resuming continues from the same spot rather than
    // restarting), and it never sounds on its own while the session is
    // paused, even if the ambience toggle is flipped mid-pause.
    if (backgroundOn && isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [backgroundOn, hasBackgroundAudio, isPlaying]);

  const activeCue = [...meditation.guidanceCues]
    .reverse()
    .find((cue) => cue.atSeconds <= player.currentTime);

  const remainingSeconds = Math.max(0, player.duration - player.currentTime);

  function handleEnd() {
    player.end();
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
      backgroundAudioRef.current.currentTime = 0;
    }
    onEnd();
  }

  return (
    <div className="relative -mx-4 min-h-[80vh] overflow-hidden rounded-none sm:-mx-6 sm:rounded-2xl lg:mx-0">
      <Image
        src={meditation.image}
        alt={meditation.imageAlt}
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      <div
        className="absolute inset-0 bg-black/55"
        aria-hidden="true"
      />

      {meditation.audioUrl ? (
        <audio ref={audioRef} src={meditation.audioUrl} preload="metadata" />
      ) : null}
      {meditation.backgroundAudioUrl ? (
        <audio
          ref={backgroundAudioRef}
          src={meditation.backgroundAudioUrl}
          loop
          preload="none"
          onError={() => setBackgroundOn(false)}
        />
      ) : null}

      <div className="relative flex min-h-[80vh] flex-col items-center justify-between gap-8 px-5 py-10 text-center sm:px-8">
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-xs font-medium tracking-wide text-white/75 uppercase">
            {meditation.category}
          </span>
          <h1 className="font-heading text-2xl font-semibold text-white sm:text-3xl">
            {meditation.title}
          </h1>
          <p className="text-sm text-white/80 tabular-nums">
            {formatMinutesSeconds(remainingSeconds)} remaining
          </p>
        </div>

        <div className="flex max-w-md flex-1 items-center justify-center px-2">
          <p
            aria-live="polite"
            aria-atomic="true"
            className="font-heading text-lg leading-relaxed text-balance text-white sm:text-xl"
          >
            {activeCue ? `"${activeCue.text}"` : null}
          </p>
        </div>

        <div className="flex w-full max-w-md flex-col items-center gap-6">
          <div className="flex w-full items-center gap-3">
            <span className="w-10 shrink-0 text-right text-xs text-white/70 tabular-nums">
              {formatMinutesSeconds(player.currentTime)}
            </span>
            <input
              type="range"
              aria-label="Seek"
              min={0}
              max={player.duration || totalSeconds}
              step={1}
              value={player.currentTime}
              onChange={(event) => player.seekTo(Number(event.target.value))}
              className="h-1.5 w-full cursor-pointer accent-white"
            />
            <span className="w-10 shrink-0 text-xs text-white/70 tabular-nums">
              {formatMinutesSeconds(player.duration || totalSeconds)}
            </span>
          </div>

          <MeditationControls
            isPlaying={isPlaying}
            onSkipBack={() => player.skip(-10)}
            onTogglePlay={() => (isPlaying ? player.pause() : player.play())}
            onSkipForward={() => player.skip(10)}
          />

          <div className="flex w-full flex-col gap-2 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-white/85">
              <span className="flex items-center gap-1.5 font-medium">
                {meditation.audioUrl ? (
                  "Guided meditation"
                ) : (
                  <>
                    Guided meditation
                    <span className="text-white/60">— coming soon</span>
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-white/85">
              <span className="font-medium">Background ambience</span>
              <button
                type="button"
                aria-pressed={backgroundOn}
                aria-label={
                  hasBackgroundAudio
                    ? backgroundOn
                      ? "Turn off background ambience"
                      : "Turn on background ambience"
                    : "Background ambience not yet available"
                }
                disabled={!hasBackgroundAudio}
                onClick={() => setBackgroundOn((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-white/85 outline-none transition-colors hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-white/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {backgroundOn ? (
                  <Volume2 className="size-4" aria-hidden="true" />
                ) : (
                  <VolumeX className="size-4" aria-hidden="true" />
                )}
                {hasBackgroundAudio ? (backgroundOn ? "On" : "Off") : "Coming soon"}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleEnd}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-white/70 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-3 focus-visible:ring-white/50"
          >
            End session
          </button>
        </div>
      </div>
    </div>
  );
}

export { MeditationSession };
