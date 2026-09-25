import { Pause, Play, RotateCcw, RotateCw } from "lucide-react";

function MeditationControls({
  isPlaying,
  onSkipBack,
  onTogglePlay,
  onSkipForward,
}: {
  isPlaying: boolean;
  onSkipBack: () => void;
  onTogglePlay: () => void;
  onSkipForward: () => void;
}) {
  return (
    <div className="flex items-center gap-6 sm:gap-8">
      <button
        type="button"
        aria-label="Rewind 10 seconds"
        onClick={onSkipBack}
        className="relative flex size-11 items-center justify-center rounded-full text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-white/50"
      >
        <RotateCcw className="size-6" aria-hidden="true" />
        <span
          className="absolute text-[10px] font-semibold tabular-nums"
          aria-hidden="true"
        >
          10
        </span>
      </button>

      <button
        type="button"
        aria-pressed={isPlaying}
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={onTogglePlay}
        className="flex size-16 items-center justify-center rounded-full bg-white text-foreground outline-none transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-white/50"
      >
        {isPlaying ? (
          <Pause className="size-6" aria-hidden="true" />
        ) : (
          <Play className="size-6 translate-x-0.5" aria-hidden="true" />
        )}
      </button>

      <button
        type="button"
        aria-label="Forward 10 seconds"
        onClick={onSkipForward}
        className="relative flex size-11 items-center justify-center rounded-full text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-white/50"
      >
        <RotateCw className="size-6" aria-hidden="true" />
        <span
          className="absolute text-[10px] font-semibold tabular-nums"
          aria-hidden="true"
        >
          10
        </span>
      </button>
    </div>
  );
}

export { MeditationControls };
