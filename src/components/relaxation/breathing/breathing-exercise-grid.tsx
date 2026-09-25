import type { BreathingExercise } from "@/data/breathing-exercises";
import { BreathingExerciseCard } from "@/components/relaxation/breathing/breathing-exercise-card";

function BreathingExerciseGrid({
  title,
  description,
  exercises,
  variant = "grid",
}: {
  title: string;
  description?: string;
  exercises: BreathingExercise[];
  variant?: "featured" | "grid";
}) {
  return (
    <section aria-labelledby={`${variant}-breathing-heading`}>
      <h2
        id={`${variant}-breathing-heading`}
        className="font-heading text-base font-semibold text-foreground sm:text-lg"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          {description}
        </p>
      ) : null}

      <div
        className={
          variant === "featured"
            ? "mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            : "mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        }
      >
        {exercises.map((exercise) => (
          <BreathingExerciseCard
            key={exercise.id}
            exercise={exercise}
            variant={variant}
          />
        ))}
      </div>
    </section>
  );
}

export { BreathingExerciseGrid };
