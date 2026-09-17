import type { AssessmentOption, AssessmentQuestion, AssessmentResult } from "./types";
import { ASSESSMENTS } from "./registry";

// Spitzer et al., 2006. Stem: "Over the last 2 weeks, how often have you been
// bothered by any of the following problems?"
export const GAD7_QUESTIONS: AssessmentQuestion[] = [
  { id: 1, text: "Feeling nervous, anxious, or on edge" },
  { id: 2, text: "Not being able to stop or control worrying" },
  { id: 3, text: "Worrying too much about different things" },
  { id: 4, text: "Trouble relaxing" },
  { id: 5, text: "Being so restless that it's hard to sit still" },
  { id: 6, text: "Becoming easily annoyed or irritable" },
  { id: 7, text: "Feeling afraid as if something awful might happen" },
];

export const GAD7_OPTIONS: AssessmentOption[] = [
  { label: "Not at all", score: 0 },
  { label: "Several days", score: 1 },
  { label: "Over half the days", score: 2 },
  { label: "Nearly every day", score: 3 },
];

const MAX_RAW_SCORE = 21;

type Gad7Level = "minimal" | "mild" | "moderate" | "severe";

/**
 * Calculates the GAD-7 anxiety screening result.
 * totalScore = sum of the 7 item scores (0-21).
 * This is a screening result, not a diagnosis of an anxiety disorder.
 */
export function calculateGAD7(answers: Record<number, number>): AssessmentResult {
  const rawScore = GAD7_QUESTIONS.reduce((total, question) => total + (answers[question.id] ?? 0), 0);
  const percentage = Math.round((rawScore / MAX_RAW_SCORE) * 100);

  const levelKey: Gad7Level =
    rawScore <= 4 ? "minimal" : rawScore <= 9 ? "mild" : rawScore <= 14 ? "moderate" : "severe";

  const level = capitalize(levelKey);
  const tone =
    levelKey === "minimal" ? "positive" : levelKey === "mild" ? "neutral" : levelKey === "moderate" ? "caution" : "concern";
  const suggestProfessionalSupport = levelKey === "moderate" || levelKey === "severe";

  return {
    userId: null,
    assessmentType: "gad7",
    assessmentLabel: ASSESSMENTS.gad7.label,
    snapshotTitle: ASSESSMENTS.gad7.snapshotTitle,
    responses: answers,
    rawScore,
    maxScore: MAX_RAW_SCORE,
    percentage,
    levelKey,
    level,
    tone,
    interpretation: getInterpretation(levelKey),
    safetyFlag: false,
    suggestFurtherExploration: false,
    suggestProfessionalSupport,
    completedAt: new Date().toISOString(),
  };
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getInterpretation(level: Gad7Level): string {
  switch (level) {
    case "minimal":
      return "You don't appear to be experiencing much anxiety or worry based on this screening.";
    case "mild":
      return "You may have been experiencing some extra worry or nervousness lately.";
    case "moderate":
      return "Worry or nervousness may be taking up more space in your day lately.";
    case "severe":
    default:
      return "If these feelings have been difficult to manage, talking with a mental health professional may be helpful.";
  }
}
