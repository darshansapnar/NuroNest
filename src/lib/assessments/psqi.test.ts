import { describe, expect, it } from "vitest";

import { calculatePSQI, calculatePsqiComponents, type PsqiAnswers } from "./psqi";

function baseAnswers(overrides: Partial<PsqiAnswers> = {}): PsqiAnswers {
  return {
    bedTime: "22:30",
    wakeTime: "06:30",
    sleepLatencyMinutes: 10,
    sleepDurationHours: 7.5,
    disturbances: {
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
    },
    sleepMedicationFreq: 0,
    troubleStayingAwake: 0,
    enthusiasmProblem: 0,
    overallSleepQuality: 0,
    ...overrides,
  };
}

describe("calculatePsqiComponents / calculatePSQI", () => {
  it("scores a consistently good-sleep profile as all-zero components and a good global score", () => {
    const result = calculatePSQI(baseAnswers());

    expect(result.components).toEqual({
      subjectiveSleepQuality: 0,
      sleepLatency: 0,
      sleepDuration: 0,
      sleepEfficiency: 0,
      sleepDisturbances: 0,
      sleepMedication: 0,
      daytimeDysfunction: 0,
    });
    expect(result.rawScore).toBe(0);
    expect(result.maxScore).toBe(21);
    expect(result.levelKey).toBe("good");
  });

  it("computes global score as the sum of the 7 components, matching a hand-computed poor-sleep profile", () => {
    const answers = baseAnswers({
      bedTime: "23:30",
      wakeTime: "06:00", // crosses midnight -> 6.5h in bed
      sleepLatencyMinutes: 45, // recodes to 2
      sleepDurationHours: 5,
      disturbances: {
        cannotSleep30: 2,
        wakeNight: 3,
        bathroom: 2,
        breathing: 0,
        coughSnore: 1,
        tooCold: 0,
        tooHot: 0,
        badDreams: 1,
        pain: 0,
        other: 0,
      },
      sleepMedicationFreq: 2,
      troubleStayingAwake: 2,
      enthusiasmProblem: 2,
      overallSleepQuality: 2,
    });

    const components = calculatePsqiComponents(answers);
    expect(components).toEqual({
      subjectiveSleepQuality: 2, // Q9 direct
      sleepLatency: 2, // (2 [45min] + 2 [5a]) = 4 -> component 2
      sleepDuration: 2, // 5 hours -> >=5 and <6
      sleepEfficiency: 1, // 5 / 6.5 = 76.9% -> 75-84%
      sleepDisturbances: 1, // sum of 5b-5j = 3+2+0+1+0+0+1+0+0 = 7 -> 1-9
      sleepMedication: 2, // Q6 direct
      daytimeDysfunction: 2, // 2 + 2 = 4 -> 3-4
    });

    const result = calculatePSQI(answers);
    expect(result.rawScore).toBe(12);
    expect(result.levelKey).toBe("very-poor");
  });

  it("excludes Q5a (cannotSleep30) from the sleep disturbances component (it only feeds sleep latency)", () => {
    const withHighCannotSleep = calculatePsqiComponents(
      baseAnswers({ disturbances: { ...baseAnswers().disturbances, cannotSleep30: 3 } }),
    );
    // cannotSleep30=3 pushes sleep latency up, but disturbances (5b-5j) stay all 0.
    expect(withHighCannotSleep.sleepDisturbances).toBe(0);
    expect(withHighCannotSleep.sleepLatency).toBeGreaterThan(0);
  });

  it("combines recoded latency minutes with Q5a frequency, then re-cuts the sum into the 0-3 component (with Q5a=0)", () => {
    // recoded minutes: <=15=0, 16-30=1, 31-60=2, >60=3; then (recoded + Q5a) is
    // itself cut at [0, 2, 4] into the final component score.
    expect(calculatePsqiComponents(baseAnswers({ sleepLatencyMinutes: 15 })).sleepLatency).toBe(0); // recoded 0 -> sum 0
    expect(calculatePsqiComponents(baseAnswers({ sleepLatencyMinutes: 16 })).sleepLatency).toBe(1); // recoded 1 -> sum 1
    expect(calculatePsqiComponents(baseAnswers({ sleepLatencyMinutes: 60 })).sleepLatency).toBe(1); // recoded 2 -> sum 2
    expect(calculatePsqiComponents(baseAnswers({ sleepLatencyMinutes: 61 })).sleepLatency).toBe(2); // recoded 3 -> sum 3
  });

  it("lets a high Q5a frequency push the sleep latency component up independently of minutes", () => {
    const withoutQ5a = calculatePsqiComponents(
      baseAnswers({ sleepLatencyMinutes: 61, disturbances: { ...baseAnswers().disturbances, cannotSleep30: 0 } }),
    ).sleepLatency;
    const withMaxQ5a = calculatePsqiComponents(
      baseAnswers({ sleepLatencyMinutes: 61, disturbances: { ...baseAnswers().disturbances, cannotSleep30: 3 } }),
    ).sleepLatency;

    expect(withoutQ5a).toBe(2); // recoded 3 + Q5a 0 = sum 3 -> component 2
    expect(withMaxQ5a).toBe(3); // recoded 3 + Q5a 3 = sum 6 -> component 3
  });

  it("recodes sleep duration hours at the documented cutoffs (>7=0, 6-7=1, 5-6=2, <5=3)", () => {
    expect(calculatePsqiComponents(baseAnswers({ sleepDurationHours: 7.5 })).sleepDuration).toBe(0);
    expect(calculatePsqiComponents(baseAnswers({ sleepDurationHours: 7 })).sleepDuration).toBe(1);
    expect(calculatePsqiComponents(baseAnswers({ sleepDurationHours: 6 })).sleepDuration).toBe(1);
    expect(calculatePsqiComponents(baseAnswers({ sleepDurationHours: 5.5 })).sleepDuration).toBe(2);
    expect(calculatePsqiComponents(baseAnswers({ sleepDurationHours: 5 })).sleepDuration).toBe(2);
    expect(calculatePsqiComponents(baseAnswers({ sleepDurationHours: 4.9 })).sleepDuration).toBe(3);
  });

  it("computes sleep efficiency from time in bed (handling the overnight wrap) at the documented cutoffs", () => {
    // 8 hours in bed (22:00 -> 06:00), vary sleep duration to hit each efficiency bucket.
    const componentsFor = (hours: number) =>
      calculatePsqiComponents(baseAnswers({ bedTime: "22:00", wakeTime: "06:00", sleepDurationHours: hours }))
        .sleepEfficiency;

    expect(componentsFor(7)).toBe(0); // 87.5% > 85%
    expect(componentsFor(6.8)).toBe(1); // 85% exactly -> not >85, falls to 75-84 bucket
    expect(componentsFor(6)).toBe(1); // 75%
    expect(componentsFor(5.5)).toBe(2); // 68.75%
    expect(componentsFor(4)).toBe(3); // 50%
  });

  it("does not let sleep duration exceed 100% efficiency even if self-reported inconsistently", () => {
    const components = calculatePsqiComponents(
      baseAnswers({ bedTime: "23:00", wakeTime: "23:30", sleepDurationHours: 8 }),
    );
    expect(components.sleepEfficiency).toBe(0);
  });

  it("produces a different result depending on the selected answers", () => {
    const good = calculatePSQI(baseAnswers());
    const poor = calculatePSQI(
      baseAnswers({
        overallSleepQuality: 3,
        sleepDurationHours: 3,
        sleepLatencyMinutes: 90,
        sleepMedicationFreq: 3,
        troubleStayingAwake: 3,
        enthusiasmProblem: 3,
      }),
    );

    expect(good.rawScore).not.toBe(poor.rawScore);
    expect(good.levelKey).not.toBe(poor.levelKey);
  });

  it("never sets safetyFlag or suggestFurtherExploration", () => {
    const result = calculatePSQI(baseAnswers({ overallSleepQuality: 3 }));
    expect(result.safetyFlag).toBe(false);
    expect(result.suggestFurtherExploration).toBe(false);
  });

  it("ignores item 10 (bed partner) data entirely — it has no channel into the global score", () => {
    const withoutItem10 = calculatePSQI(baseAnswers());
    // PsqiAnswers has no field for item 10; simulate a caller bundling it in
    // anyway (e.g. from a shared form-state object) and confirm it's inert.
    const withItem10Bundled = calculatePSQI({
      ...baseAnswers(),
      hasBedPartner: true,
    } as unknown as Parameters<typeof calculatePSQI>[0]);

    expect(withItem10Bundled.rawScore).toBe(withoutItem10.rawScore);
    expect(withItem10Bundled.components).toEqual(withoutItem10.components);
  });

  it("is history/backend ready: userId defaults to null and responses preserves the raw answers", () => {
    const answers = baseAnswers({ overallSleepQuality: 1 });
    const result = calculatePSQI(answers);

    expect(result.userId).toBeNull();
    expect(result.responses).toEqual(answers);
  });
});
