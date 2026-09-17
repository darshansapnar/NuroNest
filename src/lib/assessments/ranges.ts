import type { AssessmentType } from "./types";

/**
 * Pure display data for the "Understanding your score" box shown on every
 * result page. These numbers are NOT a second source of truth for scoring —
 * they only restate, for the reader, the exact cutoffs and labels each
 * calculate* function already uses. ranges.test.ts cross-checks every
 * boundary against the real calculate* functions, so if a scoring threshold
 * ever changes there, a mismatch here fails loudly instead of drifting
 * silently.
 *
 * WHO-5 is the one exception worth flagging: calculateWHO5() decides level
 * from `percentage` (rawScore * 4), not rawScore directly. The bands below
 * are expressed in rawScore terms (0-25, matching what the result header
 * shows) by converting those percentage cutoffs (50 and 70) to their exact
 * integer rawScore equivalents — 13 and 18. See who5.test.ts / ranges.test.ts
 * for the underlying percentage math.
 */

export interface ScoreRange {
  min: number;
  max: number;
  levelKey: string;
  label: string;
}

export const SCORE_RANGES: Record<AssessmentType, ScoreRange[]> = {
  who5: [
    { min: 0, max: 12, levelKey: "low", label: "Low wellbeing" },
    { min: 13, max: 17, levelKey: "moderate", label: "Moderate wellbeing" },
    { min: 18, max: 25, levelKey: "high", label: "High wellbeing" },
  ],
  gad7: [
    { min: 0, max: 4, levelKey: "minimal", label: "Minimal" },
    { min: 5, max: 9, levelKey: "mild", label: "Mild" },
    { min: 10, max: 14, levelKey: "moderate", label: "Moderate" },
    { min: 15, max: 21, levelKey: "severe", label: "Severe" },
  ],
  phq9: [
    { min: 0, max: 4, levelKey: "minimal", label: "Minimal" },
    { min: 5, max: 9, levelKey: "mild", label: "Mild" },
    { min: 10, max: 14, levelKey: "moderate", label: "Moderate" },
    { min: 15, max: 19, levelKey: "moderately-severe", label: "Moderately severe" },
    { min: 20, max: 27, levelKey: "severe", label: "Severe" },
  ],
  pss10: [
    { min: 0, max: 13, levelKey: "low", label: "Low perceived stress" },
    { min: 14, max: 26, levelKey: "moderate", label: "Moderate perceived stress" },
    { min: 27, max: 40, levelKey: "high", label: "High perceived stress" },
  ],
  psqi: [
    { min: 0, max: 5, levelKey: "good", label: "Good sleep quality" },
    { min: 6, max: 10, levelKey: "poor", label: "Poor sleep quality" },
    { min: 11, max: 21, levelKey: "very-poor", label: "Very poor sleep quality" },
  ],
};
