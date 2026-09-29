import { Info, Leaf } from "lucide-react";

function MindfulResetWhyPanel() {
  return (
    <div className="rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Info className="size-3.5" aria-hidden="true" />
        </span>
        <h2 className="font-heading text-sm font-semibold text-foreground sm:text-base">
          Why mindful reset?
        </h2>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        These are gentle body-awareness, grounding, and relaxation practices
        designed to help you notice tension, reconnect with the present
        moment, and create a calmer experience throughout your day.
      </p>

      <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-muted/60 p-3.5">
        <Leaf
          className="mt-0.5 size-4 shrink-0 text-primary"
          aria-hidden="true"
        />
        <p className="text-sm text-balance text-foreground/90 italic">
          &ldquo;A calmer mind often begins with a relaxed body.&rdquo;
        </p>
      </div>
    </div>
  );
}

export { MindfulResetWhyPanel };
