import Link from "next/link";
import { ChevronLeft, Info } from "lucide-react";

function BreathingHero() {
  return (
    <section className="flex flex-col gap-4">
      <Link
        href="/relaxation"
        className="inline-flex w-fit items-center gap-1 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        Relaxation Hub
      </Link>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium tracking-wide text-primary uppercase">
          Breathing Exercises
        </span>
        <h1 className="font-heading max-w-xl text-2xl leading-tight font-semibold text-balance text-foreground sm:text-3xl">
          Breathe in. Slow down. Feel a little lighter.
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Explore simple guided breathing exercises designed to help you
          pause, settle your breathing, and create a moment of calm.
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-muted/50 px-4 py-3 text-xs text-muted-foreground sm:text-sm">
        <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p>
          Breathing exercises are for general relaxation and self-care. Stop
          if you feel uncomfortable, dizzy, or unwell.
        </p>
      </div>
    </section>
  );
}

export { BreathingHero };
