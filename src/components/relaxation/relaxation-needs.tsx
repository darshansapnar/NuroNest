"use client";

import { useState } from "react";

import { relaxationNeeds } from "@/data/relaxation";
import { cn } from "@/lib/utils";

function RelaxationNeeds() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section aria-labelledby="relaxation-needs-heading">
      <h2
        id="relaxation-needs-heading"
        className="font-heading text-base font-semibold text-foreground sm:text-lg"
      >
        What do you need right now?
      </h2>

      <div
        className="mt-3 -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
        role="group"
        aria-label="Select what you need right now"
      >
        {relaxationNeeds.map((need) => {
          const isSelected = selected === need.id;

          return (
            <button
              key={need.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelected(isSelected ? null : need.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                isSelected
                  ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/60",
              )}
            >
              <need.icon className="size-4" aria-hidden="true" />
              {need.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export { RelaxationNeeds };
