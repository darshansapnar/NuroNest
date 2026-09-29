import {
  Brain,
  Ear,
  Eye,
  Footprints,
  Hand,
  HandHeart,
  Heart,
  Leaf,
  Sun,
  Wind,
  type LucideIcon,
} from "lucide-react";

export type MindfulResetBenefit = {
  id: string;
  label: string;
  icon: LucideIcon;
  /** bg + text classes for the icon badge — varies per benefit for a little visual rhythm. */
  iconWrapperClassName: string;
};

/** Which reusable animation renders behind a given activity's steps. */
export type MindfulResetAnimationKind =
  | "mindful-body"
  | "body-scan"
  | "grounding"
  | "tension-release"
  | "senses";

/** Named regions the shared calm-figure SVG (`animations/mindful-body.tsx`) can highlight. */
export type MindfulResetBodyRegion =
  | "head"
  | "face"
  | "jaw"
  | "neck"
  | "shoulders"
  | "chest"
  | "abdomen"
  | "arms"
  | "hands"
  | "legs"
  | "feet"
  | "whole-body";

/** Tension cycle used by Progressive Muscle Relaxation and Tension & Release. */
export type MindfulResetPhase = "tension" | "hold" | "release" | "relax" | "notice";

/** Somatic Grounding's four visual cues — not body regions, so kept separate. */
export type MindfulResetGroundingCue =
  | "feet"
  | "hands"
  | "breathing"
  | "surroundings";

export type MindfulResetSense = "see" | "feel" | "hear" | "smell" | "taste";

export type MindfulResetStep = {
  id: string;
  instruction: string;
  detail?: string;
  seconds: number;
  region?: MindfulResetBodyRegion;
  phase?: MindfulResetPhase;
  cue?: MindfulResetGroundingCue;
  sense?: MindfulResetSense;
  senseCount?: number;
};

export type MindfulResetActivity = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  icon: LucideIcon;
  gradientClassName: string;
  href: string;
  animation: MindfulResetAnimationKind;
  steps: MindfulResetStep[];
};

export type MindfulResetTip = {
  id: string;
  text: string;
  icon: LucideIcon;
};

/**
 * Temporary, local frontend data for the Mindful Reset experience. Shaped so
 * a future content/session API can replace it without changing the
 * components that consume it. Mirrors the pattern used by
 * `src/data/sleep-support.ts` and `src/data/breathing-exercises.ts`.
 */

export const mindfulResetBenefits: MindfulResetBenefit[] = [
  {
    id: "reduce-stress",
    label: "Reduce stress",
    icon: Leaf,
    iconWrapperClassName: "bg-primary/10 text-primary",
  },
  {
    id: "release-tension",
    label: "Release tension",
    icon: Heart,
    iconWrapperClassName:
      "bg-[color-mix(in_oklch,var(--chart-5)_16%,transparent)] text-[var(--chart-5)]",
  },
  {
    id: "body-awareness",
    label: "Increase body awareness",
    icon: Brain,
    iconWrapperClassName:
      "bg-[color-mix(in_oklch,var(--chart-2)_20%,transparent)] text-[color-mix(in_oklch,var(--chart-2)_75%,var(--foreground)_25%)]",
  },
  {
    id: "feel-grounded",
    label: "Feel more grounded",
    icon: Sun,
    iconWrapperClassName:
      "bg-[color-mix(in_oklch,var(--chart-4)_18%,transparent)] text-[var(--chart-4)]",
  },
];

/** Shared tension → hold → release → relax cycle for one body region. */
function tensionCycleSteps(
  region: MindfulResetBodyRegion,
  label: string,
  { tension = 6, hold = 5, release = 5, relax = 18 } = {},
): MindfulResetStep[] {
  return [
    {
      id: `${region}-tension`,
      instruction: `Gently tense your ${label}`,
      detail: "Squeeze softly — there's no need to strain.",
      seconds: tension,
      region,
      phase: "tension",
    },
    {
      id: `${region}-hold`,
      instruction: "Hold the tension",
      seconds: hold,
      region,
      phase: "hold",
    },
    {
      id: `${region}-release`,
      instruction: "Release, all at once",
      seconds: release,
      region,
      phase: "release",
    },
    {
      id: `${region}-relax`,
      instruction: `Let your ${label} relax completely`,
      detail: "Notice the difference between tension and ease.",
      seconds: relax,
      region,
      phase: "relax",
    },
  ];
}

const progressiveMuscleRelaxationSteps: MindfulResetStep[] = [
  {
    id: "intro",
    instruction: "Get comfortable and settle in",
    detail: "Close your eyes if that feels right.",
    seconds: 15,
    region: "whole-body",
    phase: "notice",
  },
  ...tensionCycleSteps("hands", "hands", { relax: 28 }),
  ...tensionCycleSteps("arms", "arms", { relax: 28 }),
  ...tensionCycleSteps("shoulders", "shoulders", { relax: 28 }),
  ...tensionCycleSteps("face", "face", { relax: 28 }),
  ...tensionCycleSteps("legs", "legs", { relax: 28 }),
  ...tensionCycleSteps("whole-body", "whole body", { relax: 28 }),
  {
    id: "closing",
    instruction: "Rest in this feeling of ease",
    seconds: 20,
    region: "whole-body",
    phase: "relax",
  },
];

const bodyScanRegionSteps: {
  region: MindfulResetBodyRegion;
  instruction: string;
}[] = [
  { region: "head", instruction: "Bring your attention to the top of your head" },
  { region: "face", instruction: "Notice your forehead, eyes, and jaw" },
  { region: "neck", instruction: "Soften your neck" },
  { region: "shoulders", instruction: "Let your shoulders drop away from your ears" },
  { region: "chest", instruction: "Feel your chest rise and fall with each breath" },
  { region: "arms", instruction: "Notice your arms, from shoulder to fingertips" },
  { region: "abdomen", instruction: "Bring awareness to your belly, soft and easy" },
  { region: "legs", instruction: "Notice your legs, resting and supported" },
  { region: "feet", instruction: "Finish at your feet, grounded and still" },
];

const bodyScanSteps: MindfulResetStep[] = [
  {
    id: "intro",
    instruction: "Settle into a comfortable position",
    detail: "Let your body soften with each breath.",
    seconds: 20,
    region: "whole-body",
    phase: "notice",
  },
  ...bodyScanRegionSteps.map(
    ({ region, instruction }): MindfulResetStep => ({
      id: region,
      instruction,
      seconds: 48,
      region,
      phase: "notice",
    }),
  ),
  {
    id: "closing",
    instruction: "Notice your whole body, resting and at ease",
    seconds: 25,
    region: "whole-body",
    phase: "notice",
  },
];

const somaticGroundingSteps: MindfulResetStep[] = [
  {
    id: "intro",
    instruction: "Sit or stand comfortably, feet resting on the ground",
    seconds: 15,
    cue: "surroundings",
  },
  {
    id: "feet",
    instruction: "Notice your feet pressing into the ground",
    detail: "Feel the support beneath you.",
    seconds: 65,
    cue: "feet",
  },
  {
    id: "hands",
    instruction: "Notice your hands, resting or touching something nearby",
    seconds: 65,
    cue: "hands",
  },
  {
    id: "breathing",
    instruction: "Follow your breath, in and out, at its own pace",
    seconds: 65,
    cue: "breathing",
  },
  {
    id: "surroundings",
    instruction: "Notice the sounds and space around you",
    seconds: 65,
    cue: "surroundings",
  },
  {
    id: "closing",
    instruction: "Carry this steadiness with you",
    seconds: 25,
    cue: "surroundings",
  },
];

const tensionAndReleaseSteps: MindfulResetStep[] = [
  {
    id: "intro",
    instruction: "Find a comfortable position",
    seconds: 20,
    region: "whole-body",
    phase: "notice",
  },
  ...tensionCycleSteps("hands", "hands", { relax: 30 }),
  ...tensionCycleSteps("shoulders", "shoulders", { relax: 30 }),
  ...tensionCycleSteps("jaw", "jaw", { relax: 30 }),
  {
    id: "closing",
    instruction: "Notice the ease you've created",
    seconds: 22,
    region: "whole-body",
    phase: "relax",
  },
];

const mindfulBodyAwarenessRegionSteps: {
  region: MindfulResetBodyRegion;
  instruction: string;
}[] = [
  { region: "feet", instruction: "Notice the sensations in your feet" },
  { region: "legs", instruction: "Bring awareness to your legs" },
  { region: "abdomen", instruction: "Notice your belly rising and falling" },
  { region: "chest", instruction: "Feel your chest, open and easy" },
  { region: "hands", instruction: "Notice your hands, resting still" },
  { region: "shoulders", instruction: "Bring awareness to your shoulders" },
  { region: "face", instruction: "Notice your face, soft and unguarded" },
];

const mindfulBodyAwarenessSteps: MindfulResetStep[] = [
  {
    id: "intro",
    instruction: "Settle in and let your body be just as it is",
    seconds: 20,
    region: "whole-body",
    phase: "notice",
  },
  ...mindfulBodyAwarenessRegionSteps.map(
    ({ region, instruction }): MindfulResetStep => ({
      id: region,
      instruction,
      seconds: 36,
      region,
      phase: "notice",
    }),
  ),
  {
    id: "closing",
    instruction: "Notice your whole body, just as it is",
    seconds: 24,
    region: "whole-body",
    phase: "notice",
  },
];

const fiveSensesSteps: MindfulResetStep[] = [
  {
    id: "intro",
    instruction: "Take a slow breath and look around you",
    seconds: 15,
  },
  {
    id: "see",
    instruction: "Notice 5 things you can see",
    seconds: 40,
    sense: "see",
    senseCount: 5,
  },
  {
    id: "feel",
    instruction: "Notice 4 things you can feel",
    seconds: 35,
    sense: "feel",
    senseCount: 4,
  },
  {
    id: "hear",
    instruction: "Notice 3 things you can hear",
    seconds: 30,
    sense: "hear",
    senseCount: 3,
  },
  {
    id: "smell",
    instruction: "Notice 2 things you can smell",
    seconds: 25,
    sense: "smell",
    senseCount: 2,
  },
  {
    id: "taste",
    instruction: "Notice 1 thing you can taste",
    seconds: 20,
    sense: "taste",
    senseCount: 1,
  },
  {
    id: "closing",
    instruction: "Notice how present you feel right now",
    seconds: 15,
  },
];

export const mindfulResetActivities: MindfulResetActivity[] = [
  {
    id: "progressive-muscle-relaxation",
    title: "Progressive Muscle Relaxation",
    description:
      "Gently tense and relax different muscle groups to release tension and feel more at ease.",
    durationMinutes: 5,
    icon: HandHeart,
    gradientClassName: "from-[#eef2e7] via-[#e4ead9] to-[#d8e3cd]",
    href: "/relaxation/mindful-reset/progressive-muscle-relaxation",
    animation: "mindful-body",
    steps: progressiveMuscleRelaxationSteps,
  },
  {
    id: "body-scan",
    title: "Body Scan",
    description:
      "A guided journey to bring awareness to different parts of your body and notice sensations.",
    durationMinutes: 8,
    icon: Eye,
    gradientClassName: "from-[#f4ecd9] via-[#eee2c8] to-[#e6d6b3]",
    href: "/relaxation/mindful-reset/body-scan",
    animation: "body-scan",
    steps: bodyScanSteps,
  },
  {
    id: "somatic-grounding",
    title: "Somatic Grounding",
    description:
      "Reconnect with the present moment through gentle body awareness and sensory attention.",
    durationMinutes: 5,
    icon: Footprints,
    gradientClassName: "from-[#e6eee9] via-[#dbe8de] to-[#cbdccf]",
    href: "/relaxation/mindful-reset/somatic-grounding",
    animation: "grounding",
    steps: somaticGroundingSteps,
  },
  {
    id: "tension-and-release",
    title: "Tension & Release",
    description:
      "Simple movements and awareness cues to identify and release built-up tension.",
    durationMinutes: 3,
    icon: Wind,
    gradientClassName: "from-[#f3e9db] via-[#ecdfc9] to-[#e2d0ae]",
    href: "/relaxation/mindful-reset/tension-and-release",
    animation: "tension-release",
    steps: tensionAndReleaseSteps,
  },
  {
    id: "mindful-body-awareness",
    title: "Mindful Body Awareness",
    description:
      "Tune into your body with gentle guidance to feel more present and connected.",
    durationMinutes: 5,
    icon: Heart,
    gradientClassName: "from-[#eaf0ea] via-[#dfe9df] to-[#cfdfcf]",
    href: "/relaxation/mindful-reset/mindful-body-awareness",
    animation: "mindful-body",
    steps: mindfulBodyAwarenessSteps,
  },
  {
    id: "5-4-3-2-1-grounding",
    title: "5-4-3-2-1 Grounding",
    description:
      "A simple sensory practice to help you feel calm and anchored in the present moment.",
    durationMinutes: 3,
    icon: Hand,
    gradientClassName: "from-[#f2ece0] via-[#e9e0cd] to-[#ded2b3]",
    href: "/relaxation/mindful-reset/5-4-3-2-1-grounding",
    animation: "senses",
    steps: fiveSensesSteps,
  },
];

export function getMindfulResetActivityById(id: string) {
  return mindfulResetActivities.find((activity) => activity.id === id);
}

export const mindfulResetTips: MindfulResetTip[] = [
  {
    id: "quiet-space",
    text: "Find a quiet, comfortable space",
    icon: Ear,
  },
  {
    id: "comfort-level",
    text: "Move gently and stay within your comfort level",
    icon: HandHeart,
  },
  {
    id: "no-equipment",
    text: "No special equipment is needed",
    icon: Leaf,
  },
  {
    id: "settle-attention",
    text: "Allow your attention to settle",
    icon: Wind,
  },
  {
    id: "stop-discomfort",
    text: "Stop if you feel pain, dizziness, or discomfort",
    icon: Heart,
  },
];
