import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wind } from "lucide-react";

import type { BreathingExercise } from "@/data/breathing-exercises";
import { cn } from "@/lib/utils";

function BreathingExerciseCard({
  exercise,
  variant = "grid",
}: {
  exercise: BreathingExercise;
  variant?: "featured" | "grid";
}) {
  const isFeatured = variant === "featured";
  const minDuration = Math.min(...exercise.durationOptions);

  return (
    <Link
      href={`/relaxation/breathing/${exercise.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-card outline-none ring-1 ring-foreground/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:ring-3 focus-visible:ring-ring/50",
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden",
          isFeatured ? "aspect-[4/3]" : "aspect-[16/10]",
        )}
      >
        <Image
          src={exercise.image}
          alt={exercise.imageAlt}
          fill
          sizes={
            isFeatured
              ? "(min-width: 1024px) 33vw, 100vw"
              : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          }
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-primary">
          <Wind className="size-4" aria-hidden="true" />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-heading text-base font-semibold text-foreground sm:text-lg">
            {exercise.title}
          </h3>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {exercise.shortDescription}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {exercise.patternLabel}
          </span>
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {minDuration}+ min
          </span>
        </div>

        <div className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-medium text-primary">
          Start
          <ArrowRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}

export { BreathingExerciseCard };
