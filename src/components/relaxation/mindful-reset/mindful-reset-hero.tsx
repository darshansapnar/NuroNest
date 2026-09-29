import Image from "next/image";

import { mindfulResetBenefits } from "@/data/mindful-reset";

/**
 * Integrated into the page background rather than framed as a bordered
 * hero card — the hero image blends into the cream background via a
 * left-edge mask on large screens, matching the Mindful Reset reference.
 */
function MindfulResetHero() {
  return (
    <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
      <div className="flex flex-col gap-5 lg:py-4">
        <div className="flex flex-col gap-3">
          <h1 className="font-heading text-3xl leading-tight font-semibold text-balance text-foreground sm:text-4xl lg:text-[2.75rem]">
            Mindful Reset
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Guided practices to release tension, reconnect with your body,
            and return to the present moment.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-4">
          {mindfulResetBenefits.map((benefit) => (
            <div key={benefit.id} className="flex items-center gap-2.5">
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-full ${benefit.iconWrapperClassName}`}
              >
                <benefit.icon className="size-4.5" aria-hidden="true" />
              </span>
              <span className="text-sm leading-tight font-medium text-foreground">
                {benefit.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative h-56 w-full overflow-hidden rounded-2xl ring-1 ring-foreground/10 sm:h-72 lg:h-[340px] lg:rounded-3xl lg:ring-0 lg:[mask-image:linear-gradient(to_right,transparent,black_15%)] lg:[-webkit-mask-image:linear-gradient(to_right,transparent,black_15%)]">
        <Image
          src="/images/mind%20reset/header.png"
          alt="A person sitting cross-legged and at ease on a wooden deck overlooking a calm lake and green mountains"
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}

export { MindfulResetHero };
