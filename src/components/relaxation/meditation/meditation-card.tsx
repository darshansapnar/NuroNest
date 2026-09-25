import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Headphones, Music2 } from "lucide-react";

import type { Meditation } from "@/data/meditations";

function MeditationCard({ meditation }: { meditation: Meditation }) {
  return (
    <Link
      href={`/relaxation/meditation/${meditation.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-card outline-none ring-1 ring-foreground/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={meditation.image}
          alt={meditation.imageAlt}
          fill
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-heading text-base font-semibold text-foreground">
          {meditation.title}
        </h3>
        <p className="text-xs text-muted-foreground">{meditation.category}</p>
        {meditation.ambienceLabel ? (
          <p className="flex items-center gap-1 text-xs text-muted-foreground/80">
            <Music2 className="size-3.5" aria-hidden="true" />
            {meditation.ambienceLabel}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden="true" />
              {meditation.durationMinutes} min
            </span>
            <span className="flex items-center gap-1">
              <Headphones className="size-3.5" aria-hidden="true" />
              Guided
            </span>
          </div>
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export { MeditationCard };
