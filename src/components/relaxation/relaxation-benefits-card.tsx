import { CircleCheck, Leaf } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Frosted "Why try it?" benefits card. Shared between Breathing and
 * Meditation detail heroes — same visual language across the Relaxation
 * section, driven entirely by the `benefits` prop.
 */
function RelaxationBenefitsCard({
  benefits,
  className,
}: {
  benefits: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-white/40 bg-background/75 p-4 shadow-lg backdrop-blur-md sm:p-5",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Leaf className="size-3.5" aria-hidden="true" />
        </span>
        <h2 className="font-heading text-sm font-semibold text-foreground sm:text-base">
          Why try it?
        </h2>
      </div>

      <ul className="mt-3 flex flex-col gap-2">
        {benefits.map((benefit) => (
          <li
            key={benefit}
            className="flex items-start gap-2 text-sm leading-snug text-foreground/90"
          >
            <CircleCheck
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { RelaxationBenefitsCard };
