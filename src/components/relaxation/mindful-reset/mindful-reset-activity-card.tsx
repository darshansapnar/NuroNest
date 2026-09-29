import Link from "next/link";
import { Leaf, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { MindfulResetActivity } from "@/data/mindful-reset";
import { cn } from "@/lib/utils";

function MindfulResetActivityCard({
  activity,
}: {
  activity: MindfulResetActivity;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        className={cn(
          "relative aspect-[16/11] w-full overflow-hidden bg-gradient-to-br",
          activity.gradientClassName,
        )}
      >
        <span className="absolute top-3 left-3 rounded-full bg-foreground/80 px-2.5 py-1 text-xs font-medium text-background">
          {activity.durationMinutes} min
        </span>

        <Leaf
          className="absolute -top-2 -right-2 size-16 rotate-12 text-foreground/5"
          aria-hidden="true"
        />
        <Leaf
          className="absolute -bottom-3 -left-3 size-14 -rotate-12 text-foreground/5"
          aria-hidden="true"
        />

        <div className="flex h-full w-full items-center justify-center">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-background/70 text-primary ring-1 ring-foreground/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
            <activity.icon className="size-7" aria-hidden="true" />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4 sm:p-5">
        <h3 className="font-heading text-base font-semibold text-foreground">
          {activity.title}
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {activity.description}
        </p>

        <div className="mt-3">
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href={activity.href} />}
          >
            <Play className="size-3.5" aria-hidden="true" />
            Start
          </Button>
        </div>
      </div>
    </article>
  );
}

export { MindfulResetActivityCard };
