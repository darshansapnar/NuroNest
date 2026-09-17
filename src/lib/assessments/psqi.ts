import type { PsqiComponents, PsqiResult } from "./types";
import { ASSESSMENTS } from "./registry";

/**
 * Buysse, Reynolds, Monk, Berman & Kupfer, 1989 — Pittsburgh Sleep Quality
 * Index. Component scoring intentionally mirrors the published algorithm
 * rather than a simple sum of answers: each of the 7 components is derived
 * from a specific subset of items, several of which are recoded on their own
 * cutoffs before being combined.
 *
 * Question 10 (bed partner / room mate observations) is part of the official
 * instrument but, per the source material, does not contribute to the global
 * score — it is collected for context only and is not part of PsqiAnswers.
 */

// 0-3 frequency scale shared by several PSQI items.
export const PSQI_FREQUENCY_OPTIONS = [
  { label: "Not during the past month", score: 0 },
  { label: "Less than once a week", score: 1 },
  { label: "Once or twice a week", score: 2 },
  { label: "Three or more times a week", score: 3 },
];

// 0-3 "problem" scale used by Question 8.
export const PSQI_PROBLEM_OPTIONS = [
  { label: "No problem at all", score: 0 },
  { label: "Only a very slight problem", score: 1 },
  { label: "Somewhat of a problem", score: 2 },
  { label: "A very big problem", score: 3 },
];

// 0-3 quality scale used by Question 9.
export const PSQI_QUALITY_OPTIONS = [
  { label: "Very good", score: 0 },
  { label: "Fairly good", score: 1 },
  { label: "Fairly bad", score: 2 },
  { label: "Very bad", score: 3 },
];

export interface PsqiDisturbances {
  /** 5a — cannot get to sleep within 30 minutes (also feeds Component 2). */
  cannotSleep30: number;
  /** 5b — wake up in the middle of the night or early morning. */
  wakeNight: number;
  /** 5c — have to get up to use the bathroom. */
  bathroom: number;
  /** 5d — cannot breathe comfortably. */
  breathing: number;
  /** 5e — cough or snore loudly. */
  coughSnore: number;
  /** 5f — feel too cold. */
  tooCold: number;
  /** 5g — feel too hot. */
  tooHot: number;
  /** 5h — had bad dreams. */
  badDreams: number;
  /** 5i — have pain. */
  pain: number;
  /** 5j — other reason(s). */
  other: number;
}

export interface PsqiAnswers {
  /** Question 1 — usual bedtime, 24h "HH:MM". */
  bedTime: string;
  /** Question 3 — usual wake time, 24h "HH:MM". */
  wakeTime: string;
  /** Question 2 — minutes taken to fall asleep. */
  sleepLatencyMinutes: number;
  /** Question 4 — actual hours of sleep per night. */
  sleepDurationHours: number;
  /** Question 5 (a-j) — frequency of each sleep disturbance, 0-3. */
  disturbances: PsqiDisturbances;
  /** Question 6 — frequency of using sleep medication, 0-3. */
  sleepMedicationFreq: number;
  /** Question 7 — frequency of trouble staying awake during the day, 0-3. */
  troubleStayingAwake: number;
  /** Question 8 — how much of a problem keeping up enthusiasm has been, 0-3. */
  enthusiasmProblem: number;
  /** Question 9 — overall sleep quality rating, 0-3. */
  overallSleepQuality: number;
}

const MAX_RAW_SCORE = 21;

type PsqiLevel = "good" | "poor" | "very-poor";

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function scoreLatencyMinutes(minutes: number): number {
  if (minutes <= 15) return 0;
  if (minutes <= 30) return 1;
  if (minutes <= 60) return 2;
  return 3;
}

function scoreFromCutoffs(value: number, cutoffs: [number, number, number]): number {
  const [zero, one, two] = cutoffs;
  if (value <= zero) return 0;
  if (value <= one) return 1;
  if (value <= two) return 2;
  return 3;
}

/** Computes hours spent in bed between bedtime and wake time, handling the overnight wrap. */
function calculateTimeInBedHours(bedTime: string, wakeTime: string): number {
  const bedMinutes = parseTimeToMinutes(bedTime);
  const wakeMinutes = parseTimeToMinutes(wakeTime);
  const minutesInBed = wakeMinutes > bedMinutes ? wakeMinutes - bedMinutes : 1440 - bedMinutes + wakeMinutes;
  return minutesInBed / 60;
}

export function calculatePsqiComponents(answers: PsqiAnswers): PsqiComponents {
  // Component 1 — Subjective sleep quality: Question 9 score, direct.
  const subjectiveSleepQuality = answers.overallSleepQuality;

  // Component 2 — Sleep latency: recoded Q2 minutes + Q5a frequency, then cut into 0-3.
  const latencySum = scoreLatencyMinutes(answers.sleepLatencyMinutes) + answers.disturbances.cannotSleep30;
  const sleepLatency = scoreFromCutoffs(latencySum, [0, 2, 4]);

  // Component 3 — Sleep duration: hours of actual sleep.
  const hours = answers.sleepDurationHours;
  const sleepDuration = hours > 7 ? 0 : hours >= 6 ? 1 : hours >= 5 ? 2 : 3;

  // Component 4 — Habitual sleep efficiency: (hours asleep / hours in bed) * 100%.
  const timeInBedHours = calculateTimeInBedHours(answers.bedTime, answers.wakeTime);
  const efficiency = timeInBedHours > 0 ? Math.min(100, (answers.sleepDurationHours / timeInBedHours) * 100) : 0;
  const sleepEfficiency = efficiency > 85 ? 0 : efficiency >= 75 ? 1 : efficiency >= 65 ? 2 : 3;

  // Component 5 — Sleep disturbances: sum of 5b-5j (5a is used in Component 2), then cut into 0-3.
  const { wakeNight, bathroom, breathing, coughSnore, tooCold, tooHot, badDreams, pain, other } = answers.disturbances;
  const disturbanceSum = wakeNight + bathroom + breathing + coughSnore + tooCold + tooHot + badDreams + pain + other;
  const sleepDisturbances = scoreFromCutoffs(disturbanceSum, [0, 9, 18]);

  // Component 6 — Use of sleep medication: Question 6 score, direct.
  const sleepMedication = answers.sleepMedicationFreq;

  // Component 7 — Daytime dysfunction: sum of Q7 + Q8, then cut into 0-3.
  const dysfunctionSum = answers.troubleStayingAwake + answers.enthusiasmProblem;
  const daytimeDysfunction = scoreFromCutoffs(dysfunctionSum, [0, 2, 4]);

  return {
    subjectiveSleepQuality,
    sleepLatency,
    sleepDuration,
    sleepEfficiency,
    sleepDisturbances,
    sleepMedication,
    daytimeDysfunction,
  };
}

/**
 * Calculates the full PSQI result: the 7 components plus the global score
 * (their sum, 0-21). Higher = worse sleep quality. A global score above 5 is
 * the published cutoff distinguishing "poor" from "good" sleepers.
 */
export function calculatePSQI(answers: PsqiAnswers): PsqiResult {
  const components = calculatePsqiComponents(answers);
  const rawScore = Object.values(components).reduce((total, value) => total + value, 0);
  const percentage = Math.round((rawScore / MAX_RAW_SCORE) * 100);

  const levelKey: PsqiLevel = rawScore <= 5 ? "good" : rawScore <= 10 ? "poor" : "very-poor";
  const level = levelKey === "good" ? "Good sleep quality" : levelKey === "poor" ? "Poor sleep quality" : "Very poor sleep quality";
  const tone = levelKey === "good" ? "positive" : levelKey === "poor" ? "caution" : "concern";
  const suggestProfessionalSupport = levelKey === "poor" || levelKey === "very-poor";

  return {
    userId: null,
    assessmentType: "psqi",
    assessmentLabel: ASSESSMENTS.psqi.label,
    snapshotTitle: ASSESSMENTS.psqi.snapshotTitle,
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
    components,
  };
}

function getInterpretation(level: PsqiLevel): string {
  switch (level) {
    case "good":
      return "Your sleep seems to be feeling restful lately.";
    case "poor":
      return "Your sleep may not be feeling as restful as you'd like.";
    case "very-poor":
    default:
      return "Your sleep may be affecting how rested or refreshed you feel. Talking with a professional may help.";
  }
}
