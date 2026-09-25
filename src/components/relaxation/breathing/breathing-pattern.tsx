import type { BreathingExercise } from "@/data/breathing-exercises";
import { phaseTypeLabels } from "@/components/relaxation/breathing/breathing-circle";

function BreathingPattern({ exercise }: { exercise: BreathingExercise }) {
  return (
    <div>
      <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Breathing pattern
      </h2>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {exercise.phases.map((phase, index) => (
          <div
            key={`${phase.type}-${index}`}
            className="flex flex-col items-center gap-1 rounded-xl bg-card p-4 text-center ring-1 ring-foreground/10"
          >
            <p className="text-sm font-semibold text-foreground">
              {phaseTypeLabels[phase.type]}
            </p>
            <p className="font-heading text-2xl font-semibold text-primary tabular-nums">
              {phase.seconds}s
            </p>
            {phase.label ? (
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {phase.label}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      {exercise.timingMode === "guided" ? (
        <p className="mt-3 text-xs text-muted-foreground">
          These timings are a gentle guide, not a strict requirement — move at
          whatever pace feels comfortable.
        </p>
      ) : null}
    </div>
  );
}

export { BreathingPattern };
