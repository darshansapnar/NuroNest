import Image from "next/image";
import { Play } from "lucide-react";

import { recommendedTracks } from "@/data/relaxation";

function RecommendedRelaxation() {
  return (
    <section aria-labelledby="recommended-heading">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2
            id="recommended-heading"
            className="font-heading text-base font-semibold text-foreground sm:text-lg"
          >
            Recommended for you
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Based on your recent activity.
          </p>
        </div>
        <span className="hidden shrink-0 text-sm font-medium text-muted-foreground sm:inline">
          View all
        </span>
      </div>

      <div className="mt-3 -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-3 sm:px-0 lg:grid-cols-4">
        {recommendedTracks.map((track) => (
          <button
            key={track.id}
            type="button"
            aria-label={`Play ${track.title}`}
            className="group flex w-52 shrink-0 items-center gap-2.5 rounded-xl bg-card p-2.5 text-left ring-1 ring-foreground/10 transition-colors outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-auto"
          >
            <div className="relative size-11 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={track.image}
                alt=""
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {track.title}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {track.category} &middot; {track.duration}
              </p>
            </div>
            <span
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-105"
              aria-hidden="true"
            >
              <Play className="size-3" />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export { RecommendedRelaxation };
