"use client";

import { Info } from "lucide-react";

import type { SleepExperience } from "@/data/sleep-support";
import { SleepExperienceCard } from "@/components/relaxation/sleep/sleep-experience-card";

function SleepExperiences({
  experiences,
  activeExperienceId,
  isPlaying,
  onSelect,
}: {
  experiences: SleepExperience[];
  activeExperienceId: string;
  isPlaying: boolean;
  onSelect: (experience: SleepExperience) => void;
}) {
  return (
    <section aria-labelledby="sleep-experiences-heading">
      <div className="flex items-center justify-between gap-2">
        <h2
          id="sleep-experiences-heading"
          className="font-heading text-base font-semibold text-foreground sm:text-lg"
        >
          Sleep Experiences
        </h2>
        <button
          type="button"
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          How it helps
          <Info className="size-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {experiences.map((experience) => (
          <SleepExperienceCard
            key={experience.id}
            experience={experience}
            isActive={activeExperienceId === experience.id}
            isPlaying={isPlaying}
            onSelect={() => onSelect(experience)}
          />
        ))}
      </div>
    </section>
  );
}

export { SleepExperiences };
