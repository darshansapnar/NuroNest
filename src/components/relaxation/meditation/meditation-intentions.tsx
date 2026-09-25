"use client";

import { useState } from "react";

import { meditationIntentions } from "@/data/meditations";
import { cn } from "@/lib/utils";

function MeditationIntentions() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      role="group"
      aria-label="Select an intention for this session"
    >
      {meditationIntentions.map((intention) => {
        const isSelected = selected === intention.id;

        return (
          <button
            key={intention.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => setSelected(isSelected ? null : intention.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              isSelected
                ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                : "border-white/40 bg-white/90 text-foreground hover:bg-white",
            )}
          >
            <intention.icon className="size-4" aria-hidden="true" />
            {intention.label}
          </button>
        );
      })}
    </div>
  );
}

export { MeditationIntentions };
