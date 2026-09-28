import { windDownTips } from "@/data/sleep-support";

function WindDownTips() {
  return (
    <section aria-labelledby="wind-down-tips-heading">
      <h2
        id="wind-down-tips-heading"
        className="font-heading text-base font-semibold text-foreground sm:text-lg"
      >
        Wind-Down Tips
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {windDownTips.map((tip) => (
          <div
            key={tip.id}
            className="flex flex-col gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <tip.icon className="size-4.5" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="font-heading text-sm leading-snug font-semibold text-foreground">
                {tip.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {tip.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export { WindDownTips };
