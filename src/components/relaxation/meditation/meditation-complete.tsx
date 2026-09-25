import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

function MeditationComplete({
  meditationTitle,
  durationMinutes,
  onDone,
  onTryAnother,
}: {
  meditationTitle: string;
  durationMinutes: number;
  onDone: () => void;
  onTryAnother: () => void;
}) {
  return (
    <div
      role="status"
      className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-10 text-center"
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Check className="size-7" aria-hidden="true" />
      </span>

      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          You made space for yourself.
        </h1>
      </div>

      <dl className="grid w-full max-w-sm grid-cols-2 gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">Meditation</dt>
          <dd className="text-sm font-semibold text-foreground">
            {meditationTitle}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">Completed</dt>
          <dd className="text-sm font-semibold text-foreground">
            {durationMinutes} min
          </dd>
        </div>
      </dl>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="h-11 rounded-full px-6" onClick={onDone}>
          Done
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-11 rounded-full px-6"
          onClick={onTryAnother}
        >
          Try another meditation
        </Button>
      </div>
    </div>
  );
}

export { MeditationComplete };
