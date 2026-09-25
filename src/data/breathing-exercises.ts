export type BreathingPhaseType = "inhale" | "hold-in" | "exhale" | "hold-out";

export type BreathingPhaseStep = {
  type: BreathingPhaseType;
  seconds: number;
  /** Overrides the default phase label (e.g. "Inhale — left nostril"). */
  label?: string;
};

export type BreathingSource = {
  name: string;
  url: string;
};

export type BreathingExercise = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  image: string;
  imageAlt: string;
  patternLabel: string;
  /**
   * "fixed" — the phase seconds reflect a commonly-taught, evenly-counted
   * pattern (e.g. box breathing).
   * "guided" — there is no single required timing; the seconds below are
   * only a gentle default pace for the animation, not a clinical protocol.
   */
  timingMode: "fixed" | "guided";
  /** Swaps the session visualization from the breathing circle to the hand guide. */
  visualMode: "circle" | "hand";
  phases: BreathingPhaseStep[];
  durationOptions: number[];
  instructions: string[];
  /** Three short, wellness-oriented reasons to try this exercise — no medical claims. */
  benefits: string[];
  safetyNote?: string;
  featured?: boolean;
  sources: BreathingSource[];
};

/** Shown on every exercise detail page — general, non-clinical comfort guidance. */
export const breathingSessionTips: string[] = [
  "Find a comfortable seated or lying position.",
  "Keep your shoulders relaxed.",
  "Breathe naturally and comfortably.",
  "Do not force your breath.",
  "Stop if you feel uncomfortable, dizzy, or unwell.",
];

const fiveFingerNames = [
  "Thumb",
  "Index finger",
  "Middle finger",
  "Ring finger",
  "Little finger",
];

const fiveFingerPhases: BreathingPhaseStep[] = fiveFingerNames.flatMap(
  (name) => [
    { type: "inhale" as const, seconds: 3, label: `${name} — trace up, breathe in` },
    { type: "exhale" as const, seconds: 3, label: `${name} — trace down, breathe out` },
  ],
);

export const breathingExercises: BreathingExercise[] = [
  {
    id: "box-breathing",
    title: "Box Breathing",
    shortDescription: "A simple four-part breathing pattern with equal counts.",
    description: "A simple four-part breathing pattern with equal counts.",
    category: "Structured",
    image: "/images/relaxation-hub/breathing.png",
    imageAlt: "Soft watercolor illustration of green leaves and branches",
    patternLabel: "4 · 4 · 4 · 4",
    timingMode: "fixed",
    visualMode: "circle",
    phases: [
      { type: "inhale", seconds: 4 },
      { type: "hold-in", seconds: 4 },
      { type: "exhale", seconds: 4 },
      { type: "hold-out", seconds: 4 },
    ],
    durationOptions: [2, 5, 10],
    instructions: [
      "Sit comfortably and relax your shoulders.",
      "Inhale slowly through your nose for 4 seconds.",
      "Hold your breath gently for 4 seconds.",
      "Exhale slowly through your mouth for 4 seconds.",
      "Hold again for 4 seconds before your next breath.",
    ],
    benefits: [
      "Calm your mind",
      "Create a steady rhythm",
      "Take a short reset",
    ],
    featured: true,
    sources: [
      {
        name: "NHS — Breathing exercises for stress",
        url: "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/",
      },
      {
        name: "Cleveland Clinic — Breathwork",
        url: "https://health.clevelandclinic.org/breathwork",
      },
    ],
  },
  {
    id: "4-7-8-breathing",
    title: "4–7–8 Breathing",
    shortDescription:
      "A structured breathing pattern with a longer exhale.",
    description:
      "A structured breathing pattern with a longer exhale, often used as part of a wind-down routine.",
    category: "Wind-down",
    image: "/images/calmer.png",
    imageAlt: "Pale morning mountains and forest under a soft blue sky",
    patternLabel: "4 · 7 · 8",
    timingMode: "fixed",
    visualMode: "circle",
    phases: [
      { type: "inhale", seconds: 4 },
      { type: "hold-in", seconds: 7 },
      { type: "exhale", seconds: 8 },
    ],
    durationOptions: [2, 5, 10],
    instructions: [
      "Sit or lie down comfortably.",
      "Inhale quietly through your nose for 4 seconds.",
      "Hold your breath for 7 seconds.",
      "Exhale slowly through your mouth for 8 seconds.",
    ],
    benefits: [
      "Wind down",
      "Shift attention away from repetitive thoughts",
      "Prepare for rest",
    ],
    safetyNote:
      "Start comfortably and do not force the breath hold. Stop if you feel dizzy or uncomfortable.",
    featured: true,
    sources: [
      {
        name: "Cleveland Clinic — 4-7-8 Breathing",
        url: "https://health.clevelandclinic.org/4-7-8-breathing",
      },
    ],
  },
  {
    id: "belly-breathing",
    title: "Belly Breathing",
    shortDescription:
      "A gentle technique that focuses on the movement of the belly as you breathe.",
    description:
      "A gentle technique that focuses on the movement of the belly as you breathe.",
    category: "Gentle",
    image: "/images/relaxation.png",
    imageAlt: "A calm alpine lake surrounded by forest",
    patternLabel: "Gentle rhythm",
    timingMode: "guided",
    visualMode: "circle",
    phases: [
      { type: "inhale", seconds: 4, label: "Inhale gently — belly rises" },
      { type: "exhale", seconds: 6, label: "Exhale slowly — belly falls" },
    ],
    durationOptions: [2, 5, 10],
    instructions: [
      "Sit or lie down with one hand resting on your belly.",
      "Breathe in gently through your nose and let your belly rise.",
      "Exhale slowly and comfortably, letting your belly fall.",
      "Keep your shoulders relaxed throughout.",
    ],
    benefits: [
      "Slow your breathing",
      "Relax your body",
      "Become more aware of your breath",
    ],
    featured: true,
    sources: [
      {
        name: "Royal National Orthopaedic Hospital NHS — Breathing techniques",
        url: "https://www.rnoh.nhs.uk/patients-and-visitors/patient-information-guides/breathing-techniques",
      },
      {
        name: "Cleveland Clinic — Breathwork",
        url: "https://health.clevelandclinic.org/breathwork",
      },
    ],
  },
  {
    id: "extended-exhale",
    title: "Extended Exhale",
    shortDescription:
      "A simple breathing pattern where the exhale is longer than the inhale.",
    description:
      "A simple breathing pattern where the exhale is longer than the inhale.",
    category: "Calming",
    image: "/images/relaxation-hub/hero.png",
    imageAlt: "Sunrise over misty mountains and a forest valley",
    patternLabel: "4 · 6",
    timingMode: "fixed",
    visualMode: "circle",
    phases: [
      { type: "inhale", seconds: 4 },
      { type: "exhale", seconds: 6 },
    ],
    durationOptions: [2, 5, 10],
    instructions: [
      "Sit or lie down comfortably.",
      "Inhale through your nose for 4 seconds.",
      "Exhale slowly through your mouth for 6 seconds.",
    ],
    benefits: [
      "Encourage slower breathing",
      "Create a calmer rhythm",
      "Take a mindful pause",
    ],
    sources: [
      {
        name: "NHS Every Mind Matters — How meditation can help with sleep",
        url: "https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/how-to-fall-asleep-faster-and-sleep-better/how-can-meditation-help-with-sleep/",
      },
      {
        name: "Cleveland Clinic — Breathwork",
        url: "https://health.clevelandclinic.org/breathwork",
      },
    ],
  },
  {
    id: "alternate-nostril-breathing",
    title: "Alternate Nostril Breathing",
    shortDescription:
      "A focused breathing practice that alternates the side used for each breath.",
    description:
      "A focused breathing practice that alternates the side used for each breath.",
    category: "Focus",
    image: "/images/relaxation-hub/breathing.png",
    imageAlt: "Soft watercolor illustration of green leaves and branches",
    patternLabel: "Left · Right",
    timingMode: "guided",
    visualMode: "circle",
    phases: [
      { type: "inhale", seconds: 4, label: "Inhale — left nostril" },
      { type: "exhale", seconds: 4, label: "Exhale — right nostril" },
      { type: "inhale", seconds: 4, label: "Inhale — right nostril" },
      { type: "exhale", seconds: 4, label: "Exhale — left nostril" },
    ],
    durationOptions: [2, 5],
    instructions: [
      "Sit comfortably and relax your shoulders.",
      "Gently close your right nostril and inhale through the left.",
      "Close your left nostril, release the right, and exhale through the right.",
      "Inhale through the right nostril.",
      "Close the right nostril, release the left, and exhale through the left.",
    ],
    benefits: [
      "Focus your attention",
      "Practice controlled breathing",
      "Create a mindful pause",
    ],
    sources: [
      {
        name: "Cleveland Clinic — Alternate Nostril Breathing",
        url: "https://health.clevelandclinic.org/alternate-nostril-breathing",
      },
    ],
  },
  {
    id: "triangular-breathing",
    title: "Triangular Breathing",
    shortDescription:
      "A simple three-phase breathing pattern with equal counts.",
    description:
      "A simple three-phase breathing pattern with equal counts.",
    category: "Structured",
    image: "/images/calmer.png",
    imageAlt: "Pale morning mountains and forest under a soft blue sky",
    patternLabel: "3 · 3 · 3",
    timingMode: "fixed",
    visualMode: "circle",
    phases: [
      { type: "inhale", seconds: 3 },
      { type: "hold-in", seconds: 3 },
      { type: "exhale", seconds: 3 },
    ],
    durationOptions: [2, 5, 10],
    instructions: [
      "Sit comfortably and relax your shoulders.",
      "Inhale through your nose for 3 seconds.",
      "Hold gently for 3 seconds.",
      "Exhale through your mouth for 3 seconds.",
    ],
    benefits: [
      "Build breathing awareness",
      "Follow a simple rhythm",
      "Take a short reset",
    ],
    sources: [
      {
        name: "NHS — Breathing exercises for stress",
        url: "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/",
      },
      {
        name: "Cleveland Clinic — Breathwork",
        url: "https://health.clevelandclinic.org/breathwork",
      },
    ],
  },
  {
    id: "five-finger-breathing",
    title: "Five-Finger Breathing",
    shortDescription:
      "A mindful breathing exercise using your hand as a visual guide.",
    description:
      "A mindful breathing exercise using your hand as a visual guide.",
    category: "Mindful",
    image: "/images/relaxation.png",
    imageAlt: "A calm alpine lake surrounded by forest",
    patternLabel: "5 fingers",
    timingMode: "guided",
    visualMode: "hand",
    phases: fiveFingerPhases,
    durationOptions: [2, 5],
    instructions: [
      "Hold one hand open in front of you.",
      "Trace up one finger slowly as you breathe in.",
      "Trace down the same finger as you breathe out.",
      "Continue across all five fingers.",
      "Repeat in the opposite direction if it feels helpful.",
    ],
    benefits: [
      "Ground your attention",
      "Combine breathing with a visual focus",
      "Practice anywhere",
    ],
    sources: [
      {
        name: "Cleveland Clinic — Five-Finger Breathing",
        url: "https://health.clevelandclinic.org/five-finger-breathing",
      },
    ],
  },
  {
    id: "cyclic-sighing",
    title: "Cyclic Sighing",
    shortDescription:
      "A short breathing practice using a deeper second inhale followed by a prolonged exhale.",
    description:
      "A short breathing practice using a deeper second inhale followed by a prolonged exhale.",
    category: "Quick reset",
    image: "/images/relaxation-hub/hero.png",
    imageAlt: "Sunrise over misty mountains and a forest valley",
    patternLabel: "2 inhales · 1 long exhale",
    timingMode: "guided",
    visualMode: "circle",
    phases: [
      { type: "inhale", seconds: 2, label: "Inhale through your nose" },
      {
        type: "inhale",
        seconds: 2,
        label: "A second, deeper inhale to fully expand your lungs",
      },
      { type: "exhale", seconds: 5, label: "Slowly exhale through your mouth" },
    ],
    durationOptions: [5],
    instructions: [
      "Inhale through your nose.",
      "Take a second, deeper breath to fully expand your lungs.",
      "Slowly exhale all the air through your mouth.",
      "Repeat this cycle for about five minutes.",
    ],
    benefits: [
      "Practice prolonged exhalation",
      "Support relaxation",
      "Take a short reset",
    ],
    sources: [
      {
        name: "Stanford Medicine — Cyclic sighing for stress relief",
        url: "https://stanmed.stanford.edu/cyclic-sighing-stress-relief/",
      },
      {
        name: "PubMed — Brief structured respiration practices",
        url: "https://pubmed.ncbi.nlm.nih.gov/36630953/",
      },
    ],
  },
];

export function getBreathingExerciseById(id: string): BreathingExercise | undefined {
  return breathingExercises.find((exercise) => exercise.id === id);
}

export const featuredBreathingExercises = breathingExercises.filter(
  (exercise) => exercise.featured,
);

export const moreBreathingExercises = breathingExercises.filter(
  (exercise) => !exercise.featured,
);
