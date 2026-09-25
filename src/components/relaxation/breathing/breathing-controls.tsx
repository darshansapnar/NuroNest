import { Pause, Play, Square } from "lucide-react";

import { Button } from "@/components/ui/button";

function BreathingControls({
  isPaused,
  onTogglePause,
  onEnd,
}: {
  isPaused: boolean;
  onTogglePause: () => void;
  onEnd: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-11 gap-2 rounded-full px-6"
        onClick={onTogglePause}
      >
        {isPaused ? (
          <Play data-icon="inline-start" aria-hidden="true" />
        ) : (
          <Pause data-icon="inline-start" aria-hidden="true" />
        )}
        {isPaused ? "Resume" : "Pause"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="lg"
        className="h-11 gap-2 rounded-full px-6 text-muted-foreground hover:text-foreground"
        onClick={onEnd}
      >
        <Square data-icon="inline-start" className="size-3.5" aria-hidden="true" />
        End Session
      </Button>
    </div>
  );
}

export { BreathingControls };
