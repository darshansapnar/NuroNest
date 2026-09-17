import type { AssessmentOption, AssessmentQuestion, AssessmentResult } from "./types";
import { ASSESSMENTS } from "./registry";

// Cohen, Kamarck & Mermelstein, 1983. Stem: "In the last month, how often
// have you..."
export const PSS10_QUESTIONS: AssessmentQuestion[] = [
  { id: 1, text: "Been upset because of something that happened unexpectedly?" },
  { id: 2, text: "Felt that you were unable to control the important things in your life?" },
  { id: 3, text: "Felt nervous and stressed?" },
  { id: 4, text: "Felt confident about your ability to handle your personal problems?" },
  { id: 5, text: "Felt that things were going your way?" },
  { id: 6, text: "Found that you could not cope with all the things that you had to do?" },
  { id: 7, text: "Been able to control irritations in your life?" },
  { id: 8, text: "Felt that you were on top of things?" },
  { id: 9, text: "Been angered because of things that happened that were outside of your control?" },
  { id: 10, text: "Felt difficulties were piling up so high that you could not overcome them?" },
];

export const PSS10_OPTIONS: AssessmentOption[] = [
  { label: "Never", score: 0 },
  { label: "Almost never", score: 1 },
  { label: "Sometimes", score: 2 },
  { label: "Fairly often", score: 3 },
  { label: "Very often", score: 4 },
];

// Items 4, 5, 7, and 8 are positively worded and must be reverse-scored.
const REVERSE_SCORED_ITEM_IDS = new Set([4, 5, 7, 8]);
const MAX_RAW_SCORE = 40;

type Pss10Level = "low" | "moderate" | "high";

/**
 * Calculates the PSS-10 perceived stress result.
 * Items 4, 5, 7, 8 are reverse-scored (4 - originalScore) before summing.
 * totalScore range: 0-40. Higher = higher perceived stress.
 */
export function calculatePSS10(answers: Record<number, number>): AssessmentResult {
  const rawScore = PSS10_QUESTIONS.reduce((total, question) => {
    const original = answers[question.id] ?? 0;
    const scored = REVERSE_SCORED_ITEM_IDS.has(question.id) ? 4 - original : original;
    return total + scored;
  }, 0);

  const percentage = Math.round((rawScore / MAX_RAW_SCORE) * 100);

  const levelKey: Pss10Level = rawScore <= 13 ? "low" : rawScore <= 26 ? "moderate" : "high";
  const level = levelKey === "low" ? "Low perceived stress" : levelKey === "moderate" ? "Moderate perceived stress" : "High perceived stress";
  const tone = levelKey === "low" ? "positive" : levelKey === "moderate" ? "caution" : "concern";
  const suggestProfessionalSupport = levelKey === "high";

  return {
    userId: null,
    assessmentType: "pss10",
    assessmentLabel: ASSESSMENTS.pss10.label,
    snapshotTitle: ASSESSMENTS.pss10.snapshotTitle,
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

function getInterpretation(level: Pss10Level): string {
  switch (level) {
    case "low":
      return "You seem to be feeling generally in control of things lately.";
    case "moderate":
      return "You may be feeling more stressed or overwhelmed than usual.";
    case "high":
    default:
      return "Stress may be taking up a lot of space in your day. Talking with a professional may help you find ways to manage it.";
  }
}
