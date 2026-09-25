import Image from "next/image";
import { Play } from "lucide-react";

import { continueRelaxationItem } from "@/data/relaxation";
import { Button } from "@/components/ui/button";

function ContinueRelaxing() {
  const item = continueRelaxationItem;

  return (
    <section aria-labelledby="continue-relaxing-heading">
      <h2
        id="continue-relaxing-heading"
        className="font-heading text-base font-semibold text-foreground sm:text-lg"
      >
        Continue where you left off
      </h2>

      <div className="mt-3 flex flex-col gap-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl sm:aspect-square sm:w-20">
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            sizes="(min-width: 640px) 96px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <h3 className="font-heading text-lg font-semibold text-foreground">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {item.category} &middot; {item.duration}
          </p>
          <div className="mt-1.5 flex items-center gap-3">
            <div
              className="h-1.5 w-full max-w-56 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-label={`${item.title} progress`}
              aria-valuenow={item.progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${item.progressPercent}%` }}
              />
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {item.minutesRemainingLabel}
            </span>
          </div>
        </div>

        <Button size="lg" className="h-9 gap-1.5 self-start px-4 sm:self-center">
          <Play data-icon="inline-start" aria-hidden="true" />
          Continue
        </Button>
      </div>
    </section>
  );
}

export { ContinueRelaxing };
