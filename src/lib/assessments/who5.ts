import type { AssessmentOption, AssessmentQuestion, AssessmentResult } from "./types";
import { ASSESSMENTS } from "./registry";

export const WHO5_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    area: "Mood",
    text: "Over the past 2 weeks, how often have you felt cheerful, calm, or in good spirits?",
  },
  {
    id: 2,
    area: "Energy",
    text: "Over the past 2 weeks, how often have you felt active, energetic, and motivated?",
  },
  {
    id: 3,
    area: "Sleep",
    text: "Over the past 2 weeks, how often have you woken up feeling well-rested and refreshed?",
  },
  {
    id: 4,
    area: "Interest",
    text: "Over the past 2 weeks, how often have you felt interested and engaged in your daily life?",
  },
  {
    id: 5,
    area: "Overall Wellbeing",
    text: "Overall, how satisfied and at ease have you felt with your day-to-day life recently?",
  },
];

// Official WHO-5 response scale: 0 (At no time) – 5 (All of the time).
export const WHO5_OPTIONS: AssessmentOption[] = [
  { label: "All of the time", score: 5 },
  { label: "Most of the time", score: 4 },
  { label: "More than half the time", score: 3 },
  { label: "Less than half the time", score: 2 },
  { label: "Some of the time", score: 1 },
  { label: "At no time", score: 0 },
];

const MAX_RAW_SCORE = 25;
// Official WHO-5 cutoff: a percentage score below 50 suggests poor wellbeing
// and warrants further exploration — never a diagnosis on its own.
const SUPPORT_THRESHOLD = 50;

/**
 * Calculates the official WHO-5 result from raw question responses.
 * rawScore = sum of the 5 item scores (0-25)
 * percentage = rawScore * 4 (0-100)
 *
 * This score is a wellbeing snapshot only. It must never be used to assert
 * that the user has anxiety, depression, stress, or a sleep disorder — a low
 * score only means further exploration (via a targeted screening) may help.
 */
export function calculateWHO5(answers: Record<number, number>): AssessmentResult {
  const rawScore = WHO5_QUESTIONS.reduce((total, question) => total + (answers[question.id] ?? 0), 0);
  const percentage = rawScore * 4;
  const suggestFurtherExploration = percentage < SUPPORT_THRESHOLD;

  const levelKey = percentage >= 70 ? "high" : percentage >= SUPPORT_THRESHOLD ? "moderate" : "low";
  const level = levelKey === "high" ? "High wellbeing" : levelKey === "moderate" ? "Moderate wellbeing" : "Low wellbeing";
  const tone = levelKey === "high" ? "positive" : levelKey === "moderate" ? "neutral" : "caution";

  return {
    userId: null,
    assessmentType: "who5",
    assessmentLabel: ASSESSMENTS.who5.label,
    snapshotTitle: ASSESSMENTS.who5.snapshotTitle,
    responses: answers,
    rawScore,
    maxScore: MAX_RAW_SCORE,
    percentage,
    levelKey,
    level,
    tone,
    interpretation: getInterpretation(levelKey),
    safetyFlag: false,
    suggestFurtherExploration,
    suggestProfessionalSupport: false,
    completedAt: new Date().toISOString(),
  };
}

type Who5Level = "high" | "moderate" | "low";

function getInterpretation(level: Who5Level): string {
  switch (level) {
    case "high":
      return "Your responses show a generally positive sense of wellbeing right now.";
    case "moderate":
      return "Your wellbeing seems steady right now, with some room for a bit more rest and care.";
    case "low":
    default:
      return "Your wellbeing may need a little more attention right now. Taking a closer look at what's been affecting you lately may help.";
  }
}
