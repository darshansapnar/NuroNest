import type { AssessmentType } from "./types";

export interface AssessmentMeta {
  type: AssessmentType;
  label: string;
  fullName: string;
  /** Route to the questionnaire itself. */
  route: string;
  /** Small uppercase eyebrow shown above the result heading, e.g. "WELLBEING CHECK-IN". */
  resultEyebrow: string;
  snapshotTitle: string;
  /** Whether a higher raw score means a better outcome (WHO-5) or a worse one (everything else). */
  higherIsBetter: boolean;
}

export const ASSESSMENTS: Record<AssessmentType, AssessmentMeta> = {
  who5: {
    type: "who5",
    label: "WHO-5",
    fullName: "WHO-5 Well-Being Index",
    route: "/assessment",
    resultEyebrow: "Wellbeing check-in",
    snapshotTitle: "Your wellbeing snapshot",
    higherIsBetter: true,
  },
  gad7: {
    type: "gad7",
    label: "GAD-7",
    fullName: "GAD-7 Anxiety Screening",
    route: "/assessment/gad7",
    resultEyebrow: "Anxiety check-in",
    snapshotTitle: "Your anxiety screening snapshot",
    higherIsBetter: false,
  },
  phq9: {
    type: "phq9",
    label: "PHQ-9",
    fullName: "PHQ-9 Depression Screening",
    route: "/assessment/phq9",
    resultEyebrow: "Mood check-in",
    snapshotTitle: "Your mood screening snapshot",
    higherIsBetter: false,
  },
  pss10: {
    type: "pss10",
    label: "PSS-10",
    fullName: "Perceived Stress Scale",
    route: "/assessment/pss10",
    resultEyebrow: "Stress check-in",
    snapshotTitle: "Your stress screening snapshot",
    higherIsBetter: false,
  },
  psqi: {
    type: "psqi",
    label: "PSQI",
    fullName: "Pittsburgh Sleep Quality Index",
    route: "/assessment/psqi",
    resultEyebrow: "Sleep check-in",
    snapshotTitle: "Your sleep quality snapshot",
    higherIsBetter: false,
  },
};

export interface ExplorationOption {
  type: AssessmentType;
  label: string;
  description: string;
}

/**
 * Options shown after a low WHO-5 score for "What has been affecting you
 * lately?" — deliberately framed as areas to explore, not diagnoses to pick.
 */
export const EXPLORATION_OPTIONS: ExplorationOption[] = [
  {
    type: "gad7",
    label: "Anxiety / worry",
    description: "Racing thoughts, restlessness, or feeling on edge.",
  },
  {
    type: "phq9",
    label: "Feeling low / loss of interest",
    description: "Low mood, low energy, or losing interest in things you enjoy.",
  },
  {
    type: "pss10",
    label: "Stress / feeling overwhelmed",
    description: "Feeling like things are piling up or hard to keep up with.",
  },
  {
    type: "psqi",
    label: "Sleep difficulties",
    description: "Trouble falling asleep, staying asleep, or waking up rested.",
  },
];

/** All targeted (non-WHO-5) screenings, in a stable display order. */
export const TARGETED_ASSESSMENT_TYPES: AssessmentType[] = ["gad7", "phq9", "pss10", "psqi"];
