"use client";

import { useMemo, useState } from "react";

import { meditationFilters, meditationLibrary } from "@/data/meditations";
import { MeditationCard } from "@/components/relaxation/meditation/meditation-card";
import { cn } from "@/lib/utils";

type Filter = (typeof meditationFilters)[number];

function MeditationLibrary() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  const visibleMeditations = useMemo(() => {
    if (activeFilter === "All") {
      return meditationLibrary;
    }
    return meditationLibrary.filter((meditation) =>
      meditation.filterTags.includes(activeFilter),
    );
  }, [activeFilter]);

  return (
    <section aria-labelledby="explore-meditations-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="explore-meditations-heading"
          className="font-heading text-base font-semibold text-foreground sm:text-lg"
        >
          Explore Meditations
        </h2>

        <div
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
          role="group"
          aria-label="Filter meditations"
        >
          {meditationFilters.map((filter) => {
            const isActive = filter === activeFilter;

            return (
              <button
                key={filter}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isActive
                    ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/60",
                )}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {visibleMeditations.map((meditation) => (
          <MeditationCard key={meditation.id} meditation={meditation} />
        ))}
      </div>

      {visibleMeditations.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No meditations match this filter yet.
        </p>
      ) : null}
    </section>
  );
}

export { MeditationLibrary };
