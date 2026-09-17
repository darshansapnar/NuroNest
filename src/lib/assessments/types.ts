export type AssessmentType = "who5" | "gad7" | "phq9" | "pss10" | "psqi";

export interface AssessmentQuestion {
  id: number;
  area?: string;
  text: string;
}

export interface AssessmentOption {
  label: string;
  score: number;
}

/** Generic visual severity bucket, independent of each instrument's own labels — drives result-page coloring uniformly. */
export type ResultTone = "positive" | "neutral" | "caution" | "concern";

/**
 * Common shape every assessment (WHO-5, GAD-7, PHQ-9, PSS-10, PSQI) produces.
 * Keeping scoring output assessment-agnostic lets the result page, routing,
 * and a future backend work against one contract instead of five bespoke
 * ones. The shape intentionally mirrors what a future REST call to the Java
 * backend (e.g. POST /api/assessments) would send as its JSON body — see
 * `userId` and `responses` below — so wiring that call up later only means
 * replacing `saveAssessmentResult`'s implementation in storage.ts, not this
 * type or any of the calculate* functions.
 */
export interface AssessmentResult {
  /** Null for anonymous users; the storage layer (not the pure calculate* functions) is responsible for attaching a real id once one exists. */
  userId: string | null;
  assessmentType: AssessmentType;
  assessmentLabel: string;
  snapshotTitle: string;
  /** Raw answers this result was computed from — shape depends on assessmentType (Record<questionId, score> for the Likert instruments, PsqiAnswers for PSQI). Opaque here on purpose, the same way a JSON payload would be until deserialized against a per-type schema. */
  responses: unknown;
  rawScore: number;
  maxScore: number;
  percentage: number;
  /** Instrument-specific severity bucket key, e.g. "moderate", "poor". */
  levelKey: string;
  /** Human-readable label for levelKey, e.g. "Moderate". */
  level: string;
  tone: ResultTone;
  interpretation: string;
  /** True only for a hard safety signal (currently: PHQ-9 item 9 > 0). Never a diagnosis. */
  safetyFlag: boolean;
  /** WHO-5 only: below-threshold score should offer the "what's affecting you" branch, not a verdict. */
  suggestFurtherExploration: boolean;
  /** Generic "this may be worth discussing with a professional" nudge, distinct from the hard safetyFlag. */
  suggestProfessionalSupport: boolean;
  completedAt: string;
}

export interface Phq9Result extends AssessmentResult {
  assessmentType: "phq9";
  item9Score: number;
}

export interface PsqiComponents {
  subjectiveSleepQuality: number;
  sleepLatency: number;
  sleepDuration: number;
  sleepEfficiency: number;
  sleepDisturbances: number;
  sleepMedication: number;
  daytimeDysfunction: number;
}

export interface PsqiResult extends AssessmentResult {
  assessmentType: "psqi";
  components: PsqiComponents;
}

export type AnyAssessmentResult = AssessmentResult | Phq9Result | PsqiResult;

export function isPhq9Result(result: AnyAssessmentResult): result is Phq9Result {
  return result.assessmentType === "phq9";
}

export function isPsqiResult(result: AnyAssessmentResult): result is PsqiResult {
  return result.assessmentType === "psqi";
}
