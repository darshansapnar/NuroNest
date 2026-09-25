import { meditationWhatToExpect } from "@/data/meditations";

function MeditationExpectations() {
  return (
    <div>
      <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        What to expect
      </h2>

      <ol className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {meditationWhatToExpect.map((item) => (
          <li
            key={item.step}
            className="flex flex-col gap-1.5 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
          >
            <span className="font-heading text-sm font-semibold text-primary tabular-nums">
              {item.step}
            </span>
            <p className="text-sm font-semibold text-foreground">{item.title}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export { MeditationExpectations };
