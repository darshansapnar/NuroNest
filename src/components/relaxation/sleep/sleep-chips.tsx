"use client";

import { sleepChips } from "@/data/sleep-support";
import { cn } from "@/lib/utils";

function SleepChips({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      role="group"
      aria-label="Filter sleep experiences by what you need tonight"
    >
      {sleepChips.map((chip) => {
        const isSelected = selectedId === chip.id;

        return (
          <button
            key={chip.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(isSelected ? null : chip.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-3 focus-visible:ring-white/50",
              isSelected
                ? "border-transparent bg-white text-foreground shadow-sm"
                : "border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15",
            )}
          >
            <chip.icon className="size-4" aria-hidden="true" />
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}

export { SleepChips };
