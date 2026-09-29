import { Lightbulb } from "lucide-react";

import { mindfulResetTips } from "@/data/mindful-reset";

function MindfulResetTipsPanel() {
  return (
    <div className="rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent/60 text-accent-foreground">
          <Lightbulb className="size-3.5" aria-hidden="true" />
        </span>
        <h2 className="font-heading text-sm font-semibold text-foreground sm:text-base">
          Tips for the best experience
        </h2>
      </div>

      <ul className="mt-3 flex flex-col gap-3">
        {mindfulResetTips.map((tip) => (
          <li key={tip.id} className="flex items-start gap-2.5">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <tip.icon className="size-3.5" aria-hidden="true" />
            </span>
            <span className="text-sm leading-snug text-foreground/90">
              {tip.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { MindfulResetTipsPanel };
