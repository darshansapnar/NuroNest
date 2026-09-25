"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import type { BreathingExercise } from "@/data/breathing-exercises";
import { breathingSessionTips } from "@/data/breathing-exercises";
import { Button } from "@/components/ui/button";
import { RelaxationBenefitsCard } from "@/components/relaxation/relaxation-benefits-card";
import { BreathingPattern } from "@/components/relaxation/breathing/breathing-pattern";
import { FiveFingerGuide } from "@/components/relaxation/breathing/five-finger-guide";
import { BreathingSession } from "@/components/relaxation/breathing/breathing-session";
import { BreathingComplete } from "@/components/relaxation/breathing/breathing-complete";
import { cn } from "@/lib/utils";

type Mode = "detail" | "session" | "complete";

function BreathingExerciseDetail({ exercise }: { exercise: BreathingExercise }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("detail");
  const [durationMinutes, setDurationMinutes] = useState(exercise.durationOptions[0]);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  if (mode === "session") {
    return (
      <BreathingSession
        exercise={exercise}
        durationMinutes={durationMinutes}
        onComplete={(cycles) => {
          setCyclesCompleted(cycles);
          setMode("complete");
        }}
        onEnd={() => setMode("detail")}
      />
    );
  }

  if (mode === "complete") {
    return (
      <BreathingComplete
        exerciseTitle={exercise.title}
        durationMinutes={durationMinutes}
        cyclesCompleted={cyclesCompleted}
        onDone={() => router.push("/relaxation")}
        onTryAnother={() => router.push("/relaxation/breathing")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-4">
      <Link
        href="/relaxation/breathing"
        className="inline-flex w-fit items-center gap-1 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        Breathing Exercises
      </Link>

      <div className="relative w-full overflow-hidden rounded-2xl lg:h-[300px]">
        <Image
          src={exercise.image}
          alt={exercise.imageAlt}
          fill
          sizes="(min-width: 1024px) 768px, 100vw"
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/0 lg:bg-gradient-to-r lg:from-black/60 lg:via-black/20 lg:to-transparent"
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-5 p-5 sm:p-7 lg:h-full lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:py-8">
          <div className="flex flex-col gap-1.5 lg:max-w-md">
            <span className="w-fit rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-foreground">
              {exercise.category}
            </span>
            <h1 className="font-heading text-2xl font-semibold text-white sm:text-3xl">
              {exercise.title}
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
              {exercise.description}
            </p>
          </div>

          <RelaxationBenefitsCard
            benefits={exercise.benefits}
            className="lg:w-[380px] lg:shrink-0"
          />
        </div>
      </div>

      {exercise.visualMode === "hand" ? (
        <FiveFingerGuide variant="preview" instructions={exercise.instructions} />
      ) : (
        <BreathingPattern exercise={exercise} />
      )}

      <div>
        <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Choose duration
        </h2>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {exercise.durationOptions.map((minutes) => (
            <button
              key={minutes}
              type="button"
              aria-pressed={durationMinutes === minutes}
              onClick={() => setDurationMinutes(minutes)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                durationMinutes === minutes
                  ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/60",
              )}
            >
              {minutes} min
            </button>
          ))}
        </div>
      </div>

      <Button
        size="lg"
        className="h-12 w-fit rounded-full px-8 text-base"
        onClick={() => setMode("session")}
      >
        Start Exercise
      </Button>

      <div className="flex flex-col gap-3 rounded-2xl bg-muted/50 p-5">
        <h2 className="text-sm font-semibold text-foreground">
          Tips for a comfortable session
        </h2>
        <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          {breathingSessionTips.map((tip) => (
            <li key={tip} className="flex gap-2">
              <span aria-hidden="true">&middot;</span>
              {tip}
            </li>
          ))}
        </ul>
        {exercise.safetyNote ? (
          <p className="text-sm text-muted-foreground italic">
            {exercise.safetyNote}
          </p>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        Sources:{" "}
        {exercise.sources.map((source, index) => (
          <span key={source.url}>
            {index > 0 ? ", " : ""}
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer noopener"
              className="underline decoration-dotted underline-offset-2 hover:text-foreground"
            >
              {source.name}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}

export { BreathingExerciseDetail };
