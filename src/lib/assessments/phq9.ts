import type { AssessmentOption, AssessmentQuestion, Phq9Result } from "./types";
import { ASSESSMENTS } from "./registry";

// Kroenke, Spitzer & Williams, 2001. Stem: "Over the last 2 weeks, how often
// have you been bothered by any of the following problems?"
export const PHQ9_QUESTIONS: AssessmentQuestion[] = [
  { id: 1, text: "Little interest or pleasure in doing things" },
  { id: 2, text: "Feeling down, depressed, or hopeless" },
  { id: 3, text: "Trouble falling or staying asleep, or sleeping too much" },
  { id: 4, text: "Feeling tired or having little energy" },
  { id: 5, text: "Poor appetite or overeating" },
  {
    id: 6,
    text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  },
  {
    id: 7,
    text: "Trouble concentrating on things, such as reading the newspaper or watching television",
  },
  {
    id: 8,
    text: "Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  },
  { id: 9, text: "Thoughts that you would be better off dead, or of hurting yourself in some way" },
];

export const PHQ9_OPTIONS: AssessmentOption[] = [
  { label: "Not at all", score: 0 },
  { label: "Several days", score: 1 },
  { label: "More than half the days", score: 2 },
  { label: "Nearly every day", score: 3 },
];

const MAX_RAW_SCORE = 27;
const ITEM_9_ID = 9;

type Phq9Level = "minimal" | "mild" | "moderate" | "moderately-severe" | "severe";

/**
 * Calculates the PHQ-9 depression screening result.
 * totalScore = sum of the 9 item scores (0-27).
 *
 * Item 9 (thoughts of death/self-harm) is never folded into the ordinary
 * score narrative: any answer above "Not at all" sets safetyFlag = true so a
 * dedicated safety pathway (Part 3) can take over, independent of severity
 * level.
 */
export function calculatePHQ9(answers: Record<number, number>): Phq9Result {
  const rawScore = PHQ9_QUESTIONS.reduce((total, question) => total + (answers[question.id] ?? 0), 0);
  const percentage = Math.round((rawScore / MAX_RAW_SCORE) * 100);
  const item9Score = answers[ITEM_9_ID] ?? 0;
  const safetyFlag = item9Score > 0;

  const levelKey: Phq9Level =
    rawScore <= 4
      ? "minimal"
      : rawScore <= 9
        ? "mild"
        : rawScore <= 14
          ? "moderate"
          : rawScore <= 19
            ? "moderately-severe"
            : "severe";

  const level = levelLabel(levelKey);
  const tone =
    levelKey === "minimal"
      ? "positive"
      : levelKey === "mild"
        ? "neutral"
        : levelKey === "moderate"
          ? "caution"
          : "concern";
  const suggestProfessionalSupport = safetyFlag || levelKey === "moderate" || levelKey === "moderately-severe" || levelKey === "severe";

  return {
    userId: null,
    assessmentType: "phq9",
    assessmentLabel: ASSESSMENTS.phq9.label,
    snapshotTitle: ASSESSMENTS.phq9.snapshotTitle,
    responses: answers,
    rawScore,
    maxScore: MAX_RAW_SCORE,
    percentage,
    levelKey,
    level,
    tone,
    interpretation: getInterpretation(levelKey),
    safetyFlag,
    suggestFurtherExploration: false,
    suggestProfessionalSupport,
    completedAt: new Date().toISOString(),
    item9Score,
  };
}

function levelLabel(level: Phq9Level): string {
  switch (level) {
    case "minimal":
      return "Minimal";
    case "mild":
      return "Mild";
    case "moderate":
      return "Moderate";
    case "moderately-severe":
      return "Moderately severe";
    case "severe":
    default:
      return "Severe";
  }
}

function getInterpretation(level: Phq9Level): string {
  switch (level) {
    case "minimal":
      return "You don't appear to be experiencing much low mood based on this screening.";
    case "mild":
      return "Some of the experiences covered by this screening may be affecting you lately.";
    case "moderate":
      return "Low mood or related experiences may be taking up more space in your day lately.";
    case "moderately-severe":
    case "severe":
    default:
      return "If these experiences are making everyday life difficult, talking with a mental health professional may help.";
  }
}
