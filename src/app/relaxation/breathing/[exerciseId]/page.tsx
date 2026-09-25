import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  breathingExercises,
  getBreathingExerciseById,
} from "@/data/breathing-exercises";
import { BreathingExerciseDetail } from "@/components/relaxation/breathing/breathing-exercise-detail";

export function generateStaticParams() {
  return breathingExercises.map((exercise) => ({ exerciseId: exercise.id }));
}

export async function generateMetadata(
  props: PageProps<"/relaxation/breathing/[exerciseId]">,
): Promise<Metadata> {
  const { exerciseId } = await props.params;
  const exercise = getBreathingExerciseById(exerciseId);

  if (!exercise) {
    return { title: "Breathing Exercises — NuroNest" };
  }

  return {
    title: `${exercise.title} — NuroNest`,
    description: exercise.shortDescription,
  };
}

export default async function Page(
  props: PageProps<"/relaxation/breathing/[exerciseId]">,
) {
  const { exerciseId } = await props.params;
  const exercise = getBreathingExerciseById(exerciseId);

  if (!exercise) {
    notFound();
  }

  return <BreathingExerciseDetail exercise={exercise} />;
}
