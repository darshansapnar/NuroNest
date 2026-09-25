import {
  featuredBreathingExercises,
  moreBreathingExercises,
} from "@/data/breathing-exercises";
import { BreathingHero } from "@/components/relaxation/breathing/breathing-hero";
import { BreathingExerciseGrid } from "@/components/relaxation/breathing/breathing-exercise-grid";

function BreathingPage() {
  return (
    <div className="flex flex-col gap-9">
      <BreathingHero />

      <BreathingExerciseGrid
        title="Featured exercises"
        exercises={featuredBreathingExercises}
        variant="featured"
      />

      <BreathingExerciseGrid
        title="Explore more exercises"
        description="The rest of the breathing library, for whenever you want to try something different."
        exercises={moreBreathingExercises}
        variant="grid"
      />
    </div>
  );
}

export { BreathingPage };
