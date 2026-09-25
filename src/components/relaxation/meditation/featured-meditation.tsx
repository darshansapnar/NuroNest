import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Headphones, Signal } from "lucide-react";

import type { Meditation } from "@/data/meditations";
import { Button } from "@/components/ui/button";

function FeaturedMeditation({ meditation }: { meditation: Meditation }) {
  return (
    <section aria-labelledby="featured-meditation-heading">
      <h2
        id="featured-meditation-heading"
        className="font-heading text-base font-semibold text-foreground sm:text-lg"
      >
        Featured Meditation
      </h2>

      <div className="mt-4 flex flex-col gap-5 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5 lg:flex-row lg:items-center">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl lg:aspect-[4/3] lg:w-80 lg:shrink-0">
          <Image
            src={meditation.image}
            alt={meditation.imageAlt}
            fill
            sizes="(min-width: 1024px) 320px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <span className="text-xs font-medium tracking-wide text-primary uppercase">
            {meditation.category}
          </span>
          <h3 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
            {meditation.title}
          </h3>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {meditation.shortDescription}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              <Clock className="size-3.5" aria-hidden="true" />
              {meditation.durationMinutes} min
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              <Headphones className="size-3.5" aria-hidden="true" />
              Guided
            </span>
            {meditation.difficulty ? (
              <span className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <Signal className="size-3.5" aria-hidden="true" />
                {meditation.difficulty}
              </span>
            ) : null}
          </div>
        </div>

        <Button
          size="lg"
          className="h-11 w-fit shrink-0 gap-2 rounded-full px-6"
          nativeButton={false}
          render={<Link href={`/relaxation/meditation/${meditation.slug}`} />}
        >
          Start meditation
          <ArrowRight data-icon="inline-end" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}

export { FeaturedMeditation };
