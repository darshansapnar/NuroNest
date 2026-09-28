import { Pause, Play } from "lucide-react";

import type { SleepExperience } from "@/data/sleep-support";
import { cn } from "@/lib/utils";

function SleepExperienceCard({
  experience,
  isActive,
  isPlaying,
  onSelect,
}: {
  experience: SleepExperience;
  isActive: boolean;
  isPlaying: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onSelect}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-card text-left outline-none ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:ring-3 focus-visible:ring-ring/50",
        isActive ? "ring-primary/50" : "ring-foreground/10",
      )}
    >
      <div
        className={`relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-gradient-to-br ${experience.gradientClassName}`}
      >
        <experience.icon
          className="size-9 text-white/85 transition-transform duration-500 ease-out group-hover:scale-110"
          aria-hidden="true"
          strokeWidth={1.5}
        />

        <span className="absolute right-3 bottom-3 flex size-8 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm transition-transform group-hover:scale-105">
          {isActive && isPlaying ? (
            <Pause className="size-3.5" aria-hidden="true" />
          ) : (
            <Play className="size-3.5 translate-x-0.5" aria-hidden="true" />
          )}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-heading text-base font-semibold text-foreground">
          {experience.title}
        </h3>
        <p className="text-sm leading-snug text-muted-foreground">
          {experience.description}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground/80">
          <experience.tagIcon className="size-3.5" aria-hidden="true" />
          {experience.tagLabel}
        </p>
      </div>
    </button>
  );
}

export { SleepExperienceCard };
