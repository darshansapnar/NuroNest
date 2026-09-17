import { describe, expect, it } from "vitest";

import { calculateWHO5 } from "./who5";
import { calculateGAD7, GAD7_QUESTIONS } from "./gad7";
import { calculatePHQ9, PHQ9_QUESTIONS } from "./phq9";
import { calculatePSS10 } from "./pss10";
import { calculatePSQI } from "./psqi";
import { SCORE_RANGES } from "./ranges";

/**
 * These tests exist so the "Understanding your score" display data can never
 * silently drift from the real scoring cutoffs. For every assessment, every
 * range boundary (min and max) is fed back into the real calculate* function
 * and must produce exactly the levelKey the range claims.
 */

function assertRangesMatchLevelKeys(
  ranges: { min: number; max: number; levelKey: string }[],
  levelKeyForScore: (score: number) => string,
) {
  for (const range of ranges) {
    expect(levelKeyForScore(range.min)).toBe(range.levelKey);
    expect(levelKeyForScore(range.max)).toBe(range.levelKey);
  }
}

describe("SCORE_RANGES matches the real scoring cutoffs exactly", () => {
  it("who5: rawScore bands agree with calculateWHO5's percentage-based levelKey", () => {
    // calculateWHO5 sums per-question answers (missing ones default to 0), so
    // putting the whole target rawScore on question 1 alone hits an exact sum
    // — same trick already used for the other single-cutoff instruments below.
    assertRangesMatchLevelKeys(SCORE_RANGES.who5, (rawScore) => calculateWHO5({ 1: rawScore }).levelKey);
  });

  it("gad7: rawScore bands agree with calculateGAD7's levelKey", () => {
    assertRangesMatchLevelKeys(SCORE_RANGES.gad7, (rawScore) => {
      const answers = { [GAD7_QUESTIONS[0].id]: rawScore };
      return calculateGAD7(answers).levelKey;
    });
  });

  it("phq9: rawScore bands agree with calculatePHQ9's levelKey", () => {
    assertRangesMatchLevelKeys(SCORE_RANGES.phq9, (rawScore) => {
      const answers = { [PHQ9_QUESTIONS[0].id]: rawScore };
      return calculatePHQ9(answers).levelKey;
    });
  });

  it("pss10: rawScore bands agree with calculatePSS10's levelKey", () => {
    assertRangesMatchLevelKeys(SCORE_RANGES.pss10, (rawScore) => {
      // Items 4, 5, 7, 8 are reverse-scored; set them to 4 so they each
      // contribute 0, isolating item 1's raw value as the total score.
      const answers = { 1: rawScore, 4: 4, 5: 4, 7: 4, 8: 4 };
      return calculatePSS10(answers).levelKey;
    });
  });

  it("psqi: rawScore bands agree with calculatePSQI's levelKey", () => {
    const noDisturbances = {
      cannotSleep30: 0,
      wakeNight: 0,
      bathroom: 0,
      breathing: 0,
      coughSnore: 0,
      tooCold: 0,
      tooHot: 0,
      badDreams: 0,
      pain: 0,
      other: 0,
    };

    // PSQI's global score is a sum of 7 components (each 0-3), so hitting an
    // exact target rawScore takes a hand-built answer set per boundary,
    // rather than one generic score->answers formula. Each comment shows the
    // component-by-component sum.
    const scenarios: { rawScore: number; levelKey: string; answers: Parameters<typeof calculatePSQI>[0] }[] = [
      {
        // all components 0
        rawScore: 0,
        levelKey: "good",
        answers: {
          bedTime: "22:00",
          wakeTime: "06:00",
          sleepLatencyMinutes: 0,
          sleepDurationHours: 8,
          disturbances: noDisturbances,
          sleepMedicationFreq: 0,
          troubleStayingAwake: 0,
          enthusiasmProblem: 0,
          overallSleepQuality: 0,
        },
      },
      {
        // component1=3 (quality) + component6=2 (medication) = 5
        rawScore: 5,
        levelKey: "good",
        answers: {
          bedTime: "22:00",
          wakeTime: "06:00",
          sleepLatencyMinutes: 0,
          sleepDurationHours: 8,
          disturbances: noDisturbances,
          sleepMedicationFreq: 2,
          troubleStayingAwake: 0,
          enthusiasmProblem: 0,
          overallSleepQuality: 3,
        },
      },
      {
        // component1=3 + component6=3 = 6
        rawScore: 6,
        levelKey: "poor",
        answers: {
          bedTime: "22:00",
          wakeTime: "06:00",
          sleepLatencyMinutes: 0,
          sleepDurationHours: 8,
          disturbances: noDisturbances,
          sleepMedicationFreq: 3,
          troubleStayingAwake: 0,
          enthusiasmProblem: 0,
          overallSleepQuality: 3,
        },
      },
      {
        // component1=3 + component3=3 (4h in a 4h bed keeps efficiency=100%) + component6=3 + component7=1 (dysfunctionSum=1) = 10
        rawScore: 10,
        levelKey: "poor",
        answers: {
          bedTime: "02:00",
          wakeTime: "06:00",
          sleepLatencyMinutes: 0,
          sleepDurationHours: 4,
          disturbances: noDisturbances,
          sleepMedicationFreq: 3,
          troubleStayingAwake: 1,
          enthusiasmProblem: 0,
          overallSleepQuality: 3,
        },
      },
      {
        // same as above but dysfunctionSum=3 -> component7=2, totaling 11
        rawScore: 11,
        levelKey: "very-poor",
        answers: {
          bedTime: "02:00",
          wakeTime: "06:00",
          sleepLatencyMinutes: 0,
          sleepDurationHours: 4,
          disturbances: noDisturbances,
          sleepMedicationFreq: 3,
          troubleStayingAwake: 2,
          enthusiasmProblem: 1,
          overallSleepQuality: 3,
        },
      },
      {
        // every component maxed at 3 -> 21
        rawScore: 21,
        levelKey: "very-poor",
        answers: {
          bedTime: "22:00",
          wakeTime: "08:00", // 10h in bed
          sleepLatencyMinutes: 90,
          sleepDurationHours: 3, // <5h -> component3=3; 3/10h -> efficiency 30% -> component4=3
          disturbances: {
            ...noDisturbances,
            cannotSleep30: 3,
            wakeNight: 3,
            bathroom: 3,
            breathing: 3,
            coughSnore: 3,
            tooCold: 3,
            tooHot: 3,
            badDreams: 3,
          },
          sleepMedicationFreq: 3,
          troubleStayingAwake: 3,
          enthusiasmProblem: 3,
          overallSleepQuality: 3,
        },
      },
    ];

    for (const scenario of scenarios) {
      const result = calculatePSQI(scenario.answers);
      expect(result.rawScore).toBe(scenario.rawScore);
      expect(result.levelKey).toBe(scenario.levelKey);
    }

    // Confirms the scenarios above exercise every boundary declared in SCORE_RANGES.psqi.
    const coveredScores = new Set(scenarios.map((s) => s.rawScore));
    const declaredBoundaries = SCORE_RANGES.psqi.flatMap((range) => [range.min, range.max]);
    for (const boundary of declaredBoundaries) {
      expect(coveredScores.has(boundary)).toBe(true);
    }
  });
});
