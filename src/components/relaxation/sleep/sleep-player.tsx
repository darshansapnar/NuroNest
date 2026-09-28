"use client";

import { useState } from "react";
import {
  ChevronDown,
  Pause,
  Play,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

import type { SleepExperience } from "@/data/sleep-support";
import { cn } from "@/lib/utils";

const durationOptions = [15, 30, 45, 60];

function formatMinutesSeconds(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function SleepPlayer({
  experience,
  isPlaying,
  currentTime,
  trackDuration,
  volume,
  isMuted,
  isShuffleOn,
  durationMinutes,
  onTogglePlay,
  onToggleShuffle,
  onPrevious,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onDurationChange,
}: {
  experience: SleepExperience;
  isPlaying: boolean;
  currentTime: number;
  trackDuration: number;
  volume: number;
  isMuted: boolean;
  isShuffleOn: boolean;
  durationMinutes: number;
  onTogglePlay: () => void;
  onToggleShuffle: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onDurationChange: (minutes: number) => void;
}) {
  const [durationMenuOpen, setDurationMenuOpen] = useState(false);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/95 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur-md lg:left-64 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 lg:flex-row lg:items-center lg:gap-6">
        <div className="flex min-w-0 items-center gap-3 lg:w-56 lg:shrink-0">
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${experience.gradientClassName}`}
          >
            <experience.icon
              className="size-5 text-white/85"
              aria-hidden="true"
              strokeWidth={1.5}
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {experience.title}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Sleep Support
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-center justify-center gap-5 lg:gap-6">
            <button
              type="button"
              aria-pressed={isShuffleOn}
              aria-label={isShuffleOn ? "Shuffle: on" : "Shuffle: off"}
              onClick={onToggleShuffle}
              className={cn(
                "hidden outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 sm:flex",
                isShuffleOn
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Shuffle className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Previous"
              onClick={onPrevious}
              className="text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <SkipBack className="size-4.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-pressed={isPlaying}
              aria-label={isPlaying ? "Pause" : "Play"}
              onClick={onTogglePlay}
              className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground outline-none transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {isPlaying ? (
                <Pause className="size-4" aria-hidden="true" />
              ) : (
                <Play className="size-4 translate-x-0.5" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={onNext}
              className="text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <SkipForward className="size-4.5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-9 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
              {formatMinutesSeconds(currentTime)}
            </span>
            <input
              type="range"
              aria-label="Seek"
              min={0}
              max={trackDuration || 0}
              step={1}
              value={Math.min(currentTime, trackDuration || 0)}
              onChange={(event) => onSeek(Number(event.target.value))}
              className="h-1.5 w-full cursor-pointer accent-primary"
            />
            <span className="w-9 shrink-0 text-xs text-muted-foreground tabular-nums">
              {formatMinutesSeconds(trackDuration)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 lg:w-52 lg:justify-end">
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              aria-pressed={isMuted}
              aria-label={isMuted ? "Unmute" : "Mute"}
              onClick={onToggleMute}
              className="text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="size-4" aria-hidden="true" />
              ) : (
                <Volume2 className="size-4" aria-hidden="true" />
              )}
            </button>
            <input
              type="range"
              aria-label="Volume"
              min={0}
              max={100}
              value={volume}
              onChange={(event) => onVolumeChange(Number(event.target.value))}
              className="h-1.5 w-20 cursor-pointer accent-primary"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={durationMenuOpen}
              onClick={() => setDurationMenuOpen((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground outline-none transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {durationMinutes} min
              <ChevronDown className="size-3.5" aria-hidden="true" />
            </button>

            {durationMenuOpen ? (
              <ul
                role="listbox"
                aria-label="Sleep timer duration"
                className="absolute right-0 bottom-full mb-2 flex w-24 flex-col overflow-hidden rounded-xl bg-card py-1 shadow-lg ring-1 ring-foreground/10"
              >
                {durationOptions.map((minutes) => (
                  <li key={minutes}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={minutes === durationMinutes}
                      onClick={() => {
                        onDurationChange(minutes);
                        setDurationMenuOpen(false);
                      }}
                      className={cn(
                        "w-full px-3 py-1.5 text-left text-xs font-medium transition-colors hover:bg-muted/60",
                        minutes === durationMinutes
                          ? "text-primary"
                          : "text-foreground",
                      )}
                    >
                      {minutes} min
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export { SleepPlayer };
