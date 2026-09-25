"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";

import { favoriteTracks } from "@/data/relaxation";
import { cn } from "@/lib/utils";

function FavoriteRelaxation() {
  const [favorited, setFavorited] = useState<Set<string>>(
    () => new Set(favoriteTracks.map((track) => track.id)),
  );

  return (
    <section aria-labelledby="favorites-heading">
      <div className="flex items-center justify-between">
        <h2
          id="favorites-heading"
          className="font-heading text-base font-semibold text-foreground sm:text-lg"
        >
          Your favorites
        </h2>
        <span className="text-sm font-medium text-muted-foreground">
          View all
        </span>
      </div>

      <div className="mt-3 -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3 sm:px-0">
        {favoriteTracks.map((track) => {
          const isFavorited = favorited.has(track.id);

          return (
            <div
              key={track.id}
              className="group relative w-40 shrink-0 overflow-hidden rounded-2xl ring-1 ring-foreground/10 sm:w-auto"
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={track.image}
                  alt={track.imageAlt}
                  fill
                  sizes="(min-width: 640px) 33vw, 160px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  type="button"
                  aria-pressed={isFavorited}
                  aria-label={
                    isFavorited
                      ? `Remove ${track.title} from favorites`
                      : `Add ${track.title} to favorites`
                  }
                  onClick={() =>
                    setFavorited((prev) => {
                      const next = new Set(prev);
                      if (next.has(track.id)) {
                        next.delete(track.id);
                      } else {
                        next.add(track.id);
                      }
                      return next;
                    })
                  }
                  className="absolute top-2.5 right-2.5 flex size-8 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow-sm outline-none transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <Heart
                    className={cn("size-4", isFavorited && "fill-current")}
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div className="bg-card p-3">
                <h3 className="truncate font-heading text-sm font-semibold text-foreground">
                  {track.title}
                </h3>
                <p className="truncate text-xs text-muted-foreground">
                  {track.category} &middot; {track.duration}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export { FavoriteRelaxation };
